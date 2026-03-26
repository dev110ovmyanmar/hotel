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

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "properties_details",
    fetchQueryFunction: getPropertyDetails,
    params: { uuid: selectedRow?.uuid },
    options: {
      enabled: !!selectedRow?.uuid && (isEdit || isView) && drawerOpen,
    }
  })

  useEffect(() => {
    if (isAdd) {
      form.resetFields();
    } else if (data) {
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
    if (isSettingUpdate) {
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

    if (isAdd) {
      createProperty.mutate(payload, {
        onSuccess: () => {
          form.resetFields();
          setPage(1);
          setDrawerOpen(false);
          Toast.success("Property Created Successfully!");
        }
      });
    }
    if (isEdit) {
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
      size={550}
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
              label="Name"
              name="name"
              rules={[{ required: true }]}
            >
              <Input readOnly={isView} variant="outlined" placeholder="Enter Property Name" />
            </Form.Item>
            <Form.Item
              label="Property Type"
              name="property_type_uuid"
              rules={[{ required: true }]}
            >
              <Select
                options={propertyTypes}
                open={isView ? false : undefined}
                placeholder="Select Property Type"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input readOnly={isView} placeholder="Enter Email" />
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
              <Input readOnly={isView} placeholder="Enter Phone Number" />
            </Form.Item>
          </div>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Invalid address format" }]}
          >
            <Input.TextArea rows={2} readOnly={isView} variant="outlined" placeholder="Enter Address" />
          </Form.Item>

          <div className="grid grid-cols-3 gap-4">
            {
              isView ? (
                <Form.Item label="Country">
                  <Input
                    readOnly
                    value={data?.country?.name}
                    className="bg-white text-black cursor-default border-gray-200"
                    variant="outlined"
                  />
                </Form.Item>
              ) : (
                <Form.Item
                  label="Country"
                  name="country_uuid"
                  rules={[{ required: true }]}
                >
                  <Select
                    showSearch
                    placeholder="Select or type country"
                    options={countryOptions}
                    onChange={onCountryChange}
                    open={isView ? false : undefined}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLocaleLowerCase()
                        .includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
              )
            }

            {
              isView ? (
                <Form.Item label="City">
                  <Input
                    readOnly
                    value={data?.city?.name}
                    className="bg-white text-black cursor-default border-gray-200"
                    variant="outlined"
                  />
                </Form.Item>
              ) : (
                <Form.Item
                  label="City"
                  name="city_uuid"
                  rules={[{ required: true }]}
                >
                  <Select
                    showSearch
                    placeholder="Select or type city"
                    options={cityOptions}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
              )
            }

            {
              isView ? (
                <Form.Item label="Currency">
                  <Input
                    readOnly
                    value={data?.currency?.code}
                    className="bg-white text-black cursor-default border-gray-200"
                    variant="outlined"
                  />
                </Form.Item>
              ) :
                (
                  <Form.Item
                    label="Currency"
                    name="currency_uuid"
                    rules={[{ required: true }]}
                  >
                    <Select
                      options={currencyOptions}
                      placeholder="Select Currency"
                    />
                  </Form.Item>
                )
            }
          </div>

          <div className="grid grid-cols-2 gap-4">
            {
              isView ? (
                <Form.Item label="Check-In Time">
                  <Input
                    readOnly
                    value={data?.checkinTime}
                    className="bg-white text-black cursor-default border-gray-200"
                    variant="outlined"
                  />
                </Form.Item>
              ) :
                <Form.Item
                  label="Check-In Time"
                  name="checkinTime"
                  rules={[{ required: true }]}
                >
                  <TimePicker
                    className="w-full"
                    format="HH:mm:ss"
                    onChange={() => form.validateFields(["checkOutTime"])}
                    placeholder="Select Check-In Time"
                  />
                </Form.Item>
            }

            {
              isView ? (
                <Form.Item label="Check-Out Time">
                  <Input
                    readOnly
                    value={data?.checkoutTime}
                    className="bg-white text-black cursor-default border-gray-200"
                    variant="outlined"
                  />
                </Form.Item>
              ) : (
                <Form.Item
                  label="Check-Out Time"
                  name="checkoutTime"
                  rules={[{ required: true }]}
                >
                  <TimePicker
                    className="w-full"
                    format="HH:mm:ss"
                    placeholder="Select Check-Out Time"
                  />
                </Form.Item>
              )
            }
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
                <div>
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
                      {/* <strong>Key:</strong> {s.settingKey}<br /> */}
                      <strong>Value:</strong>
                      {
                        typeof s.settingValue === 'object' && s.settingValue !== null
                          ? JSON.stringify(s.settingValue)
                          : String(s.settingValue)
                      }
                    </div>
                  </Card>
                </div>
              ))
            ) : (
              <Empty description="No settings added" />
            )}
          </div>
        )}
      </Spin>

      <Drawer
        title={editingSetting ? "Edit Setting" : "Add Setting"}
        size={550}
        open={settingDrawer}
        onClose={() => setSettingDrawer(false)}
      >
        <SettingForm
          // initialValues={editingSetting}
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
