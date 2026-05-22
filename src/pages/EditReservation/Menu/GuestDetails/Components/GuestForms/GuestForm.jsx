import React, { useEffect, useMemo, useState } from "react";
import {
  Form,
  Input,
  Select,
  Drawer,
  Row,
  Col,
  DatePicker,
  Button,
  Radio,
  Divider,
  Space,
  Typography,
  AutoComplete,
} from "antd";
import dayjs from "dayjs";
import { validatePhoneNumber } from "../../../../../../utils";
import {
  reservationGuestDetails,
  reservationGuestUpsert,
  reservationMeta,
  reservationRoomMeta,
} from "../../../../../../api/reservationSectionApi";
import { useApiMutation } from "../../../../../../hooks/useApiMutation";
import useApiQuery from "../../../../../../hooks/useApiQuery";
import { queryClient } from "./../../../../../../app/queryClient";
import Toast from "../../../../../../component/Toast/Toast";
import FormButtons from "./../../../../../../component/FormButtons/FormButtons";
import { PERMISSIONS } from "../../../../../../variables/permission";
import usePermission from "./../../../../../../hooks/usePermission";

const GuestForm = ({
  page,
  guestData,
  setPage,
  mode,
  setMode,
  drawerOpen,
  setDrawerOpen,
  setSelectedData,
  onSuccess,
  reservationUuid,
}) => {
  const uuid = reservationUuid?.uuid;
  const [form] = Form.useForm();
  const { hasPermission } = usePermission();
  const watchedSrNo = Form.useWatch("srcNo", form);
  const guestAgeType = Form.useWatch("isAdult", form);

  const isView = mode === "view";
  const isAdd = mode === "add";
  const isEdit = mode === "edit";

  const [selectedCountryUuid, setSelectedCountryUuid] = useState(null);
  const [selectedGuestProfileUuid, setSelectedGuestProfileUuid] =
    useState(null);

  const initData = queryClient.getQueryData(["initData", "authenticated"]);

  const titleOptions = useMemo(() => {
    return (
      initData?.statuses?.name_title?.map((t) => ({
        value: t.name,
        label: t.name,
      })) ?? []
    );
  }, [initData]);

  const statusOptions = useMemo(() => {
    return (
      initData?.statuses?.status?.map((s) => ({
        value: s.uuid,
        label: s.name,
      })) ?? []
    );
  }, [initData]);

  const activeStatusUuid = useMemo(() => {
    return (
      statusOptions.find((s) => s.label.toLowerCase() === "active")?.value ||
      null
    );
  }, [statusOptions]);

  const genderOptions = useMemo(() => {
    return (
      initData?.genders?.map((g) => ({ value: g.uuid, label: g.name })) ?? []
    );
  }, [initData]);

  const countryOptions = useMemo(() => {
    return (
      initData?.locations?.map((l) => ({ value: l.uuid, label: l.name })) ?? []
    );
  }, [initData]);

  const cityOptions = useMemo(() => {
    if (!selectedCountryUuid) return [];
    return (
      initData?.locations
        ?.find((l) => l.uuid === selectedCountryUuid)
        ?.city?.map((c) => ({ value: c.uuid, label: c.name })) ?? []
    );
  }, [selectedCountryUuid, initData]);

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

  const nrcTypeOptions = useMemo(
    () =>
      initData?.statuses?.nrc_type?.map((t) => ({
        value: t.code,
        label: t.code,
      })) || [],
    [initData],
  );

  const srNoOptions = useMemo(
    () =>
      initData?.nrcLocations?.map((loc) => ({
        value: loc.srNo,
        label: loc.srNo,
      })) || [],
    [initData],
  );

  const currentCountryLabel =
    countryOptions.find((o) => o.value === selectedCountryUuid)?.label ?? "";

  const currentCityLabel =
    cityOptions.find((o) => o.value === form.getFieldValue("city"))?.label ??
    "";

  const { data: reservationMetas } = useApiQuery({
    fetchQueryName: "reservation-meta",
    fetchQueryFunction: reservationMeta,
  });

  const guestsOptions =
    reservationMetas?.guests?.map((item) => ({
      label: `${item.name}  ${item.nrcNo ? "(" + item.nrcNo + ")" + " " + "(" + item.phone + ")" : "(" + item.phone + ")"}`,
      value: item.uuid,
      profileUuid: item.uuid,
      title: item.title,
      name: item.name,
      phone: item.phone,
      secondaryPhone: item.secondaryPhone,
      otherName: item.otherName,
      passport: item.passport,
      nationality: item.nationality,
      address: item.address,
      email: item.email,
      gender: item?.gender,
      country: item?.country,
      city: item?.city,
      dob: item?.dob,
      nrc: item?.nrc,
    })) || [];

  const [options, setOptions] = useState(guestsOptions);

  const { data: reservationRoom } = useApiQuery({
    fetchQueryName: "reservationRoom",
    fetchQueryFunction: reservationRoomMeta,
    params: {
      reservation: {
        uuid: uuid,
      },
    },
  });

  const rooms =
    reservationRoom?.rooms?.map((room) => ({
      value: room?.uuid,
      label: `${room?.room?.roomNo} (${room?.checkinDate}) - (${room?.checkoutDate}) `,
    })) || [];

  const createReservationGuest = useApiMutation({
    mutationFn: reservationGuestUpsert,
    invalidateKeys: [["reservation-guest"]],
    shouldInvalidate: page === 1,
  });

  const editReservationGuest = useApiMutation({
    mutationFn: reservationGuestUpsert,
    invalidateKeys: [["reservation-guest"]],
  });

  const { data, isLoading } = useApiQuery({
    fetchQueryName: "guest-details",
    fetchQueryFunction: reservationGuestDetails,
    params: { uuid: guestData?.uuid },
    options: { enabled: !!guestData?.uuid && !isAdd },
  });

  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedData(null);
    setSelectedGuestProfileUuid(null);
    form.resetFields();
  };

  useEffect(() => {
    if (!isAdd && data) {
      const rawDob = data?.guest?.dob || data?.dob;
      const parsedDob = rawDob ? dayjs(rawDob) : null;
      form.resetFields();

      form.setFieldsValue({
        ...data,
        name: data?.guest?.name || data?.name,
        title: data?.guest?.title || data?.title,
        otherName: data?.guest?.otherName,
        isAdult: data?.isAdult ? 1 : 0,
        isPrimary: data?.isPrimary ? 1 : 0,
        phone: data?.guest?.phone,
        secondaryPhone: data?.guest?.secondaryPhone,
        passport: data?.guest?.passport,
        email: data?.guest?.email,
        nationality: data?.guest?.nationality,
        dob: parsedDob,
        srcNo: data?.guest?.nrc?.srNo,
        township: data?.guest?.nrc?.township,
        type: data?.guest?.nrc?.type,
        number: data?.guest?.nrc?.number,
        city: data?.guest?.city?.uuid || data?.city?.uuid,
        country: data?.guest?.country?.uuid || data?.country?.uuid,
        address: data?.guest?.address || data?.address,
        gender: data?.guest?.gender?.uuid || data?.gender?.uuid,
        status: data?.status?.uuid || activeStatusUuid,
        reservationRoomuuid: data?.reservationRoom?.uuid,
      });

      setSelectedCountryUuid(data?.guest?.country?.uuid || data?.country?.uuid);
      setSelectedData(data);
    }
  }, [data, isAdd, form, activeStatusUuid]);

  const onFinish = (values) => {
    const hasNrcParts =
      values?.srcNo && values?.township && values?.type && values?.number;

    const formattedNrc = hasNrcParts
      ? `${values.srcNo}/${values.township}(${values.type})${values.number}`
      : values.nrcNo;

    const payload = {
      ...values,
      reservation: { uuid },
      reservationRoom: { uuid: values.reservationRoomuuid },
      dob: values.dob?.format("YYYY-MM-DD"),
      nrcNo: formattedNrc ?? null,
      gender: values.gender ? { uuid: values.gender } : null,
      city: values.city ? { uuid: values.city } : null,
      country: values.country ? { uuid: values.country } : null,
      status: values.status ? { uuid: values.status } : null,

      uuid: isEdit ? guestData?.uuid || data?.uuid : null,

      guest:
        selectedGuestProfileUuid || data?.guest?.uuid
          ? { uuid: selectedGuestProfileUuid || data?.guest?.uuid }
          : null,
    };

    const mutation = isAdd ? createReservationGuest : editReservationGuest;

    mutation.mutate(payload, {
      onSuccess: () => {
        handleClose();
        if (setPage && isAdd) setPage(1);
        if (onSuccess) onSuccess();

        Toast.success(
          isAdd ? "Guest Created Successfully!" : "Guest Updated Successfully!",
        );
      },
    });
  };

  return (
    <Drawer
      open={drawerOpen}
      onClose={handleClose}
      width={600}
      title={
        <div className="flex justify-between items-center w-full pr-4">
          <span className="text-lg font-semibold">
            {isView ? "Guest Details" : isEdit ? "Edit Guest" : "Create Guest"}
          </span>

          {isView ? (
            <Button type="primary" onClick={() => setMode("edit")}>
              Edit
            </Button>
          ) : (
            <FormButtons
              onClick={() => form.submit()}
              mode={mode}
              isPending={
                createReservationGuest.isPending ||
                editReservationGuest.isPending
              }
            />
          )}
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        disabled={isView}
        initialValues={{ isAdult: 1, status: activeStatusUuid }}
      >
        <Form.Item
          name="isAdult"
          label="Guest Type"
          className="mb-4"
          rules={[
            { required: true, message: "Please select guest age grouping" },
          ]}
        >
          <Radio.Group className="w-full">
            <Row gutter={16}>
              <Col span={12}>
                <Radio value={1} className="align-top">
                  <span className="block font-medium text-slate-800">
                    Save Guest Profile
                  </span>
                  <span className="block text-xs text-slate-500 whitespace-normal">
                    For guests aged 10 and above
                  </span>
                </Radio>
              </Col>
              <Col span={12}>
                <Radio value={0} className="align-top">
                  <span className="block font-medium text-slate-800">
                    Child Guest
                  </span>
                  <span className="block text-xs text-slate-500 whitespace-normal">
                    Temporary local record setup
                  </span>
                </Radio>
              </Col>
            </Row>
          </Radio.Group>
        </Form.Item>

        <Divider className="my-4" />

        <Form.Item
          name="isPrimary"
          label="Guest Role"
          className="mb-4"
          rules={[{ required: true, message: "Please choose a role" }]}
        >
          <Radio.Group className="w-full">
            <Row gutter={16}>
              <Col span={12}>
                <Radio value={1}>
                  <span className="font-medium text-slate-800">Main Guest</span>
                </Radio>
              </Col>
              <Col span={12}>
                <Radio value={0}>
                  <span className="font-medium text-slate-800">
                    Share Guest
                  </span>
                </Radio>
              </Col>
            </Row>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Assign Room"
          name="reservationRoomuuid"
          getValueProps={(value) => ({
            value: isView
              ? rooms.find((item) => item.value === value)?.label
              : value,
          })}
        >
          {isView ? (
            <Input readOnly={isView} />
          ) : (
            <Select
              showSearch={{
                filterOption: (input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase()),
              }}
              options={rooms}
              placeholder="Select Floor"
            />
          )}
        </Form.Item>

        <Form.Item
          label="Full Name"
          required={guestAgeType === 1}
          className="mb-4"
        >
          <Space.Compact className="w-full">
            {guestAgeType === 1 && (
              <Form.Item
                name="title"
                noStyle
                rules={[{ required: true, message: "Title is required" }]}
              >
                <Select
                  options={titleOptions}
                  placeholder="Title"
                  style={{ width: "25%" }}
                />
              </Form.Item>
            )}

            <Form.Item
              label="Name"
              name="name"
              noStyle
              rules={[{ required: true, message: "Name is required" }]}
            >
              <AutoComplete
                options={guestsOptions}
                placeholder="Select or type guest name"
                style={{ width: guestAgeType === 1 ? "75%" : "100%" }}
                filterOption={(inputValue, option) =>
                  option?.label
                    ?.toLowerCase()
                    .includes(inputValue.toLowerCase())
                }
                onSelect={(value, option) => {
                  setSelectedGuestProfileUuid(option.profileUuid);

                  if (option?.country?.uuid) {
                    setSelectedCountryUuid(option.country.uuid);
                  }

                  form.setFieldsValue({
                    title: option.title,
                    name: option.name,
                    otherName: option.otherName,
                    phone: option?.phone || "",
                    secondaryPhone: option?.secondaryPhone || "",
                    passport: option?.passport,
                    address: option?.address,
                    nationality: option?.nationality,
                    email: option?.email,

                    dob: option?.dob ? dayjs(option.dob) : null,

                    gender: option?.gender?.uuid || null,
                    country: option?.country?.uuid || null,
                    city: option?.city?.uuid || null,

                    srcNo: option?.nrc?.srNo || null,
                    township: option?.nrc?.township || null,
                    type: option?.nrc?.type || null,
                    number: option?.nrc?.number || null,
                  });
                }}
              >
                <Input />
              </AutoComplete>
            </Form.Item>
          </Space.Compact>
        </Form.Item>

        {guestAgeType === 1 && (
          <>
            <Form.Item label="Name (Other Language)" name="otherName">
              <Input placeholder="Optional local characters" />
            </Form.Item>

            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                {
                  type: "email",
                  message: "Please provide a valid email format",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Primary Phone"
                  name="phone"
                  rules={[{ validator: validatePhoneNumber }]}
                >
                  <Input
                    addonBefore="+959"
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) e.preventDefault();
                    }}
                    maxLength={10}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Secondary Phone"
                  name="secondaryPhone"
                  rules={[{ validator: validatePhoneNumber }]}
                >
                  <Input
                    addonBefore="+959"
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) e.preventDefault();
                    }}
                    maxLength={10}
                  />
                </Form.Item>
              </Col>
            </Row>

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
                        if (!value) {
                          return Promise.resolve();
                        }
                        if (!/^\d+$/.test(value)) {
                          return Promise.reject(
                            new Error("Only numbers are allowed"),
                          );
                        }
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

            <Form.Item label="Passport No." name="passport">
              <Input placeholder="Enter Passport Identifier" />
            </Form.Item>

            <Form.Item label="Nationality" name="nationality">
              <Input placeholder="Enter Nationality" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Country" name="country">
                  <Select
                    options={countryOptions}
                    disabled={isView} 
                    onChange={(val) => {
                      setSelectedCountryUuid(val);
                      form.setFieldValue("city", null);
                    }}
                    showSearch
                    placeholder="Select Country"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="City" name="city">
                  <Select
                    options={cityOptions}
                    disabled={isView || !selectedCountryUuid}
                    showSearch
                    placeholder="Select City"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Street Address" name="address">
              <Input.TextArea
                rows={2}
                placeholder="Building, Street Name, Block..."
              />
            </Form.Item>
          </>
        )}

        {/* commom */}
        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: "Gender is required" }]}
        >
          <Select options={genderOptions} placeholder="Select Gender" />
        </Form.Item>

        <Form.Item
          label="Date of Birth"
          name="dob"
          rules={[{ required: true, message: "Date of birth is required" }]}
        >
          <DatePicker className="w-full" format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[
            { required: true, message: "Status verification is required" },
          ]}
        >
          <Select options={statusOptions} />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default GuestForm;
