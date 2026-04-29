import React, { useState } from "react";
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
  Card,
  Typography,
  Tag,
  Radio,
  Table,
} from "antd";
import FormItem from "antd/es/form/FormItem";
import TextArea from "antd/es/input/TextArea";
const { Text } = Typography;

const onChange = (value) => {
  console.log("changed", value);
};

const AddNewServiceOrderForm = ({ open, onClose, reservationId }) => {
  const [form] = Form.useForm();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSubmit = (values) => {
    console.log("Searching with:", values);
  };

  const sharedProps = {
    mode: "spinner",
    min: 1,
    max: 10,
    defaultValue: 1,
    onChange,
    style: { width: 150 },
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size={550}
      destroyOnClose
       initialValues={{
        quantity: 1,
      }}
      title={
        <div className="flex justify-between items-center">
          <span>Add New Service Order</span>
          <Button type="primary" onClick={() => form.submit()}>
            Create
          </Button>
        </div>
      }
     
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="Service Order Date" name="serviceOrderDate">
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item label="Service Order Time" name="ServiceOrderTime">
            <TimePicker className="w-full" format="h:mm A" />
          </Form.Item>
        </div>
        <Form.Item label="Room No" name="roomNo" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Select Service"
            name="selectService"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Select Select Service"
              style={{ width: "100%" }}
              options={[
                { value: "aa", label: "aa" },
                { value: "bb", label: "bb" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Service Package" name="servicePackage">
            <Select
              placeholder="Select Service Package"
              style={{ width: "100%" }}
              options={[
                { value: "aa", label: "aa" },
                { value: "bb", label: "bb" },
              ]}
            />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true }]}
          >
            <InputNumber
              {...sharedProps}
              placeholder="Outlined"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Unit Price"
            name="unitPrice"
            rules={[{ required: true }]}
          >
            <InputNumber
              className="!w-full"
              min={0}
              placeholder="Enter Unit Price"
              suffix="MMK"
            />
          </Form.Item>
        </div>

        <Form.Item
          label="Sub Total"
          name="subTotal"
          rules={[{ required: true }]}
        >
          <InputNumber
            className="!w-full"
            min={0}
            placeholder="Enter Sub Total"
            suffix="MMK"
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="Select Tax" name="selectTax">
            <Select
              placeholder="Select Tax"
              style={{ width: "100%" }}
              options={[
                { value: "aa", label: "aa" },
                { value: "bb", label: "bb" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Tax Amount" name="taxAmount">
            <InputNumber
              className="!w-full"
              min={0}
              placeholder="Enter Total tax"
              suffix="MMK"
            />
          </Form.Item>
        </div>
        <Form.Item
          label="Total Amount"
          name="totalAmount"
          rules={[{ required: true }]}
        >
          <InputNumber
            className="!w-full"
            min={0}
            placeholder="Enter Total Amount"
            suffix="MMK"
          />
        </Form.Item>

        <Form.Item label="Status" name="status" rules={[{ required: true }]}>
          <Select
            placeholder="Select Status"
            style={{ width: "100%" }}
            options={[
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
            ]}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddNewServiceOrderForm;
