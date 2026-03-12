import { Drawer, Input, Form, Select, Switch } from "antd";
import Toast from "../../../../component/Toast/Toast";
import {
  createRoomTypeAmenity,
  editRoomTypeAmenity,
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
  roomTypeUuid,
  selectedAmenity,
}) => {
  const [form] = Form.useForm();

  const isAdd = mode === "add";
  const isEdit = mode === "edit";

  const { data: roomMetaData } = useApiQuery({
    fetchQueryName: "roomMetaData",
    fetchQueryFunction: roomMeta,
  });

  const roomTypeAmenities = roomMetaData?.amenities?.map((amenity) => ({
    value: amenity.uuid,
    label: amenity.name,
  }));

  const createRoomTypeAmenities = useApiMutation({
    mutationFn: createRoomTypeAmenity,
    invalidateKeys: [["roomTypeData", { uuid: roomTypeUuid }]],
  });

  const editRoomTypeAmenities = useApiMutation({
    mutationFn: editRoomTypeAmenity,
    invalidateKeys: [["roomTypeData"]],
  });

  useEffect(() => {
    if (isEdit && selectedAmenity) {
      form.setFieldsValue({
        roomTypeAmenityUuid: selectedAmenity?.amenity?.uuid,
        extraPrice: selectedAmenity?.extraPrice,
        isFree: selectedAmenity?.isFree ? 1 : 0,
      });
    } else {
      form.resetFields();
    }
  }, [selectedAmenity, mode]);

  const onFinish = (values) => {
    const payload = {
      extraPrice: values.extraPrice,
      isFree: Boolean(values.isFree),
      amenity: { uuid: values.roomTypeAmenityUuid },
      roomType: { uuid: roomTypeUuid },
    };

    if (isAdd) {
      createRoomTypeAmenities.mutate(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries([
            "roomTypeData",
            { uuid: roomTypeUuid },
          ]);
          form.resetFields();
          setDrawerOpen(false);
          Toast.success("Room Type Amenity Created Successfully!");
        },
      });
    }

    if (isEdit) {
      editRoomTypeAmenities.mutate(
        { uuid: selectedAmenity?.uuid, ...payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries([
              "roomTypeData",
              { uuid: roomTypeUuid },
            ]);
            setDrawerOpen(false);
            Toast.success("Room Type Amenity Updated Successfully!");
          },
        },
      );
    }
  };

  return (
    <Drawer
      title={
        <div className="flex justify-between items-center">
          <span>{mode === "edit" ? "Edit Attribute" : "Add Attribute"}</span>
          <FormButtons
            onClick={() => form.submit()}
            isPending={
              createRoomTypeAmenities.isPending ||
              editRoomTypeAmenities.isPending
            }
            mode={mode}
          />
        </div>
      }
      open={open}
      onClose={() => setDrawerOpen(false)}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Room Amenity"
          name="roomTypeAmenityUuid"
          rules={[{ required: true, message: "Select attribute" }]}
        >
          <Select options={roomTypeAmenities} placeholder="Select Attribute" />
        </Form.Item>

        <Form.Item
          label="Extra Price"
          name="extraPrice"
          rules={[{ required: true, message: "Please enter extra price" }]}
        >
          <Input addonAfter="MMK" />
        </Form.Item>

        {/* <Form.Item
          label="Is Free"
          name="isFree"
          rules={[{ required: true, message: "Is Free is required" }]}
        >
          <Select
            options={[
              { label: "Yes", value: 1 },
              { label: "No", value: 0 },
            ]}
          />
        </Form.Item> */}
        <Form.Item
          label="Is Free"
          name="isFree"
          valuePropName="checked"
          getValueFromEvent={(checked) => (checked ? 1 : 0)}
          rules={[{ required: true, message: "Is Free is required" }]}
        >
          <Switch checkedChildren="Yes" unCheckedChildren="No" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default RoomAttributesForm;
