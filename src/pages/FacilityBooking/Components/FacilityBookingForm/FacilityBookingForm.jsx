import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Drawer,
  Select,
  InputNumber,
  Row,
  Col,
  TimePicker,
  DatePicker,
} from "antd";
import Toast from "../../../../component/Toast/Toast";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import useApiQuery from "../../../../hooks/useApiQuery";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import { queryClient } from "./../../../../app/queryClient";
import Status from "./../../../../component/Status/Status";
import ImageUpload from "../../../../component/ImageUpload/ImageUpload";
import { validatePhoneNumber } from "../../../../utils";
import {
  createFacilityBooking,
  editFacilityBooking,
  facilityBookingDetails,
} from "../../../../api/booking";
import dayjs from "dayjs";
import { facilityMeta } from "../../../../api/facilityPackageApi";
import usePermission from "../../../../hooks/usePermission";
import { PERMISSIONS } from "../../../../variables/permission";

const { TextArea } = Input;
const { RangePicker } = TimePicker;

const FacilityBookingForm = ({
  mode,
  setMode,
  selectedData,
  setSelectedData,
  drawerOpen,
  setDrawerOpen,
  page,
  setPage,
}) => {
  const [form] = Form.useForm();
  const phoneValue = Form.useWatch("guestPhone", form);
  const dateFormat = "DD-MM-YYYY";
  const disabledDate = (current) => {
    return current < dayjs().startOf("day");
  };

  const { hasPermission } = usePermission();
  const canEdit = hasPermission(PERMISSIONS.FACILITY_BOOKING_EDIT);

  const format = "HH:mm";

  const eventTime = Form.useWatch("timeRange", form);
  const startTime = eventTime?.[0];
  const endTime = eventTime?.[1];

  const expectedSeconds =
    startTime && endTime ? endTime.diff(startTime, "second") : null;

  const hours = Math.floor(expectedSeconds / 3600);
  const minutes = Math.floor((expectedSeconds % 3600) / 60);
  const seconds = expectedSeconds % 60;

  const frontformattedExpectedHours = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  const formattedExpectedHours = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const initData = queryClient.getQueryData([
    "initData",
    "authenticated",
  ])?.statuses;
  const initDataFacilityStatus = initData?.facility_status;

  const { data: facilityMetaData } = useApiQuery({
    fetchQueryName: "facilityMetaData",
    fetchQueryFunction: facilityMeta,
  });

  const facilityPackages = facilityMetaData?.facility_packages?.map((item) => ({
    label: item?.name,
    value: item?.uuid,
  }));

  const createFacilityBookings = useApiMutation({
    mutationFn: createFacilityBooking,
    invalidateKeys: [["facility-booking-list"]],
    // shouldInvalidate: isEdit ? true : page === 1,
  });

  const editFacilityBookings = useApiMutation({
    mutationFn: editFacilityBooking,
    invalidateKeys: [["facility-booking-list"]],
    // shouldInvalidate: isEdit ? true : page === 1,
  });

  const {
    data: bookingDetails,
    isPending,
    error,
  } = useApiQuery({
    fetchQueryName: "facility-booking-details",
    fetchQueryFunction: facilityBookingDetails,
    params: {
      uuid: selectedData?.uuid,
    },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  const currentStatus = bookingDetails?.status?.code;

  const facilityStatus = initDataFacilityStatus?.map((item) => ({
    value: item.uuid,
    label: item.name,
    disabled:
      isView ||

      // Create mode
      (isAdd &&
        ["completed", "cancelled"].includes(item?.code)) ||

      (isEdit &&
        currentStatus === "confirmed" &&
        item.code === "pending"),
  }));

  useEffect(() => {
    if (drawerOpen && isAdd) {
      form.resetFields();
    }

    if (drawerOpen && isAdd && initDataFacilityStatus) {
      form.setFieldsValue({
        status: {
          uuid: initDataFacilityStatus?.find((item) => item?.code === "pending")?.uuid,
        },
      });
    }

  }, [isAdd, initDataFacilityStatus]);

  useEffect(() => {
    const FacilityBookingFormDataView = isView || isEdit;
    if (FacilityBookingFormDataView && bookingDetails) {
      form.setFieldsValue({
        ...bookingDetails,

        facilityPackage: bookingDetails?.facilityPackage?.uuid,

        eventDate: dayjs(bookingDetails?.eventDate),

        timeRange: [
          dayjs(bookingDetails?.startTime, "HH:mm"),
          dayjs(bookingDetails?.endTime, "HH:mm"),
        ],

        expectedHours: dayjs(bookingDetails?.expectedHours, "HH:mm"),
        status: {
          uuid: bookingDetails?.status?.uuid,
        },
      });
    }
  }, [isEdit, isView, bookingDetails]);

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

  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedData(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    const modifiedValues = {
      ...values,
      eventDate: values?.eventDate.format("YYYY-MM-DD"),
      startTime: values.timeRange[0].format("HH:mm:ss"),
      endTime: values.timeRange[1].format("HH:mm:ss"),
      expectedHours: formattedExpectedHours,
      facilityPackage: {
        uuid: values?.facilityPackage,
      },
    };

    if (isAdd) {
      createFacilityBookings.mutate(modifiedValues, {
        onSuccess: () => {
          form.resetFields();
          setPage(1);
          // setDrawerOpen(false);
          handleClose();
          Toast.success("Facility Booking Created Successfully!");
        },
      });
    }

    if (isEdit) {
      const editValues = {
        ...values,
        eventDate: values?.eventDate.format("YYYY-MM-DD"),
        startTime: values.timeRange[0].format("HH:mm:ss"),
        endTime: values.timeRange[1].format("HH:mm:ss"),
        expectedHours: formattedExpectedHours,
        facilityPackage: {
          uuid: values?.facilityPackage,
        },
        uuid: bookingDetails?.uuid,
      };

      editFacilityBookings.mutate(editValues, {
        onSuccess: () => {
          // setDrawerOpen(false);
          handleClose();
          Toast.success("FacilityBooking Updated Successfully!");
        },
      });
    }
  };

  const childSharedProps = {
    mode: "spinner",
    min: 1,
    max: 10,
    style: { width: 150 },
  };

  return (
    <div className="flex justify-center">
      <Drawer
        open={drawerOpen}
        onClose={handleClose}
        size={550}
        title={
          <div className="flex justify-between items-center">
            <span>
              {mode === "view"
                ? "Facility Booking Details"
                : mode === "edit"
                  ? "Edit Facility Booking"
                  : "Add New Facility Booking"}
            </span>
            {isView ? (
              canEdit && (
                <Button
                  type="primary"
                  onClick={() => {
                    setMode("edit");
                  }}
                >
                  Edit
                </Button>
              )
            ) : (
              <FormButtons
                onClick={() => form.submit()}
                isPending={editFacilityBooking.isPending}
                mode={mode}
              />
            )}
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          validateTrigger="onSubmit"
          onFinish={onFinish}
          initialValues={{
            expectedPax: 1,
          }}
        >
          <Form.Item
            label="Guest Name"
            name="guestName"
            rules={[
              { required: true, message: "Facility Booking Name is Required" },
            ]}
          >
            <Input readOnly={isView} placeholder="Enter FacilityBooking Name" />
          </Form.Item>

          <Form.Item
            label="Guest Phone No"
            name="guestPhone"
            rules={[{ required: true }]}
          >
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
          >
            <Select
              options={facilityPackages}
              readOnly={isView}
              placeholder="Select Event Name"
            />
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
              <Form.Item label="Expected Hours" required>
                <Input value={frontformattedExpectedHours} readOnly />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Expected Pax"
            name="expectedPax"
            rules={[{ required: true, message: "Expected Pax is Required" }]}
            className="minus-icon"
          >
            <InputNumber
              {...childSharedProps}
              placeholder="Outlined"
              readOnly={isView}
              style={{ width: 240 }}
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
                disabled={isEdit && (currentStatus === 'completed' || currentStatus === 'cancelled')}
              />
            )}
          </Form.Item>

          <Form.Item label="Remark" name="remark">
            <TextArea readOnly={isView} placeholder="Enter Remark" />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default FacilityBookingForm;
