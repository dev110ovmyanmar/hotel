import React, { useEffect } from "react";
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
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import SettingForm from "./SettingForm";
import FormButtons from "../../../component/FormButtons/FormButtons";

const PropertyForm = ({
  open,
  setOpen,
  onClose,
  setMode,
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
}) => {
  const [form] = Form.useForm();
  const [settingDrawer, setSettingDrawer] = React.useState(false);
  const [editingSetting, setEditingSetting] = React.useState(null);

  const isView = mode === "view";

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        checkInTime: initialValues.checkInTime
          ? dayjs(initialValues.checkInTime, "HH:mm:ss")
          : null,
        checkOutTime: initialValues.checkOutTime
          ? dayjs(initialValues.checkOutTime, "HH:mm:ss")
          : null,
        property_type_uuid: initialValues.type?.uuid,
        country_uuid: initialValues.country?.uuid,
        city_uuid: initialValues.city?.uuid,
        currency_uuid: initialValues.currency?.uuid,
      });
    } else if (open) {
      form.resetFields();
    }
  }, [open, initialValues, form]);

  const validateTimes = () => {
    const checkIn = form.getFieldValue("checkInTime");
    const checkOut = form.getFieldValue("checkOutTime");
    if (checkIn && checkOut && !checkOut.isAfter(checkIn)) {
      return Promise.reject(new Error("Check-out must be after Check-in time"));
    }
    return Promise.resolve();
  };

  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      size={500}
      title={
        <div className="flex justify-between items-center">
          <span>
            {mode === "add"
              ? "Add new Property"
              : mode === "view"
                ? "Property Details"
                : "Edit Property"}
          </span>
          {isView ? (
            <Button
              type="primary"
              onClick={() => {
                setMode("edit");
              }}
            >
              Edit
            </Button>
          ) : (
            <FormButtons onClick={() => form.submit()} mode={mode} />
          )}
        </div>
      }
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
              <Input readOnly={isView} />
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
            <Input.TextArea rows={2} readOnly={isView} />
          </Form.Item>

          <div className="grid grid-cols-3 gap-4">
            <Form.Item
              label="Country"
              name="country_uuid"
              rules={[{ required: true }]}
            >
              <Select
                options={countryOptions}
                onChange={onCountryChange}
                open={isView ? false : undefined}
              />
            </Form.Item>
            <Form.Item
              label="City"
              name="city_uuid"
              rules={[{ required: true }]}
            >
              <Select options={cityOptions} open={isView ? false : undefined} />
            </Form.Item>
            <Form.Item
              label="Currency"
              name="currency_uuid"
              rules={[{ required: true }]}
            >
              <Select
                options={currencyOptions}
                open={isView ? false : undefined}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Check-In"
              name="checkInTime"
              rules={[{ required: true }]}
            >
              <TimePicker
                className="w-full"
                format="HH:mm:ss"
                open={isView ? false : undefined}
                onChange={() => form.validateFields(["checkOutTime"])}
              />
            </Form.Item>
            <Form.Item
              label="Check-Out"
              name="checkOutTime"
              rules={[{ required: true }, { validator: validateTimes }]}
            >
              <TimePicker
                className="w-full"
                format="HH:mm:ss"
                open={isView ? false : undefined}
              />
            </Form.Item>
          </div>
        </Form>

        <Divider />
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
      </Spin>

      {/* Drawer for individual setting */}
      <Drawer
        title={editingSetting ? "Edit Setting" : "Add Setting"}
        width={450}
        open={settingDrawer}
        onClose={() => setSettingDrawer(false)}
      >
        <SettingForm
          initialValues={editingSetting}
          onFinish={(vals) => {
            let newArray = [...(initialValues?.settingsArray || [])];
            if (editingSetting) {
              newArray = newArray.map((item) =>
                item.key === editingSetting.key ? vals : item,
              );
            } else {
              newArray = [vals, ...newArray];
            }
            setInitialValues({ ...initialValues, settingsArray: newArray });
            setSettingDrawer(false);
          }}
        />
      </Drawer>
    </Drawer>
  );
};

export default PropertyForm;