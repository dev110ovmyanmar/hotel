import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select, Spin } from "antd";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import { useApiQuery } from "../../../../hooks/useApiQuery";
import Toast from "../../../../component/Toast/Toast";
import { upsertRoom, fetchRoomType, roomMeta } from "../../../../api/roomApi";
import { QueryClient, useQueryClient } from "@tanstack/react-query";

const RoomForm = ({ initialValues = {}, mode, onSuccess }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [isDataReady, setIsDataReady] = useState(false);

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const initData = queryClient.getQueryData(["initData", {}]);

  const statuses = initData?.statuses?.status?.map((status) => ({
    value: status.uuid,
    label: status.name,
  }));

  const { data, isLoading } = useApiQuery({
    fetchQueryName: "roomMetaData",
    fetchQueryFunction: roomMeta,
  });

  const roomType = data?.room_types?.map((type) => ({
    value: type.uuid,
    label: type.name,
  }));

  const floors = data?.floors?.map((floor) => ({
    value: floor.uuid,
    label: floor.name,
  }));

  const { mutate, isPending } = useApiMutation({
    mutationFn: upsertRoom,
    options: {
      onSuccess: () => {
        Toast.success(
          isEdit ? "Updated successfully!" : "Created successfully!",
        );
        form.resetFields();
        onSuccess?.();
      },
      onError: () => {
        Toast.error("Operation failed!");
      },
    },
  });

  useEffect(() => {
    if (
      initialValues &&
      (isEdit || isView) &&
      roomType?.length &&
      floors?.length
    ) {
      form.setFieldsValue({
        roomNo: initialValues.roomNo,
        pricePerNight: initialValues.pricePerNight,
        statusUuid: initialValues.status?.uuid,
        roomTypeUuid: initialValues.roomType?.uuid,
        floorUuid: initialValues.floor?.uuid,
      });
      setIsDataReady(true);
    } else if (isAdd && roomType?.length && floors?.length) {
      setIsDataReady(true);
    }
  }, [initialValues, roomType, floors, form, isEdit, isView, isAdd]);

  const handleSubmit = (values) => {
    const payload = {
      uuid: initialValues?.uuid,
      roomNo: values.roomNo,
      pricePerNight: values.pricePerNight,
      status: { uuid: values.statusUuid },
      roomType: { uuid: values.roomTypeUuid },
      floor: { uuid: values.floorUuid },
      propertyUuid: initData?.property?.uuid,
    };
    mutate(payload);
  };
  const handleCancel = () => {
    form.resetFields();
  };

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Form
      form={form}
      layout="vertical"
      style={{ width: "100%" }}
      disabled={isView}
      onFinish={handleSubmit}
    >
      <h1 className="form-subtitle">Room</h1>

      <Form.Item
        label="Room Type"
        name="roomTypeUuid"
        rules={[{ required: true, message: "Please select a room type" }]}
      >
        <Select options={roomType} placeholder="Select Room Type" />
      </Form.Item>

      <Form.Item
        label="Floor"
        name="floorUuid"
        rules={[{ required: true, message: "Please select a floor" }]}
      >
        <Select options={floors} placeholder="Select Floor" />
      </Form.Item>

      <Form.Item
        label="Status"
        name="statusUuid"
        rules={[{ required: true, message: "Please select a status" }]}
      >
        <Select options={statuses} placeholder="Select Status" />
      </Form.Item>

      <Form.Item
        label="Room No"
        name="roomNo"
        rules={[{ required: true, message: "Please enter room number" }]}
      >
        <Input placeholder="Enter Room No" />
      </Form.Item>

      <Form.Item
        label="Price Per Night"
        name="pricePerNight"
        rules={[{ required: true, message: "Please enter price per night" }]}
      >
        <Input placeholder="Enter Price" />
      </Form.Item>

      <Form.Item>
        <div className="flex justify-between gap-4">
          <Button type="default" onClick={handleCancel} block>
            Cancel
          </Button>
          {!isView && (
            <Button type="primary" htmlType="submit" block loading={isPending}>
              Save
            </Button>
          )}
        </div>
      </Form.Item>
    </Form>
  );
};

export default RoomForm;
