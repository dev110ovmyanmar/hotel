import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";

const SettingForm = ({ onFinish, initialValues, isSaving }) => {
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

  // const handleSubmit = (values) => {
  //   try {
  //     const parsedValue = JSON.parse(values.value);
  //     onFinish({ key: values.key, value: parsedValue, uuid: initialValues?.uuid || "" });
  //   } catch (e) {
  //     Toast.error("JSON Syntax Error! Please check your formatting.");
  //   }
  // };

  const handleSubmit = (values) => {
    // No try-catch needed because we aren't parsing JSON anymore

    onFinish({ 
      key: values.key, 
      value: values.value, // Sent as raw string
      uuid: initialValues?.uuid || "" 
    });
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
        Save
      </Button>
    </Form>
  );
};

export default SettingForm;