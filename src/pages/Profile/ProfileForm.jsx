// src/components/ProfileForm.jsx
import React from "react";
import { Form, Input, Button } from "antd";


const ProfileForm = ({ initialValues, onSave, form}) => {

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={initialValues}
      onFinish={onSave}
      
    >
      <Form.Item name="name" label="Name">
        <Input />
      </Form.Item>
      

      <Form.Item name="email" label="Email Address">
        <Input readOnly="true" />
      </Form.Item>

      <Form.Item name="role" label="Role">
        <Input readOnly="true" />
      </Form.Item>

      <Form.Item name="status" label="status">
        <Input readOnly="true" />
      </Form.Item>


      {/* <div className="flex justify-end space-x-2">
        <Button onClick={onCancel} >Cancel</Button>
        <Button type="primary" htmlType="submit">Save</Button>
      </div> */}
    </Form>
  );
};

export default ProfileForm;