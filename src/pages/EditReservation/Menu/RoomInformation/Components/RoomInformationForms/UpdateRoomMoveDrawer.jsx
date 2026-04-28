import React, { useEffect } from "react";
import { Drawer, Form, DatePicker, Button, Select, Card, Input } from "antd";

const { TextArea } = Input;

const RoomFields = ({ prefix, title }) => (
  <Card
    title={title}
    size="small"
    className={`${prefix === "to" ? "mt-6" : ""} shadow-md rounded-lg border-none`}
  >
    <div className="grid grid-cols-2 gap-4">
      <Form.Item label="Arrival Date" name={[prefix, "arrivalDate"]}>
        <DatePicker className="w-full" />
      </Form.Item>
      <Form.Item label="Departure Date" name={[prefix, "departureDate"]}>
        <DatePicker className="w-full" />
      </Form.Item>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <Form.Item
        label="Room Type"
        name={[prefix, "roomType"]}
        rules={[{ required: true }]}
      >
        <Select
          placeholder="Select Room Type"
          options={[
            {
              value: "Deluxe Bangalow Double",
              label: "Deluxe Bangalow Double",
            },
            { value: "Deluxe Bangalow", label: "Deluxe Bangalow" },
          ]}
        />
      </Form.Item>

      <Form.Item
        label="Room No"
        name={[prefix, "roomNo"]}
        rules={[{ required: true }]}
      >
        <Select
          placeholder="Select Room No"
          options={[
            { value: "DBD 1001", label: "DBD 1001" },
            { value: "DBD 1003", label: "DBD 1003" },
          ]}
        />
      </Form.Item>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <Form.Item
        label="Floor Type"
        name={[prefix, "floorType"]}
        rules={[{ required: true }]}
      >
        <Select
          placeholder="Select Floor Type"
          options={[
            { value: "floor 3", label: "floor 3" },
            { value: "floor 2", label: "floor 2" },
          ]}
        />
      </Form.Item>

      <Form.Item
        label="Room Status"
        name={[prefix, "roomStatus"]}
        rules={[{ required: true }]}
      >
        <Select
          placeholder="Select Room Status"
          options={[
            { value: "Active", label: "Active" },
            { value: "Instatus", label: "Instatus" },
          ]}
        />
      </Form.Item>
    </div>

    <Form.Item
      label="Reason"
      name={[prefix, "reason"]}
      rules={[{ required: true }]}
    >
      <TextArea />
    </Form.Item>
  </Card>
);

const UpdateRoomMoveDrawer = ({
  open,
  onClose,
  reservationId,
  selectedData,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (selectedData) {
        form.setFieldsValue(selectedData);
      } else {
        form.resetFields();
      }
    }
  }, [selectedData, open, form]);

  const onFinish = (values) => {
    console.log("Submitted Data:", {
      reservationId,
      ...values,
    });
    onClose();
    form.resetFields();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size={480}
      destroyOnClose
      title={
        <div className="flex justify-between items-center">
          <span>Room Move</span>
          <Button type="primary" onClick={() => form.submit()}>
            Update
          </Button>
        </div>
      }
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        autoComplete="off"
      >
        {/* Current Room*/}
        <div className="mb-6">
          <RoomFields prefix="from" />
        </div>

        {/* Move Room */}
        <RoomFields prefix="to" />
      </Form>
    </Drawer>
  );
};

export default UpdateRoomMoveDrawer;
