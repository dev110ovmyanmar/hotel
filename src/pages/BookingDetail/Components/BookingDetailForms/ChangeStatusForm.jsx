import React from "react";
import {
  Drawer,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Button,
  Space,
  Radio,
  Tag,
} from "antd";
import FormButtons from "../../../../component/FormButtons/FormButtons";

const ChangeStatusForm = ({ open, onClose, reservationId }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Change Status Data:", {
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
      size={500}
      destroyOnClose
      title={
        <div className="flex justify-between items-center">
          <span>Change Status</span>
          <FormButtons onClick={() => form.submit()} />
        </div>
      }
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label={
            <span className="font-bold text-md">Current Booking Status</span>
          }
          name="currentBookingStatus"
        >
          <div className="py-1">
            <Tag color="green" className="font-semibold  px-5  py-5   text-sm">
              Confirmed
            </Tag>
          </div>
        </Form.Item>

        <Form.Item
          label={
            <span className="font-bold text-md">Change Booking Status To</span>
          }
          name="changeBookingStatusTo"
        >
          <Radio.Group>
            <Space direction="vertical" className="w-full">
              <Radio value="checked_in">Booked</Radio>
              <Radio value="cancelled">Cancelled</Radio>
              <Radio value="cancelled">Confirmed</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ChangeStatusForm;
