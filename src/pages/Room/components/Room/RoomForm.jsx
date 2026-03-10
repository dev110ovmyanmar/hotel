import React, { useEffect } from "react";
import { Form, Input, Button, Select, Drawer } from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import { queryClient } from "../../../../app/queryClient";
import FormButton from "../../../../component/FormButtons/FormButtons";
import {
  createRoom,
  editRoom,
  roomDetails,
  roomMeta,
} from "../../../../api/roomApi";

const RoomForm = ({
  mode,
  setMode,
  selectedData,
  setSelectedData,
  drawerOpen,
  setDrawerOpen,
  setPage,
}) => {
  const [form] = Form.useForm();

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const initData = queryClient.getQueryData(["initData", {}]);

  const statuses = initData?.statuses?.status?.map((status) => ({
    value: status.uuid,
    label: status.name,
  }));

  const { data: roomMetaData } = useApiQuery({
    fetchQueryName: "roomMetaData",
    fetchQueryFunction: roomMeta,
  });

  const roomType = roomMetaData?.room_types?.map((type) => ({
    value: type.uuid,
    label: type.name,
  }));

  const floors = roomMetaData?.floors?.map((floor) => ({
    value: floor.uuid,
    label: floor.name,
  }));

  const createRooms = useApiMutation({
    mutationFn: createRoom,
    invalidateKeys: [["roomData"]],
  });

  const editRooms = useApiMutation({
    mutationFn: editRoom,
    invalidateKeys: [["roomData"]],
  });

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "roomData",
    fetchQueryFunction: roomDetails,
    params: { uuid: selectedData?.uuid },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  useEffect(() => {
    if (!isAdd && data) {
      form.setFieldsValue({
        roomNo: data?.roomNo,
        status: data?.status?.uuid,
        floorUuid: data?.floor?.uuid,
        roomTypeUuid: data?.roomType?.uuid,
      });

      setSelectedData(data);
    }
  }, [data]);

  const onFinish = (values) => {
    if (isAdd) {
      const createValues = {
        ...values,
        status: { uuid: values.status },
        roomType: { uuid: values.roomTypeUuid },
        floor: { uuid: values.floorUuid },
      };

      createRooms.mutate(createValues, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          setPage(1);
          Toast.success("Room Created Successfully!");
        },
      });
    }
    if (isEdit) {
      const editValues = {
        ...values,
        status: { uuid: values.status },
        roomType: { uuid: values.roomTypeUuid },
        floor: { uuid: values.floorUuid },
        uuid: data?.uuid,
      };

      editRooms.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Room Updated Successfully!");
        },
      });
    }
  };

  return (
    <div>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size={500}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "view"
                ? "Room Details"
                : mode === "edit"
                  ? "Edit Room"
                  : "Create Room"}
            </span>
            {isView ? (
              <Button
                type="primary"
                onClick={() => {
                  setMode("edit");
                }}
              >
                Edit
              </Button>
            ) : (
              <FormButton
                onClick={() => form.submit()}
                isPending={createRoom.isLoading || editRoom.isLoading}
                mode={mode}
              />
            )}
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          style={{ width: "100%" }}
          onFinish={onFinish}
          disabled={isView}
        >
          <Form.Item
            label="Room No"
            name="roomNo"
            rules={[{ required: true, message: "Please enter room number" }]}
          >
            <Input placeholder="Enter Room No" />
          </Form.Item>

          <Form.Item
            label="Floor"
            name="floorUuid"
            rules={[{ required: true, message: "Please select a floor" }]}
          >
            <Select options={floors} placeholder="Select Floor" />
          </Form.Item>

          <Form.Item
            label="Room Type"
            name="roomTypeUuid"
            rules={[{ required: true, message: "Please select a room type" }]}
          >
            <Select options={roomType} placeholder="Select Room Type" />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select options={statuses} placeholder="Select Status" />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default RoomForm;
