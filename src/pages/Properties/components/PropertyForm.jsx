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
} from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import SettingForm from "./SettingForm";
import { getPropertyDetails, upsertProperty } from "../../../api/propertyApi";
import FormButtons from "../../../component/FormButtons/FormButtons";
import { useApiMutation } from "../../../hooks/useApiMutation";
import useApiQuery from "../../../hooks/useApiQuery";
import Toast from "../../../component/Toast/Toast";
import { isSet, property } from "lodash";

const PropertyForm = ({
  mode,
  loading,
  drawerOpen,
  setDrawerOpen,
  selectedRow,
  setSelectedRow,
  propertyTypes,
  countryOptions,
  cityOptions,
  currencyOptions,
  onCountryChange,
  switchToEdit,
  page,
  setPage,
  setSelectedCountryUuid
}) => {
  const [form] = Form.useForm();
  const [settingDrawer, setSettingDrawer] = useState(false);
  const [editingSetting, setEditingSetting] = useState(null);
  
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const timezone = dayjs.tz.guess();

  const formattedTimezone =
    timezone === "Asia/Rangoon" ? "Asia/Yangon" : timezone;

  const createProperty = useApiMutation({
    mutationFn: upsertProperty,
    invalidateKeys: [["properties"]],
    shouldInvalidate: page === 1
  });

  const editProperty = useApiMutation({
    mutationFn: upsertProperty,
    invalidateKeys: [["properties"]],
  });

  const{ data, isLoading, error } = useApiQuery({
    fetchQueryName: "properties_details",
    fetchQueryFunction: getPropertyDetails,
    params: { uuid: selectedRow?.uuid},
    options: {
      enabled: !!selectedRow?.uuid && (isEdit || isView) && drawerOpen,
    }
  })

  useEffect(() => {
    if(isAdd){
      form.resetFields();
    }else if (data) {
      if (data.country?.uuid) {
        onCountryChange(data.country.uuid);
      }
      form.setFieldsValue({
        ...data,
        checkinTime: data.checkinTime
          ? dayjs(data.checkinTime, "HH:mm:ss")
          : null,
        checkoutTime: data.checkoutTime
          ? dayjs(data.checkoutTime, "HH:mm:ss")
          : null,
        property_type_uuid: data.type?.uuid,
        country_uuid: data.country?.uuid,
        city_uuid: data.city?.uuid,
        currency_uuid: data.currency?.uuid,
      });
    }
  }, [drawerOpen, data, form, mode, onCountryChange]);

  const handlePropertySubmit = (values) => {
    const isSettingUpdate = !!values.setting;
    let payload;
    // update payload
    if(isSettingUpdate){
      payload = {
      uuid: values.uuid || "",
      name: values.name,
      type: { uuid: values.property_type_uuid },
      address: values.address,
      country: { uuid: values.country_uuid },
      city: { uuid: values.city_uuid },
      currency: { uuid: values.currency_uuid },
      email: values.email,
      phone: values.phone,
      checkinTime: values.checkinTime?.format("HH:mm:ss"),
      checkoutTime: values.checkoutTime?.format("HH:mm:ss"),
      timezone: formattedTimezone,
      setting: {
        uuid: values.setting?.uuid || "",
        key: values.setting?.key || "",
        value: values.setting?.value || ""
      }
    };
    } else {
      // create payload
      const activeSetting = selectedRow?.settingsArray?.[0];
      payload = {
        uuid: values.uuid || "",
        name: values.name,
        type: { uuid: values.property_type_uuid },
        address: values.address,
        country: { uuid: values.country_uuid },
        city: { uuid: values.city_uuid },
        currency: { uuid: values.currency_uuid },
        email: values.email,
        phone: values.phone,
        checkinTime: values.checkinTime?.format("HH:mm:ss"),
        checkoutTime: values.checkoutTime?.format("HH:mm:ss"),
        timezone: formattedTimezone,
        setting: activeSetting
          ? {
              key: activeSetting.key,
              value: activeSetting.value,
            }
          : undefined,
      };
    }
    
    if(isAdd){
      createProperty.mutate(payload, {
        onSuccess: () => {
          form.resetFields();
          setPage(1);
          setDrawerOpen(false);
          Toast.success("Property Created Successfully!");
        }
      });
    }
    if(isEdit){
      editProperty.mutate(payload, {
        onSuccess: () => {
          setDrawerOpen(false);
          Toast.success("Property Updated Successfully!");
        }
      });
    }
  };

  const onClose = () => {
    form.resetFields();
    setDrawerOpen(false);
    setSelectedRow(null);
  }

    const DrawerTitle = isView
    ? "Property View"
    : isEdit
    ? "Propety Edit"
    : "Property Create";

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
              loading={loading}
            />
          )}
        </div>
      }
      size={500}
      onClose={onClose}
      open={drawerOpen}
    >
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={handlePropertySubmit}>
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
            <h3 className="text-lg font-bold">Settings ({data?.settings?.length || 0})</h3>
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
            {isLoading ? (
              <div className="text-center py-4">
                <Spin size="small" /> Loading settings...
              </div>
            ) : data?.settings && data.settings.length > 0 ? (
              data.settings.map((s, idx) => (
                <Card
                  key={s.uuid || idx}
                  size="small"
                  title={
                    <Tag color={s.uuid ? "blue" : "green"}>
                      {s.settingKey?.toUpperCase()}
                    </Tag>
                  }
                  // extra={!isView && (
                  //   <Button 
                  //     type="link" 
                  //     icon={<EditOutlined />} 
                  //     onClick={() => {
                  //       setEditingSetting({
                  //         uuid: s.uuid,
                  //         key: s.settingKey,
                  //         value: s.settingValue 
                  //       });
                  //       setSettingDrawer(true);
                  //     }}
                  //   >
                  //     Edit
                  //   </Button>
                  // )}
                >
                  <div className="text-sm">
                    <strong>Key:</strong> {s.settingKey}<br/>
                    <strong>Value:</strong> {s.settingValue}
                  </div>
                </Card>
              ))
            ) : (
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
          // isSaving={isSaving}
          onFinish={(settingVals) => {
            if (data?.uuid) {
              // 1. Get all current values from the main property form
              const mainFormValues = form.getFieldsValue();

              // 2. Combine them into the format handlePropertySubmit expects
              const combinedPayload = {
                ...mainFormValues,
                uuid: data.uuid,
                setting: {
                  key: settingVals.key,
                  value: settingVals.value,
                },
              };

              // 3. Trigger the API call
              handlePropertySubmit(combinedPayload);
              setSettingDrawer(false);
            }
          }}
        />
      </Drawer>
    </Drawer>
  );
};

export default PropertyForm;
