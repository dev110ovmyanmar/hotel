import React, { useEffect, useState, useMemo } from "react";
import { Form, Input, Drawer, DatePicker, Select, Button } from "antd";
import dayjs from "dayjs";
import { useQueryClient } from "@tanstack/react-query";
import Loader from "../../../component/Loader/Loader";
import FormButtons from "../../../component/FormButtons/FormButtons";
import Toast from "../../../component/Toast/Toast";
import useApiQuery from "../../../hooks/useApiQuery";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { upsertGuest, getGuestDetail } from "../../../api/guestApi";

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
  const [selectedCountryUuid, setSelectedCountryUuid] = useState(null);

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  // 1. Get Global Options from Cache
  const initData = queryClient.getQueryData(["initData", "authenticated"]);

  // 2. Watch NRC Region for Township filtering
  const watchedSrNo = Form.useWatch("srcNo", form);

  // 3. Mapped Options
  const statusOptions = useMemo(() =>
    initData?.statuses?.status?.map(s => ({ value: s.uuid, label: s.name })) || [], [initData]);

  const nrcTypeOptions = useMemo(() =>
    initData?.statuses?.nrc_type?.map(t => ({ value: t.code, label: t.code })) || [], [initData]);

  console.log('Init data locations:', initData?.locations);
  const countryOptions = useMemo(() =>
    initData?.locations?.map(l => ({ value: l.uuid, label: l.name })) || [], [initData]);
  console.log('Country options:', countryOptions);

  const genderOptions = useMemo(() =>
    initData?.genders?.map(g => ({ value: g.uuid, label: g.name })) || [], [initData]);

  const cityOptions = useMemo(() => {
    if (!selectedCountryUuid) return [];
    return initData?.locations?.find(l => l.uuid === selectedCountryUuid)?.city?.map(c => ({ value: c.uuid, label: c.name })) || [];
  }, [selectedCountryUuid, initData]);

  // NRC Options derived from watchedSrNo
  const srNoOptions = useMemo(() =>
    initData?.nrcLocations?.map(loc => ({ value: loc.srNo, label: loc.srNo })) || [], [initData]);

  const townshipOptions = useMemo(() => {
    const location = initData?.nrcLocations?.find(loc => loc.srNo === watchedSrNo);
    return location?.nrcTownships?.map(ts => ({ value: ts.name, label: ts.name })) || [];
  }, [watchedSrNo, initData]);

  // 4. API Query for single Guest Detail
  const { data, isLoading } = useApiQuery({
    fetchQueryName: "guest-detail",
    fetchQueryFunction: getGuestDetail,
    params: { uuid: selectedRow?.uuid },
    options: { enabled: !!selectedRow?.uuid && drawerOpen },
  });

  // 5. Fill Form when data arrives
  useEffect(() => {
    if (isAdd) {
      const defaultStatus = statusOptions.find(s => s.label.toLowerCase() === 'active')?.value;
      form.resetFields();
      form.setFieldsValue({ status: defaultStatus });
      setSelectedCountryUuid(null);
    } else if (data) {
      setSelectedCountryUuid(data.country?.uuid);

      form.setFieldsValue({
        ...data,
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
  }, [data, isAdd, form, drawerOpen]);

  const upsertMutation = useApiMutation({
    mutationFn: upsertGuest,
    invalidateKeys: [["guests"]],
    shouldInvalidate: page === 1
  });

  const onFinish = (values) => {
    const payload = {
      name: values.name,
      otherName: values.otherName,
      phone: values.phone,
      email: values.email,
      address: values.address,
      nrcNo: `${values.srcNo}/${values.township}(${values.type})${values.number}`,
      passport: values.passport,
      dob: values.dob?.format("YYYY-MM-DD"),
      gender: { uuid: values.gender },
      nationality: values.nationality,
      city: { uuid: values.city },
      country: { uuid: values.country },
      status: { uuid: values.status },
      uuid: isEdit ? selectedRow?.uuid : undefined,
    };

    // Remove undefined fields
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });

    upsertMutation.mutate(payload, {
      onSuccess: () => {
        setDrawerOpen(false);
        if (isAdd) setPage(1);
        Toast.success(`Guest ${isEdit ? "Updated" : "Created"} successfully.`);
      },
    });
  };

  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedRow(null);
    form.resetFields();
  };

  const getLabel = (value, options) => {
    return options?.find(opt => opt.value === value)?.label || value;
  };

  return (
    <Drawer
      title={isView ? "Guest Details" : isEdit ? "Edit Guest" : "Add Guest"}
      width={600}
      onClose={handleClose}
      open={drawerOpen}
      extra={isView ? (
        <Button type="primary" onClick={() => setMode("edit")}>Edit</Button>
      ) : (
        <FormButtons onClick={() => form.submit()} mode={mode} isPending={upsertMutation.isPending} />
      )}
    >
      {isLoading ? <Loader /> : (
        <Form form={form} layout="vertical" onFinish={onFinish} className="w-full">
          {/* Name, Phone, Email, Dob */}
          <div className="grid grid-cols-12 gap-x-4">
            <div className="col-span-12">
              <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
                <Input
                  readOnly={isView}
                  style={{ cursor: isView ? "default" : "text" }}
                  placeholder="John Doe"
                />
              </Form.Item>
            </div>
            <div className="col-span-12">
              <Form.Item label="Nickname" name="otherName">
                <Input
                  readOnly={isView}
                  style={{ cursor: isView ? "default" : "text" }}
                  placeholder="John"
                />
              </Form.Item>
            </div>
            <div className="col-span-12">
              <Form.Item label="Phone" name="phone">
                <Input
                  readOnly={isView}
                  style={{ cursor: isView ? "default" : "text" }}
                  placeholder="09..."
                />
              </Form.Item>
            </div>
            <div className="col-span-12">
              <Form.Item label="Email" name="email">
                <Input
                  readOnly={isView}
                  style={{ cursor: isView ? "default" : "text" }}
                  placeholder="johnDoe@gmail.com"
                />
              </Form.Item>
            </div>
            <div className="col-span-12">
              <Form.Item label="Date of Birth" name="dob">
                <DatePicker
                  className="w-full"
                  // 1. Prevents the calendar from popping up
                  open={isView ? false : undefined}
                  // 2. Prevents the "X" delete button from appearing
                  allowClear={isView ? false : true}
                  // 3. Prevents manual typing in the input box
                  inputReadOnly={isView}
                />
              </Form.Item>
            </div>
          </div>

          <div className="mt-4 border-t border-gray-200 pt-4">
            {/* NRC, Passport */}
            <div className="grid grid-cols-12 gap-x-2">
              <div className="col-span-2">
                <Form.Item label="Region" name="srcNo" className="flex-2">
                  {isView ? (
                    <Input
                      readOnly
                      className="bg-white text-black cursor-default border-gray-200"
                      // Ensure it doesn't look grayed out
                      variant="outlined"
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
                <Form.Item label="Number" name="number">
                  <Input
                    readOnly={isView}
                    style={{ cursor: isView ? "default" : "text" }}
                    placeholder="123456"
                  />
                </Form.Item>
              </div>
            </div>

            <Form.Item label="Passport Number" name="passport">
              <Input
                readOnly={isView}
                style={{ cursor: isView ? "default" : "text" }}
                placeholder="MD123456"
              />
            </Form.Item>
          </div>

          {/* Nationality, Gender, Country, City, Address, Status */}
          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="grid grid-cols-2 gap-x-4">
              <Form.Item label="Nationality" name="nationality">
                <Input
                  readOnly={isView}
                  style={{ cursor: isView ? "default" : "text" }}
                  placeholder="Barma"
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
                    value={getLabel(form.getFieldValue('country'), countryOptions)}
                    className="bg-white text-black cursor-default border-gray-200"
                    variant="outlined"
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
                    value={getLabel(form.getFieldValue('city'), cityOptions)}
                    className="bg-white text-black cursor-default border-gray-200"
                    variant="outlined"
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
              <Input.TextArea rows={2}
                readOnly={isView}
                style={{ cursor: isView ? "default" : "text" }}
                placeholder="Yangon"
              />
            </Form.Item>

            <Form.Item label="Status" name="status" rules={[{ required: true }]}>
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