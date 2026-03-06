// src/components/ProfileForm.jsx
import React from "react";
import { Form, Input, Button } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const ProfileForm = ({ initialValues, onSave, onCancel }) => {
  const [form] = Form.useForm();

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={initialValues}
      onFinish={onSave}
    >
      <Form.Item name="firstName" label="First Name">
        <Input />
      </Form.Item>
      <Form.Item name="lastName" label="Last Name">
        <Input />
      </Form.Item>
      <Form.Item name="dob" label="Date of Birth">
        <Input />
      </Form.Item>
      <Form.Item name="email" label="Email Address">
        <Input />
      </Form.Item>
      <Form.Item name="phone" label="Phone Number">
        <Input />
      </Form.Item>
      <Form.Item name="userRole" label="User Role">
        <Input disabled />
      </Form.Item>
      <div className="flex justify-end space-x-2">
        <Button onClick={onCancel} >Cancel</Button>
        <Button type="primary" htmlType="submit">Save</Button>
      </div>
    </Form>
  );
};

export default ProfileForm;