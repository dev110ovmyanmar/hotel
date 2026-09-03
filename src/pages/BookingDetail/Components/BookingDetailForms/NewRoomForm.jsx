import React from "react";
import { Drawer, Form, DatePicker, Button, Select, Card, Input } from "antd";

const { TextArea } = Input;

const RoomDetailsSection = ({ title }) => (
  <Card
    title={title}
    size="small"
    className="mb-10 shadow rounded border-none`"
  >
    <div className="grid grid-cols-2 gap-4">
      <Form.Item label="Arrival Date" name={["details", title, "arrivalDate"]}>
        <DatePicker className="w-full" />
      </Form.Item>

      <Form.Item
        label="Departure Date"
        name={["details", title, "departureDate"]}
      >
        <DatePicker className="w-full" />
      </Form.Item>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <Form.Item
        label="Room Type"
        name={["details", title, "roomType"]}
        rules={[{ required: true, message: "Please select room type" }]}
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
        name={["details", title, "roomNo"]}
        rules={[{ required: true, message: "Please select room number" }]}
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
  </Card>
);

const NewRoomForm = ({ open, onClose, reservationId }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Amend Booking Data:", {
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
      size={550}
      destroyOnClose
      title="Room Move"
      footer={
        <div className="flex justify-end gap-2">
          <Button type="primary" onClick={() => form.submit()}>
            Room Move
          </Button>
        </div>
      }
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={{ reason: "" }}
      >
        <div className="mb-6">
          <RoomDetailsSection />
        </div>

        <div className="mb-6">
          <RoomDetailsSection />
        </div>

        <Form.Item label="Reason" name="reason">
          <TextArea placeholder="Enter reason for room move..." />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default NewRoomForm;
