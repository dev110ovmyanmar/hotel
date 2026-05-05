import { Button, Drawer, Input, Form, Select } from "antd";
import Toast from "../../../../component/Toast/Toast";
import {
  createRoomAttributeValue,
  editRoomAttributeValue,
  roomMeta,
} from "../../../../api/roomApi";
import useApiQuery from "../../../../hooks/useApiQuery";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import { queryClient } from "../../../../app/queryClient";
import { useEffect } from "react";
import FormButtons from "../../../../component/FormButtons/FormButtons";

const RoomAttributesForm = ({
  mode,
  open,
  setDrawerOpen,
  roomUuid,
  selectedAttribute,
}) => {
  const [form] = Form.useForm();

  const isAdd = mode === "add";
  const isEdit = mode === "edit";

  const { data: roomMetaData } = useApiQuery({
    fetchQueryName: "roomMetaData",
    fetchQueryFunction: roomMeta,
  });

  const roomAttributes = roomMetaData?.room_attributes?.map((attr) => ({
    value: attr.uuid,
    label: attr.name,
  }));

  const createAttribute = useApiMutation({
    mutationFn: createRoomAttributeValue,
    invalidateKeys: [["roomData", { uuid: roomUuid }]],
  });

  const editAttribute = useApiMutation({
    mutationFn: editRoomAttributeValue,
    invalidateKeys: [["roomData"]],
  });

  useEffect(() => {
    if (open) {
      if (isEdit && selectedAttribute) {
        form.setFieldsValue({
          roomAttributeUuid: selectedAttribute?.roomAttribute?.uuid,
          value: selectedAttribute?.value,
        });
      } else {
        form.resetFields();
      }
    } else {
      form.resetFields();
    }
  }, [open, selectedAttribute, mode, form]);

  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedData(null);
    form.resetFields();
  };

  // const onFinish = (values) => {
  //   if (isAdd) {
  //     const payload = {
  //       value: values.value,
  //       roomAttribute: { uuid: values.roomAttributeUuid },
  //       room: { uuid: roomUuid },
  //     };

  //     createAttribute.mutate(payload, {
  //       onSuccess: () => {
  //         queryClient.invalidateQueries(["roomData", { uuid: roomUuid }]);
  //         form.resetFields();
  //         setDrawerOpen(false);
  //         Toast.success("Room Attribute Value Created Successfully!");
  //       },
  //     });
  //   }
  //   if (isEdit) {
  //     const editValues = {
  //       uuid: selectedAttribute?.uuid,
  //       value: values.value,
  //       roomAttribute: { uuid: values.roomAttributeUuid },
  //       room: { uuid: roomUuid },
  //     };

  //     editAttribute.mutate(editValues, {
  //       onSuccess: () => {
  //         queryClient.invalidateQueries(["roomData", { uuid: roomUuid }]);
  //         setDrawerOpen(false);
  //         Toast.success("Room Attribute value Updated Successfully!");
  //       },
  //     });
  //   }
  // };
  const onFinish = (values) => {
    if (isAdd) {
      const payload = {
        value: values.value,
        roomAttribute: { uuid: values.roomAttributeUuid },
        room: { uuid: roomUuid },
      };

      createAttribute.mutate(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries(["roomData", { uuid: roomUuid }]);
          form.resetFields();
          setDrawerOpen(false);
          Toast.success("Room Attribute Value Created Successfully!");
        },
      });
    }
    if (isEdit) {
      const editValues = {
        uuid: selectedAttribute?.uuid,
        value: values.value,
        roomAttribute: { uuid: values.roomAttributeUuid },
        room: { uuid: roomUuid },
      };

      editAttribute.mutate(editValues, {
        onSuccess: () => {
          queryClient.invalidateQueries(["roomData", { uuid: roomUuid }]);
          setDrawerOpen(false);
          Toast.success("Room Attribute value Updated Successfully!");
        },
      });
    }
  };

  return (
    <Drawer
      title={
        <div className="flex justify-between items-center">
          <span>
            {mode === "edit" ? "Edit Room Attribute" : "Add Room Attribute"}
          </span>
          <FormButtons
            onClick={() => form.submit()}
            isPending={createAttribute.isPending || editAttribute.isPending}
            mode={mode}
          />
        </div>
      }
      open={open}
      onClose={handleClose}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Room Attribute"
          name="roomAttributeUuid"
          rules={[{ required: true }]}
        >
          <Select
            options={roomAttributes}
            placeholder="Select Room Attribute"
          />
        </Form.Item>
        <Form.Item label="Value" name="value" rules={[{ required: true }]}>
          <Input placeholder="Enter Value" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default RoomAttributesForm;
