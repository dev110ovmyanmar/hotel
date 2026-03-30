import React, { useEffect } from "react";
import { Form, Input, Button, Radio, InputNumber, Switch } from "antd";
import Toast from "../../../component/Toast/Toast";

const SettingForm = ({ onFinish, initialValues }) => {
  const [form] = Form.useForm();
  const selectedType = Form.useWatch("type", form);

  // useEffect(() => {
  //   if (initialValues) {
  //     let initialType = "string";
  //     let val = initialValues.value;

  //     // Handle incoming string "true"/"false" from backend
  //     if (val === "true" || val === "false" || typeof val === "boolean") {
  //       initialType = "boolean";
  //       val = val === "true" || val === true; // Convert to actual boolean for Switch
  //     } else if (!isNaN(val) && val !== "" && typeof val !== "object") {
  //       initialType = "int";
  //       val = Number(val);
  //     } else if (typeof val === "object" && val !== null) {
  //       initialType = "json";
  //       val = JSON.stringify(val, null, 2);
  //     }

  //     form.setFieldsValue({
  //       key: initialValues.key,
  //       type: initialType,
  //       value: val
  //     });
  //   }
  // }, [initialValues, form]);

  const handleSubmit = (values) => {
    let finalValue = values.value;

    try {
      if (values.type === "boolean") {
        // CONVERT TO STRING "true" or "false" FOR BACKEND
        finalValue = values.value ? "true" : "false";
      } else if (values.type === "json") {
        // Ensure JSON is valid before sending
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

      <div className="mt-4 p-4 border rounded bg-gray-50">
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

      <Button type="primary" htmlType="submit" block className="mt-4">
        Save
      </Button>
    </Form>
  );
};

export default SettingForm;