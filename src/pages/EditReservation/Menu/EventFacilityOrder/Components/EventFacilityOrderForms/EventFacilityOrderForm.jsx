import { useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Drawer,
  DatePicker,
  Button,
  TimePicker,
  InputNumber,
  Row,
  Col,
  Radio,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import SearchEventFacilityOrderForm from "./SearchEventFacilityOrderForm";
import FormButtons from "../../../../../../component/FormButtons/FormButtons";
import { darkModeStyle } from "../../../../../../utils";
import { facilityMeta } from "../../../../../../api/facilityPackageApi";
import useApiQuery from "../../../../../../hooks/useApiQuery";
import { queryClient } from "../../../../../../app/queryClient";
import {
  createFacilityBooking,
  editFacilityBooking,
  facilityBookingDetails,
} from "../../../../../../api/booking";
import { useApiMutation } from "../../../../../../hooks/useApiMutation";
import Toast from "../../../../../../component/Toast/Toast";
import { getGuestMeta } from "./../../../../../../api/guestNoteApi";

const { RangePicker } = TimePicker;

const EventFacilityOrderForm = ({
  mode,
  setMode,
  drawerOpen,
  setDrawerOpen,
  selectedData,
  setSelectedData,
  onSuccess,
  reservationId,
  searchOpen,
  setSearchOpen,
  reservationRoom,
}) => {
  const [form] = Form.useForm();
  const guestType = Form.useWatch("guestType", form);

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const initData = queryClient.getQueryData([
    "initData",
    "authenticated",
  ])?.statuses;
  const initDataFacilityStatus = initData?.facility_status;

  const dateFormat = "YYYY-MM-DD";
  const disabledDate = (current) => {
    return current < dayjs().startOf("day");
  };
  const format = "HH:mm";

  const eventTime = Form.useWatch("timeRange", form);

  const { data: facilityMetaData } = useApiQuery({
    fetchQueryName: "facilityMetaData",
    fetchQueryFunction: facilityMeta,
  });

  const facilityPackages = facilityMetaData?.facility_packages?.map((item) => ({
    label: item?.name,
    value: item?.uuid,
    expectedPax: item?.includedPax,
    expectedHours: item?.includedHours,
  }));

  const createFacilityBookings = useApiMutation({
    mutationFn: createFacilityBooking,
    invalidateKeys: [["facility-booking-list"]],
  });

  const editFacilityBookings = useApiMutation({
    mutationFn: editFacilityBooking,
    invalidateKeys: [["facility-booking-list"]],
  });

  const { data: bookingDetails } = useApiQuery({
    fetchQueryName: "facility-booking-details",
    fetchQueryFunction: facilityBookingDetails,
    params: {
      uuid: selectedData?.uuid,
    },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  const { data: guestDetails } = useApiQuery({
    fetchQueryName: "guest-details",
    fetchQueryFunction: getGuestMeta,
  });

  const guestList = Array.isArray(guestDetails)
    ? guestDetails
    : guestDetails?.data || guestDetails?.guests || [];

  const guestOptions = guestList.map((guest) => ({
    label: guest?.fullName,
    value: guest?.uuid,
    phone: guest?.phone,
    fullName: guest?.fullName,
  }));

  const currentStatus = bookingDetails?.status?.code;

  const facilityStatus = initDataFacilityStatus?.map((item) => ({
    value: item.uuid,
    label: item.name,
    disabled:
      isView ||
      (isAdd && ["completed", "cancelled"].includes(item?.code)) ||
      (isEdit && (item.code === "completed" && reservationRoom?.roomStatus?.code == "confirmed")
      )
  }));

  useEffect(() => {
    if (drawerOpen && isAdd) {
      form.resetFields();

      form.setFieldsValue({
        guestType: "new",
        expectedPax: 1,
      });
    }
  }, [drawerOpen, isAdd, form]);

  useEffect(() => {
    if (!(isView || isEdit) || !bookingDetails) return;

    const startTime = dayjs(bookingDetails.startTime, "HH:mm:ss");
    const endTime = dayjs(bookingDetails.endTime, "HH:mm:ss");

    const expectedSeconds = endTime.diff(startTime, "second");

    const hours = Math.floor(expectedSeconds / 3600);
    const minutes = Math.floor((expectedSeconds % 3600) / 60);

    const uiFormat =
      `${String(hours).padStart(2, "0")}:` +
      `${String(minutes).padStart(2, "0")}`;

    const isExistingGuest = !!bookingDetails?.guest?.uuid;

    form.setFieldsValue({
      guestType: isExistingGuest ? "existing" : "new",
      guestUuid: isExistingGuest ? bookingDetails?.guest?.uuid : undefined,
      guestName:
        bookingDetails?.guestName || bookingDetails?.guest?.fullName || "",
      guestPhone:
        bookingDetails?.guestPhone || bookingDetails?.guest?.phone || "",
      eventName: bookingDetails?.eventName,
      facilityPackage: bookingDetails?.facilityPackage?.uuid,
      eventDate: bookingDetails?.eventDate
        ? dayjs(bookingDetails.eventDate)
        : null,
      timeRange: [startTime, endTime],
      expectedHours: uiFormat,
      expectedHoursBackend: bookingDetails?.expectedHours,
      expectedPax: bookingDetails?.expectedPax,
      remark: bookingDetails?.remark,
      reservation: {
        uuid: bookingDetails?.reservation?.uuid,
      },
      status: {
        uuid: bookingDetails?.status?.uuid,
      },
    });
  }, [isView, isEdit, bookingDetails, form]);

  useEffect(() => {
    if (eventTime?.[0] && eventTime?.[1]) {
      const startTime = eventTime[0];
      const endTime = eventTime[1];

      const expectedSeconds = endTime.diff(startTime, "second");

      const hours = Math.floor(expectedSeconds / 3600);
      const minutes = Math.floor((expectedSeconds % 3600) / 60);
      const seconds = expectedSeconds % 60;

      const uiFormat =
        `${String(hours).padStart(2, "0")}:` +
        `${String(minutes).padStart(2, "0")}`;

      const formattedExpectedHours =
        `${String(hours).padStart(2, "0")}:` +
        `${String(minutes).padStart(2, "0")}:` +
        `${String(seconds).padStart(2, "0")}`;

      form.setFieldsValue({
        expectedHours: uiFormat,
        expectedHoursBackend: formattedExpectedHours,
      });
    }
  }, [eventTime]);

  const onFinish = (values) => {
    const selectedGuest = guestList.find(
      (guest) => guest?.uuid === values?.guestUuid,
    );

    const guestName =
      values?.guestType === "existing"
        ? values?.guestName ||
        selectedGuest?.fullName ||
        bookingDetails?.guest?.fullName ||
        ""
        : values?.guestName || "";

    const guestPhone =
      values?.guestType === "existing"
        ? values?.guestPhone ||
        selectedGuest?.phone ||
        bookingDetails?.guest?.phone ||
        ""
        : values?.guestPhone || "";
    const modifiedValues = {
      ...values,
      eventDate: values?.eventDate?.format("YYYY-MM-DD"),
      startTime: values?.timeRange?.[0]?.format("HH:mm:ss"),
      endTime: values?.timeRange?.[1]?.format("HH:mm:ss"),
      expectedHours: values?.expectedHoursBackend,
      facilityPackage: {
        uuid: values?.facilityPackage,
      },
      guestName,
      guestPhone,
      guest:
        values?.guestType === "existing"
          ? {
            uuid: values?.guestUuid,
          }
          : {
            fullName: guestName,
            phone: guestPhone,
          },
      reservation: {
        uuid: isEdit ? bookingDetails?.reservation?.uuid : reservationId,
      },
      uuid: isEdit ? bookingDetails?.uuid : null,
    };

    if (isAdd) {
      createFacilityBookings.mutate(modifiedValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          setSelectedData(null);
          form.resetFields();
          Toast.success("Facility Booking Created Successfully!");
        },
      });
    }

    if (isEdit) {
      editFacilityBookings.mutate(modifiedValues, {
        onSuccess: () => {
          Toast.success("Facility Booking Updated Successfully!");
          setDrawerOpen(false);
          setSelectedData(null);
        },
      });
    }

    onSuccess();
  };
  const childSharedProps = {
    mode: "spinner",
    min: 1,
    max: 10,
    style: { width: 150 },
  };

  return (
    <>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size={550}
        title={
          <div className="flex justify-between items-center">
            <span>
              {isView
                ? "Facility Order Details"
                : mode === "edit"
                  ? "Edit Facility Order"
                  : "Create Facility Order"}
            </span>
            {isView ? (
              selectedData?.status?.code !== "completed" &&
              selectedData?.status?.code !== "cancelled" && (
                <Button type="primary" onClick={() => setMode("edit")}>
                  Edit
                </Button>
              )
            ) : (
              <FormButtons
                onClick={() => form.submit()}
                mode={mode}
                isPending={
                  isEdit
                    ? editFacilityBookings?.isPending
                    : createFacilityBookings?.isPending
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
          initialValues={{ expectedPax: 1 }}
        >
          {isAdd && (
            <div className="flex justify-end mb-4">
              <Button
                onClick={() => setSearchOpen(true)}
                className="custom-blue-btn"
              >
                Search By
              </Button>
            </div>
          )}

          <Form.Item label="Guest Name" name="guestType" className="mb-2">
            <Radio.Group
              disabled={isView}
              onChange={(e) => {
                const type = e.target.value;

                if (type === "new") {
                  form.setFieldsValue({
                    guestUuid: undefined,
                    guestName: "",
                    guestPhone: "",
                  });
                }

                if (type === "existing") {
                  form.setFieldsValue({
                    guestUuid: undefined,
                    guestName: undefined,
                    guestPhone: "",
                  });
                }
              }}
            >
              <Radio
                value="new"
                className={
                  guestType === "new" ? "custom-disabled-checkbox" : ""
                }
              >
                New Guest
              </Radio>
              <Radio
                value="existing"
                className={
                  guestType === "existing" ? "custom-disabled-checkbox" : ""
                }
              >
                Existing Guest
              </Radio>
            </Radio.Group>
          </Form.Item>

          {guestType === "existing" ? (
            <Form.Item
              label="Existing Guest"
              name="guestUuid"
              rules={[
                {
                  required: true,
                  message: "Please select an existing guest",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Select Existing Guest"
                disabled={isView}
                options={guestOptions}
                optionFilterProp="label"
                filterOption={(input, option) =>
                  option?.label?.toLowerCase().includes(input.toLowerCase())
                }
                onChange={(value, option) => {
                  form.setFieldsValue({
                    guestUuid: value,
                    guestName: option?.fullName || option?.label || "",
                    guestPhone: option?.phone || "",
                  });
                }}
              />
            </Form.Item>
          ) : (
            <Form.Item
              label="New Guest Name"
              name="guestName"
              rules={[
                {
                  required: true,
                  message: "Guest Name is Required",
                },
              ]}
            >
              <Input readOnly={isView} placeholder="Enter New Guest Name" />
            </Form.Item>
          )}

          <Form.Item
            label="Guest Phone No"
            name="guestPhone"
            rules={[
              {
                required: true,
                message: "Guest Phone is Required",
              },
            ]}
          >
            <Input
              maxLength={20}
              disabled={isView || guestType === "existing"}
              placeholder="Enter Phone"
              onKeyPress={(e) => {
                const value = e.currentTarget.value;

                if (
                  !/[0-9]/.test(e.key) &&
                  !(e.key === "+" && value.length === 0)
                ) {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>

          <Form.Item
            label="Event Name"
            name="eventName"
            rules={[{ required: true, message: "Event Name is Required" }]}
          >
            <Input readOnly={isView} placeholder="Enter Event Name" />
          </Form.Item>

          <Form.Item
            label="Facility Package"
            name="facilityPackage"
            rules={[
              { required: true, message: "Facility Package is Required" },
            ]}
            getValueProps={(value) => ({
              value: isView
                ? facilityPackages.find((item) => item.value === value)?.label
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
                options={facilityPackages}
                placeholder="Select Event Name"
              />
            )}
          </Form.Item>

          <Form.Item
            label="Event Date"
            name="eventDate"
            rules={[{ required: true, message: "Event Date is Required" }]}
          >
            <DatePicker
              format={dateFormat}
              disabledDate={disabledDate}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Time Range"
                name="timeRange"
                rules={[{ required: true, message: "Time Range is Required" }]}
              >
                <RangePicker format={format} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Expected Hours" name="expectedHours" required>
                <Input readOnly />
              </Form.Item>
            </Col>

            <Form.Item
              label="Expected Hours"
              name="expectedHoursBackend"
              hidden
            >
              <Input readOnly />
            </Form.Item>
          </Row>

          <Form.Item
            label="Expected Pax"
            name="expectedPax"
            rules={[{ required: true, message: "Expected Pax is Required" }]}
          >
            <InputNumber
              {...childSharedProps}
              placeholder="Outlined"
              readOnly={isView}
              style={{ width: 240 }}
              className="minus-icon"
            />
          </Form.Item>

          <Form.Item
            label="Facility Status"
            name={["status", "uuid"]}
            className="col-span-1"
            rules={[
              { required: true, message: "Please select a Facility Status" },
            ]}
            getValueProps={(value) => ({
              value: isView
                ? facilityStatus.find((item) => item.value === value)?.label
                : value,
            })}
          >
            {isView ? (
              <Input readOnly />
            ) : (
              <Select
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={facilityStatus}
                placeholder="Select a Facility Status"
                disabled={
                  isEdit &&
                  (currentStatus === "completed" ||
                    currentStatus === "cancelled")
                }
              />
            )}
          </Form.Item>

          <Form.Item label="Remark" name="remark">
            <TextArea
              readOnly={isView}
              placeholder="Enter Remark"
              className={darkModeStyle}
            />
          </Form.Item>
        </Form>
      </Drawer>

      {searchOpen && (
        <SearchEventFacilityOrderForm
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          reservationId={reservationId}
          setDrawerOpen={setDrawerOpen}
          facilityPackagesOptions={facilityPackages}
        />
      )}
    </>
  );
};

export default EventFacilityOrderForm;
