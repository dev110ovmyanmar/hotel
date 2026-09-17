import React, { useEffect, useState, useMemo } from "react";
import {
  Form,
  Input,
  Drawer,
  DatePicker,
  Select,
  Button,
  Space,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useQueryClient } from "@tanstack/react-query";
import Loader from "../../../component/Loader/Loader";
import FormButtons from "../../../component/FormButtons/FormButtons";
import Toast from "../../../component/Toast/Toast";
import useApiQuery from "../../../hooks/useApiQuery";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { upsertGuest, getGuestDetail } from "../../../api/guestApi";
import { validatePhoneNumber } from "../../../utils";
import usePermission from "../../../hooks/usePermission";
import { PERMISSIONS } from "../../../variables/permission";

const { TextArea } = Input;

const GuestForm = ({
  mode,
  setMode,
  drawerOpen,
  setDrawerOpen,
  selectedRow,
  setSelectedRow,
  setPage,
  page,
}) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { hasPermission } = usePermission();
  const canEdit = hasPermission(PERMISSIONS.GUEST_EDIT);

  const phoneValue = Form.useWatch("phone", form);
  const [selectedCountryUuid, setSelectedCountryUuid] = useState(null);

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  // 1. Get Global Options from Cache
  const initData = queryClient.getQueryData(["initData", "authenticated"]);

  // 2. Watch NRC Region for Township filtering
  const watchedSrNo = Form.useWatch("srcNo", form);

  // 3. Mapped Options
  const statusOptions = useMemo(
    () =>
      initData?.statuses?.status?.map((s) => ({
        value: s.uuid,
        label: s.name,
      })) || [],
    [initData],
  );

  const nrcTypeOptions = useMemo(
    () =>
      initData?.statuses?.nrc_type?.map((t) => ({
        value: t.code,
        label: t.code,
      })) || [],
    [initData],
  );

  console.log("Init data locations:", initData?.locations);
  const countryOptions = useMemo(
    () =>
      initData?.locations?.map((l) => ({ value: l.uuid, label: l.name })) || [],
    [initData],
  );
  console.log("Country options:", countryOptions);

  const genderOptions = useMemo(
    () =>
      initData?.genders?.map((g) => ({ value: g.uuid, label: g.name })) || [],
    [initData],
  );

  const cityOptions = useMemo(() => {
    if (!selectedCountryUuid) return [];
    return (
      initData?.locations
        ?.find((l) => l.uuid === selectedCountryUuid)
        ?.city?.map((c) => ({ value: c.uuid, label: c.name })) || []
    );
  }, [selectedCountryUuid, initData]);

  // NRC Options derived from watchedSrNo
  const srNoOptions = useMemo(
    () =>
      initData?.nrcLocations?.map((loc) => ({
        value: loc.srNo,
        label: loc.srNo,
      })) || [],
    [initData],
  );

  const townshipOptions = useMemo(() => {
    const location = initData?.nrcLocations?.find(
      (loc) => loc.srNo === watchedSrNo,
    );
    return (
      location?.nrcTownships?.map((ts) => ({
        value: ts.name,
        label: ts.name,
      })) || []
    );
  }, [watchedSrNo, initData]);

  const titleOptions = useMemo(() => {
    return (
      initData?.statuses?.name_title?.map((t) => ({
        value: t.name,
        label: t.name,
      })) || []
    );
  }, [initData]);

  // 4. API Query for single Guest Detail
  const { data, isLoading } = useApiQuery({
    fetchQueryName: "guest-detail",
    fetchQueryFunction: getGuestDetail,
    params: { uuid: selectedRow?.uuid },
    options: { enabled: !!selectedRow?.uuid && drawerOpen },
  });

  // 5. Fill Form when data arrives
  useEffect(
    () => {
      if (isAdd) {
        const defaultStatus = statusOptions.find(
          (s) => s.label.toLowerCase() === "active",
        )?.value;
        const defaultCountry = countryOptions.find(
          (c) => c.label.toLowerCase() === "myanmar",
        )?.value;
        form.resetFields();
        form.setFieldsValue({ status: defaultStatus, country: defaultCountry });
        // setSelectedCountryUuid(null);
        setSelectedCountryUuid(defaultCountry || null);
      } else if (data) {
        setSelectedCountryUuid(data.country?.uuid);

        form.setFieldsValue({
          ...data,
          title: data.title,
          dob: data.dob ? dayjs(data.dob) : null,
          gender: data.gender?.uuid,
          country: data.country?.uuid,
          city: data.city?.uuid,
          status: data.status?.uuid,
          // Map NRC fields from nested object to flat fields
          srcNo: data.nrc?.srNo,
          township: data.nrc?.township,
          type: data.nrc?.type,
          number: data.nrc?.number,
        });
      }
    },
    // [data, isAdd, form, drawerOpen])
    [data, isAdd, form, drawerOpen, statusOptions, countryOptions],
  );

  const upsertMutation = useApiMutation({
    mutationFn: upsertGuest,
    invalidateKeys: [["guests"]],
    shouldInvalidate: page === 1,
  });

  const onFinish = (values) => {
    const hasNrc =
      values?.srcNo && values?.township && values?.type && values?.number;
    const payload = {
      title: values.title,
      name: values.name,
      otherName: values.otherName,
      phone: values.phone,
      email: values.email,
      address: values.address,
      nrcNo: hasNrc
        ? `${values?.srcNo}/${values?.township}(${values?.type})${values?.number}`
        : null,
      passport: values?.passport,
      dob: values?.dob?.format("YYYY-MM-DD"),
      nationality: values?.nationality,
      gender: values.gender ? { uuid: values.gender } : null,
      city: values.city ? { uuid: values.city } : null,
      country: values.country ? { uuid: values.country } : null,
      status: values.status ? { uuid: values.status } : null,
      uuid: isEdit ? selectedRow?.uuid : null,
    };

    // Remove undefined fields
    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined || payload[key] === null) {
        delete payload[key];
      }
    });

    upsertMutation.mutate(payload, {
      onSuccess: () => {
        setDrawerOpen(false);
        if (isAdd) setPage(1);
        Toast.success(`Guest ${isEdit ? "Updated" : "Created"} successfully.`);
        queryClient.invalidateQueries({
          queryKey: ["guest-detail"],
        });
      },
    });
  };

  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedRow(null);
    form.resetFields();
  };

  const getLabel = (value, options) => {
    return options?.find((opt) => opt.value === value)?.label || value;
  };

  return (
    <Drawer
      title={isView ? "Guest Details" : isEdit ? "Edit Guest" : "Add Guest"}
      size={550}
      onClose={handleClose}
      open={drawerOpen}
      extra={
        isView ? (
          canEdit &&
          <Button type="primary" onClick={() => setMode("edit")}>
            Edit
          </Button>
        ) : (
          <FormButtons
            onClick={() => form.submit()}
            mode={mode}
            isPending={upsertMutation.isPending}
          />
        )
      }
    >
      {isLoading ? (
        <Loader />
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="w-full"
        >
          {/* Name, Phone, Email, Dob */}
          <div className="grid grid-cols-12 gap-x-4">
            <div className="col-span-12">
              <Form.Item label="Full Name" required>
                <Space.Compact style={{ width: "100%" }}>
                  <Form.Item
                    name="title"
                    noStyle
                    rules={[{ required: true, message: "Title is required" }]}
                  >
                    <Select
                      options={titleOptions}
                      disabled={isView}
                      placeholder="Select Title"
                      style={{ width: "20%" }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="name"
                    noStyle
                    rules={[{ required: true, message: "Name is required" }]}
                  >
                    <Input
                      readOnly={isView}
                      style={{
                        width: "80%",
                        cursor: isView ? "default" : "text",
                      }}
                      placeholder="Enter Full Name"
                    />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </div>
            <div className="col-span-12">
              <Form.Item label="Other Name" name="otherName">
                <Input
                  readOnly={isView}
                  style={{ cursor: isView ? "default" : "text" }}
                  placeholder="Enter Other Name"
                />
              </Form.Item>
            </div>

            <div className="col-span-12">
              <Form.Item label="Phone" name="phone">
                <Input
                  maxLength={20}
                  readOnly={isView}
                  onKeyPress={(e) => {
                    const currentValue = form.getFieldValue("phone") || "";
                    if (
                      !/[0-9]/.test(e.key) &&
                      !(e.key === "+" && currentValue.length === 0)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  placeholder="Enter Phone Number"
                />
              </Form.Item>
            </div>

            <div className="col-span-12">
              <Form.Item label="Email" name="email">
                <Input
                  readOnly={isView}
                  style={{ cursor: isView ? "default" : "text" }}
                  placeholder="Enter Email Address"
                />
              </Form.Item>
            </div>
            <div className="col-span-12">
              <Form.Item label="Date of Birth" name="dob">
                <DatePicker
                  className="w-full"
                  open={isView ? false : undefined}
                  allowClear={!isView}
                  inputReadOnly={isView}
                  disabledDate={(current) => {
                    return current && current > dayjs().endOf("day");
                  }}
                  showToday={false}
                  placeholder="Select Date of Birth"
                />
              </Form.Item>
            </div>
          </div>

          <div className="mt-4 border-t border-gray-200 pt-4">
            {/* NRC, Passport */}
            <div className="grid grid-cols-12 gap-x-2">
              <div className="col-span-12">
                <Typography.Text>NRC No</Typography.Text>
              </div>

              <div className="col-span-2">
                <Form.Item label="Region" name="srcNo" className="flex-2">
                  {isView ? (
                    <Input
                      readOnly
                      className="bg-white text-black cursor-default border-gray-200"
                      // Ensure it doesn't look grayed out
                      variant="outlined"
                      placeholder="Select Region"
                    />
                  ) : (
                    <Select
                      options={srNoOptions}
                      className="w-full"
                      showSearch
                      placeholder="Select Region"
                    />
                  )}
                </Form.Item>
              </div>

              {/* Slash 1 - Dedicated narrow column */}
              <div className="flex justify-center pt-8">
                <span className="text-gray-400 text-lg">/</span>
              </div>
              <div className="col-span-4">
                <Form.Item label="Township" name="township">
                  {isView ? (
                    <Input
                      readOnly
                      className="bg-white text-black cursor-default border-gray-200"
                      placeholder="Select Township"
                      // Ensure it doesn't look grayed out
                      variant="outlined"
                    />
                  ) : (
                    <Select
                      options={townshipOptions}
                      className="w-full"
                      showSearch
                      disabled={!watchedSrNo}
                      placeholder="Select Twonship"
                    />
                  )}
                </Form.Item>
              </div>

              <div className="col-span-2">
                <Form.Item label="Type" name="type">
                  <Select
                    options={nrcTypeOptions}
                    open={isView ? false : undefined}
                    placeholder="Select Citizenship Type"
                  />
                </Form.Item>
              </div>

              <div className="col-span-3">
                <Form.Item
                  label="NRC Number"
                  name="number"
                  rules={[
                    {
                      validator: (_, value) => {
                        // 1. If value is empty, allow it (since it's not required)
                        if (!value) {
                          return Promise.resolve();
                        }

                        // 2. Check if it's strictly numeric
                        if (!/^\d+$/.test(value)) {
                          return Promise.reject(
                            new Error("Only numbers are allowed"),
                          );
                        }

                        // 3. Check length
                        if (value.length !== 6) {
                          return Promise.reject(
                            new Error("Must be exactly 6 digits"),
                          );
                        }

                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input
                    maxLength={6}
                    readOnly={isView}
                    placeholder="Enter 6-digit NRC Number"
                  />
                </Form.Item>
              </div>
            </div>

            <div className="col-span-12 mb-1">
              <Typography.Text>Passport No</Typography.Text>
            </div>

            <div className="col-span-12">
              <Form.Item
                // label="Passport Number"
                name="passport"
              >
                <Input
                  readOnly={isView}
                  style={{ cursor: isView ? "default" : "text" }}
                  placeholder="Enter Passport Number"
                />
              </Form.Item>
            </div>
          </div>

          {/* Nationality, Gender, Country, City, Address, Status */}
          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="grid grid-cols-2 gap-x-4">
              <Form.Item label="Nationality" name="nationality">
                <Input
                  readOnly={isView}
                  style={{ cursor: isView ? "default" : "text" }}
                  placeholder="Enter Nationality"
                />
              </Form.Item>
              <Form.Item label="Gender" name="gender">
                <Select
                  options={genderOptions}
                  open={isView ? false : undefined}
                  placeholder="Select Gender"
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-x-4">
              {isView ? (
                <Form.Item label="Country">
                  <Input
                    readOnly
                    value={getLabel(
                      form.getFieldValue("country"),
                      countryOptions,
                    )}
                    className="bg-white text-black cursor-default border-gray-200"
                    variant="outlined"
                    placeholder="Select Country"
                  />
                </Form.Item>
              ) : (
                <Form.Item label="Country" name="country">
                  <Select
                    options={countryOptions}
                    onChange={setSelectedCountryUuid}
                    className="w-full"
                    showSearch
                    placeholder="Select Country"
                  />
                </Form.Item>
              )}

              {isView ? (
                <Form.Item label="City">
                  <Input
                    readOnly
                    value={getLabel(form.getFieldValue("city"), cityOptions)}
                    className="bg-white text-black cursor-default border-gray-200"
                    variant="outlined"
                    placeholder="Select City"
                  />
                </Form.Item>
              ) : (
                <Form.Item label="City" name="city">
                  <Select
                    options={cityOptions}
                    disabled={!selectedCountryUuid}
                    className="w-full"
                    showSearch
                    placeholder="Select City"
                  />
                </Form.Item>
              )}
            </div>

            <Form.Item label="Address" name="address">
              <Input.TextArea
                rows={2}
                readOnly={isView}
                style={{ cursor: isView ? "default" : "text" }}
                placeholder="Enter Address"
              />
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true }]}
            >
              <Select
                options={statusOptions}
                open={isView ? false : undefined}
              />
            </Form.Item>
          </div>
        </Form>
      )}
    </Drawer>
  );
};

export default GuestForm;
