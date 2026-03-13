import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  TimePicker,
  Drawer,
  Button,
  Spin,
  Divider,
  Card,
  Tag,
  Empty,
  Space,
  AutoComplete,
} from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import SettingForm from "./SettingForm";
import FormButtons from "../../../component/FormButtons/FormButtons";

const PropertyForm = ({
  open,
  onClose,
  initialValues,
  setInitialValues,
  onFinish,
  mode,
  loading,
  isSaving,
  propertyTypes,
  countryOptions,
  cityOptions,
  currencyOptions,
  onCountryChange,
  DrawerTitle,
  switchToEdit,
}) => {
  const [form] = Form.useForm();
  const [settingDrawer, setSettingDrawer] = useState(false);
  const [editingSetting, setEditingSetting] = useState(null);
  const isView = mode === "view";
  const isAdd = mode === "add";

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        checkinTime: initialValues.checkinTime
          ? dayjs(initialValues.checkinTime, "HH:mm:ss")
          : null,
        checkoutTime: initialValues.checkoutTime
          ? dayjs(initialValues.checkoutTime, "HH:mm:ss")
          : null,
        property_type_uuid: initialValues.type?.uuid,
        country_uuid: initialValues.country?.uuid,
        city_uuid: initialValues.city?.uuid,
        currency_uuid: initialValues.currency?.uuid,
      });
    } else {
      form.resetFields();
    }
  }, [open, initialValues, form]);

  // const validateTimes = () => {
  //   const checkIn = form.getFieldValue("checkInTime");
  //   const checkOut = form.getFieldValue("checkOutTime");
  //   if (checkIn && checkOut && !checkOut.isAfter(checkIn)) {
  //     return Promise.reject(new Error("Check-out must be after Check-in time"));
  //   }
  //   return Promise.resolve();
  // };

  // const openSettingEdit = (setting) => {
  //   setEditingSetting(setting);
  //   setSettingDrawer(true);
  // };

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between">
          <span>{DrawerTitle}</span>
          {isView ? (
            <Button type="primary" onClick={switchToEdit}>
              Edit
            </Button>
          ) : (
            <FormButtons
              onClick={() => form.submit()}
              mode={mode}
              loading={isSaving}
            />
          )}
        </div>
      }
      size={500}
      onClose={onClose}
      open={open}
    >
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="uuid" hidden>
            <Input />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Property Name"
              name="name"
              rules={[{ required: true }]}
            >
              <Input readOnly={isView} variant="outlined" />
            </Form.Item>
            <Form.Item
              label="Property Type"
              name="property_type_uuid"
              rules={[{ required: true }]}
            >
              <Select
                options={propertyTypes}
                open={isView ? false : undefined}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input readOnly={isView} />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[
                { required: true },
                {
                  pattern: /^\+?[0-9]{7,15}$/,
                  message: "Invalid format (e.g. +959...)",
                },
              ]}
            >
              <Input readOnly={isView} placeholder="+95..." />
            </Form.Item>
          </div>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Invalid address format" }]}
          >
            <Input.TextArea rows={2} readOnly={isView} variant="outlined" />
          </Form.Item>

          <div className="grid grid-cols-3 gap-4">
            <Form.Item
              label="Country"
              name="country_uuid"
              rules={[{ required: true }]}
            >
              <Select
                showSearch
                placeholder="Select or type country"
                options={countryOptions}
                readOnly={isView}
                // optionFilterProp="label"
                onChange={onCountryChange}
                open={isView ? false : undefined}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLocaleLowerCase()
                    .includes(input.toLowerCase())
                }
                disabled={isView}
              />
            </Form.Item>
            <Form.Item
              label="City"
              name="city_uuid"
              rules={[{ required: true }]}
            >
              <Select
                showSearch
                placeholder="Select or type city"
                options={cityOptions}
                readOnly={isView}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                open={isView ? false : undefined}
                disabled={isView}
              />
            </Form.Item>
            <Form.Item
              label="Currency"
              name="currency_uuid"
              rules={[{ required: true }]}
            >
              <Select
                options={currencyOptions}
                open={isView ? false : undefined}
                disabled={isView}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Check-In Time"
              name="checkinTime"
              rules={[{ required: true }]}
            >
              <TimePicker
                className="w-full"
                format="HH:mm:ss"
                open={isView ? false : undefined}
                onChange={() => form.validateFields(["checkOutTime"])}
                disabled={isView}
              />
            </Form.Item>
            <Form.Item
              label="Check-Out Time"
              name="checkoutTime"
              rules={[{ required: true }]}
            >
              <TimePicker
                className="w-full"
                format="HH:mm:ss"
                open={isView ? false : undefined}
                disabled={isView}
              />
            </Form.Item>
          </div>
        </Form>

        <Divider />
        {!isAdd && (
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Settings</h3>
            {!isView && (
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingSetting(null);
                  setSettingDrawer(true);
                }}
              >
                Add Setting
              </Button>
            )}
          </div>
        )}

        {!isAdd && (
          <div className="space-y-4">
            {initialValues?.settingsArray?.map((s, idx) => (
              <Card
                key={idx}
                size="small"
                title={
                  <Tag color={s.uuid ? "blue" : "green"}>
                    {s.key.toUpperCase()}
                  </Tag>
                }
                // extra={!isView && <Button type="link" icon={<EditOutlined />} onClick={() => openSettingEdit(s)}>Edit</Button>}
              >
                <pre className="text-xs bg-gray-50 p-2 overflow-auto font-mono max-h-40">
                  {JSON.stringify(s.value, null, 2)}
                </pre>
              </Card>
            ))}
            {(!initialValues?.settingsArray ||
              initialValues.settingsArray.length === 0) && (
              <Empty description="No settings added" />
            )}
          </div>
        )}
      </Spin>

      <Drawer
        title={editingSetting ? "Edit Setting" : "Add Setting"}
        width={450}
        open={settingDrawer}
        onClose={() => setSettingDrawer(false)}
      >
        <SettingForm
          initialValues={editingSetting}
          isSaving={isSaving}
          onFinish={(settingVals) => {
            if (initialValues?.uuid) {
              // 1. Get all current values from the main property form
              const mainFormValues = form.getFieldsValue();

              // 2. Combine them into the format handlePropertySubmit expects
              const combinedPayload = {
                ...mainFormValues,
                uuid: initialValues.uuid,
                setting: {
                  key: settingVals.key,
                  value: settingVals.value,
                },
              };

              // 3. Trigger the API call
              onFinish(combinedPayload);
              setSettingDrawer(false);
            } else {
              // Logic for new properties (local state update)
              let newArray = [...(initialValues?.settingsArray || [])];
              newArray = [settingVals, ...newArray];
              setInitialValues({ ...initialValues, settingsArray: newArray });
              setSettingDrawer(false);
            }
          }}
        />
      </Drawer>
    </Drawer>
  );
};

export default PropertyForm;
