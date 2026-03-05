import React from "react";
import { Form, Input, Button, message } from "antd";
import Toast from "../../component/Toast/Toast";

const SettingForm = ({ onFinish }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    try {
      // 2. Transform the String into JSON
      const parsedValue = JSON.parse(values.value);
      
      onFinish({ key: values.key, value: parsedValue });
      form.resetFields();
    } catch (e) {
      Toast.error("JSON Error! Please check your brackets { } and quotes \" \".");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="Setting Key" name="key" rules={[{ required: true }]}>
        <Input placeholder="e.g. general" />
      </Form.Item>
      <Form.Item label="Data (Object {})" name="value" rules={[{ required: true }]}>
        <Input.TextArea rows={12} className="font-mono text-xs p-4 bg-gray-900 text-green-400" />
      </Form.Item>
      <Button type="primary" htmlType="submit" block size="large">Save New Setting</Button>
    </Form>
  );
};

export default SettingForm;