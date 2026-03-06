import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import Toast from "../../../component/Toast/Toast";

const SettingForm = ({ onFinish, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        key: initialValues.key,
        value: JSON.stringify(initialValues.value, null, 2)
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = (values) => {
    try {
      const parsedValue = JSON.parse(values.value);
      onFinish({ key: values.key, value: parsedValue, uuid: initialValues?.uuid || "" });
    } catch (e) {
      Toast.error("JSON Syntax Error! Please check your formatting.");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="Setting Key" name="key" rules={[{ required: true }]}>
        <Input placeholder="e.g. general" disabled={!!initialValues} />
      </Form.Item>
      <Form.Item label="JSON Configuration" name="value" rules={[{ required: true }]}>
        <Input.TextArea rows={18} className="font-mono text-xs p-4 bg-black text-green-400" />
      </Form.Item>
      <Button type="primary" htmlType="submit" block size="large">
        {initialValues ? "Update Configuration" : "Add Configuration"}
      </Button>
    </Form>
  );
};

export default SettingForm;