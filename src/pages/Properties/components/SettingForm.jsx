import React, { useEffect } from "react";
import { Form, Input, Button, Radio, InputNumber, Switch, Alert } from "antd";
import Toast from "../../../component/Toast/Toast";

const SettingForm = ({ onFinish, initialValues, form }) => {
  const selectedType = Form.useWatch("type", form);

  const handleSubmit = (values) => {
    let finalValue = values.value;

    try {
      if (values.type === "boolean") {
        finalValue = values.value ? "true" : "false";
      } else if (values.type === "json") {
        JSON.parse(values.value);
        finalValue = values.value;
      } else {
        finalValue = String(values.value);
      }

      onFinish({
        key: values.key,
        value: finalValue,
        uuid: initialValues?.uuid || ""
      });
    } catch (e) {
      Toast.error("Invalid format!");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="Setting Key" name="key" rules={[{ required: true }]}>
        <Input placeholder="Enter Setting Key" disabled={!!initialValues} />
      </Form.Item>

      <Form.Item label="Data Type" name="type">
        <Radio.Group optionType="button" buttonStyle="solid" className="w-full flex">
          <Radio.Button value="string" className="flex-1 text-center">Text</Radio.Button>
          <Radio.Button value="int" className="flex-1 text-center">Number</Radio.Button>
          <Radio.Button value="boolean" className="flex-1 text-center">True/False</Radio.Button>
          <Radio.Button value="json" className="flex-1 text-center">JSON</Radio.Button>
        </Radio.Group>
      </Form.Item>

      {!selectedType && (
        <Alert
          message="Notice"
          description="Please select a data type above to reveal the value input field."
          type="info"
          showIcon
          className="mb-4"
        />
      )}
      <div className="mt-4 p-4　rounded bg-gray-50">

        {selectedType === "string" && (
          <Form.Item name="value" rules={[{ required: true }]}>
            <Input placeholder="Enter Text" />
          </Form.Item>
        )}

        {selectedType === "int" && (
          <Form.Item name="value" rules={[{ required: true }]}>
            <InputNumber className="w-full" placeholder="Enter Number" />
          </Form.Item>
        )}

        {selectedType === "boolean" && (
          <Form.Item name="value" valuePropName="checked">
            <Switch checkedChildren="True" unCheckedChildren="False" />
          </Form.Item>
        )}

        {selectedType === "json" && (
          <Form.Item name="value" rules={[{ required: true }]}>
            <Input.TextArea rows={6} className="font-mono text-xs" placeholder="Enter JSON Format" />
          </Form.Item>
        )}
      </div>
    </Form>
  );
};

export default SettingForm;