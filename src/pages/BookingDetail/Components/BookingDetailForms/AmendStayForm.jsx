import React from "react";
import {
  Drawer,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Button,
  Space,
  Row,
  Col,
  TimePicker,
  Select,
} from "antd";
import FormButtons from "../../../../component/FormButtons/FormButtons";

const onChange = (value) => {
  console.log("changed", value);
};

const AmendStayForm = ({ open, onClose, reservationId }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    console.log("Amend Booking Data:", {
      reservationId,
      ...values,
    });

    onClose();
    form.resetFields();
  };

  const sharedProps = {
    mode: "spinner",
    min: 1,
    max: 10,
    defaultValue: 1,
    onChange,
    style: { width: 150 },
  };

  const childSharedProps = {
    mode: "spinner",
    min: 0,
    max: 10,
    defaultValue: 0,
    onChange,
    style: { width: 150 },
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size={550}
      destroyOnClose
      title={
        <div className="flex justify-between items-center">
          <span>Amend Stay</span>
          <FormButtons onClick={() => form.submit()} />
        </div>
      }
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
      
        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="Arrival Date" name="arrivalDate">
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item label="Arrival Time" name="arrivalTime" className="flex-1">
            <TimePicker className="w-full" format="h:mm A" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="Departure Date" name="departureDate">
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            label="Departure Time"
            name="departureTime"
            className="flex-1"
          >
            <TimePicker className="w-full" format="h:mm A" />
          </Form.Item>
        </div>

        <Form.Item label="Night" name="night" rules={[{ required: true }]}>
          <InputNumber  style={{ width: 240}} />
        </Form.Item>

        <div className="grid grid-cols-3 gap-4">
          <Form.Item label="Adult" name="adult" rules={[{ required: true }]}>
            <InputNumber
              {...sharedProps}
              placeholder="Outlined"
              //   readOnly={isView}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item label="Child" name="child" rules={[{ required: true }]}>
            <InputNumber
              {...childSharedProps}
              placeholder="Outlined"
              //   readOnly={isView}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Extra Bed"
            name="extraBed"
            rules={[{ required: true }]}
          >
            <InputNumber
              {...childSharedProps}
              placeholder="Outlined"
              //   readOnly={isView}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Form.Item
            label="Booking Source"
            name="bookingSource"
            rules={[{ required: true }]}
          >
            <Select
              value="confirmed"
              style={{ width: "100%" }}
              onChange={(value) => console.log(value)}
              options={[
                { value: "company", label: "Company" },
                { value: "company", label: "Company" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Source Type"
            name="sourceType"
            rules={[{ required: true }]}
          >
            <Select
              value="confirmed"
              style={{ width: "100%" }}
              onChange={(value) => console.log(value)}
              options={[
                { value: "company", label: "Company" },
                { value: "company", label: "Company" },
              ]}
            />
          </Form.Item>
        </div>
      </Form>
    </Drawer>
  );
};

export default AmendStayForm;
