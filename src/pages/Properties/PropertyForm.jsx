import React, { useEffect } from "react";
import { Form, Input, Select, TimePicker } from "antd";
import dayjs from "dayjs";

const PropertyForm = ({ initialValues, onFinish, id, mode, propertyTypes }) => {
  const [form] = Form.useForm();
  
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        checkInTime: (initialValues.checkinTime || initialValues.checkInTime) ? dayjs(initialValues.checkinTime || initialValues.checkInTime, 'HH:mm:ss') : null,
        checkOutTime: (initialValues.checkoutTime || initialValues.checkOutTime) ? dayjs(initialValues.checkoutTime || initialValues.checkOutTime, 'HH:mm:ss') : null,
        property_type_uuid: initialValues.type?.uuid,
        // property_type_name: initialValues.type?.name,
        country_uuid: initialValues.country?.uuid, 
        city_uuid: initialValues.city?.uuid,
        currency_uuid: initialValues.currency?.uuid,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  return (
    <Form id={id} form={form} layout="vertical" onFinish={onFinish} disabled={mode === "view"}>
      <Form.Item name="uuid" hidden><Input /></Form.Item>
      <div className="grid grid-cols-2 gap-4">
        <Form.Item label="Property Name" name="name" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item label="Property Type" name="property_type_uuid" rules={[{ required: true }]}>
          <Select placeholder="Select Type" options={propertyTypes} showSearch optionFilterProp="label" />
        </Form.Item>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Form.Item label="Email" name="email" rules={[{ type: 'email' }]}><Input /></Form.Item>
        <Form.Item label="Phone" name="phone"><Input /></Form.Item>
      </div>
      <Form.Item label="Address" name="address"><Input.TextArea rows={2} /></Form.Item>
      <div className="grid grid-cols-3 gap-4">
        <Form.Item label="Country" name="country_uuid"><Select options={[{ label: 'Myanmar', value: '31ef69ee066411f1911c9c88d3893775' }]} /></Form.Item>
        <Form.Item label="City" name="city_uuid"><Select options={[{ label: 'Yangon', value: '41ef69ee066411f1911c9c88d3893775' }]} /></Form.Item>
        <Form.Item label="Currency" name="currency_uuid"><Select options={[{ label: 'MMK', value: '3b2b52c10ef211f1b3a622368f20d569' }]} /></Form.Item>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Form.Item label="Check-In" name="checkInTime"><TimePicker className="w-full" format="HH:mm:ss" /></Form.Item>
        <Form.Item label="Check-Out" name="checkOutTime"><TimePicker className="w-full" format="HH:mm:ss" /></Form.Item>
      </div>
      <Form.Item label="Timezone" name="timezone"><Select options={[{ label: 'Asia/Yangon', value: 'Asia/Yangon' }]} /></Form.Item>
    </Form>
  );
};

export default PropertyForm;