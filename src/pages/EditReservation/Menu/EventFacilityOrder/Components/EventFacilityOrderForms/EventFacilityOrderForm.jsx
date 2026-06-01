import React, { useEffect, useState } from "react";
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
} from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import SearchEventFacilityOrderForm from "./SearchEventFacilityOrderForm";
import FormButtons from "../../../../../../component/FormButtons/FormButtons";
import {
  getFormattedDate,
  getFormattedDateTime,
  validatePhoneNumber,
} from "../../../../../../utils";
import { facilityMeta } from "../../../../../../api/facilityPackageApi";
import useApiQuery from "../../../../../../hooks/useApiQuery";
import Status from "../../../../../../component/Status/Status";
import { queryClient } from "../../../../../../app/queryClient";
import { createFacilityBooking, editFacilityBooking, facilityBookingDetails } from "../../../../../../api/booking";
import { useApiMutation } from "../../../../../../hooks/useApiMutation";
import Toast from "../../../../../../component/Toast/Toast";

const { RangePicker } = TimePicker;

const EventFacilityOrderForm = ({
  mode,
  setMode,
  drawerOpen,
  setDrawerOpen,
  selectedData,
  onSuccess,
  reservationId,
  searchOpen,
  setSearchOpen,
  refetchFacilityList,
}) => {
  const [form] = Form.useForm();
  const phoneValue = Form.useWatch("guestPhone", form);
  const facilityPackageForm = Form.useWatch("facilityPackage", form);

  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const initData = queryClient.getQueryData([
    "initData",
    "authenticated",
  ])?.statuses;
  const initDataStatus = initData?.status;

  const dateFormat = "DD-MM-YYYY";
  const disabledDate = current => {
    return current < dayjs().startOf('day');
  };
  const format = "HH:mm";

  const eventTime = Form.useWatch("timeRange", form);
  const startTime = eventTime?.[0];
  const endTime = eventTime?.[1];

  const expectedSeconds =
    startTime && endTime
      ? endTime.diff(startTime, "second")
      : null;

  // const hours = Math.floor(expectedSeconds / 3600);
  // const minutes = Math.floor((expectedSeconds % 3600) / 60);
  // const seconds = expectedSeconds % 60;

  // const frontformattedExpectedHours = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  // const formattedExpectedHours = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

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
    // shouldInvalidate: isEdit ? true : page === 1,
  });

  const editFacilityBookings = useApiMutation({
    mutationFn: editFacilityBooking,
    invalidateKeys: [["facility-booking-list"]],
    // shouldInvalidate: isEdit ? true : page === 1,
  });

  const { data: bookingDetails, isPending, error } = useApiQuery({
    fetchQueryName: "facility-booking-details",
    fetchQueryFunction: facilityBookingDetails,
    params: {
      uuid: selectedData?.uuid,
    },
    options: {
      enabled: !!selectedData?.uuid,
    },
  });

  useEffect(() => {
    if (isAdd) {
      form.resetFields();
    }

    if (isAdd && initDataStatus) {
      form.setFieldsValue({
        status: {
          uuid: initDataStatus?.find((item) => item?.code === "active")?.uuid,
        },
      });
    }

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

        expectedHours: dayjs(
          bookingDetails?.expectedHours,
          "HH:mm"
        ),
        reservation: {
          uuid: bookingDetails?.reservation?.uuid,
        },
        status: {
          uuid: bookingDetails?.status?.uuid,
        },
      });
    }
  }, [bookingDetails, isEdit, isAdd]);

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
        expectedHoursBackend: formattedExpectedHours
      });
    }
  }, [eventTime]);

  const onFinish = (values) => {
    const modifiedValues = {
      ...values,
      eventDate: values?.eventDate.format("YYYY-MM-DD"),
      startTime: values.timeRange[0].format("HH:mm:ss"),
      endTime: values.timeRange[1].format("HH:mm:ss"),
      expectedHours: values?.expectedHoursBackend,
      facilityPackage: {
        uuid: values.facilityPackage
      },
      reservation: {
        uuid: isEdit ? bookingDetails?.reservation?.uuid : reservationId
      },
      uuid: isEdit ? bookingDetails?.uuid : null
    };

    if (isAdd) {
      createFacilityBookings.mutate(modifiedValues, {
        onSuccess: () => {
          form.resetFields();
          setPage(1);
          Toast.success("Facility Booking Created Successfully!");
          setDrawerOpen(false);
        },
      })
    }


    if (isEdit) {
      editFacilityBookings.mutate(modifiedValues, {
        onSuccess: () => {
          Toast.success("FacilityBooking Updated Successfully!");
          setDrawerOpen(false);
        },
      });
    }
    setDrawerOpen(false);
    onSuccess();
  };

  return (
    <>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        size={650}
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
              <Button type="primary" onClick={() => setMode("edit")}>
                Edit
              </Button>
            ) : (
              <FormButtons onClick={() => form.submit()} mode={mode} isPending={isEdit ? editFacilityBookings?.isPending : createFacilityBookings?.isPending} />
            )}
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          disabled={isView}
          initialValues={{ status: "Active" }}
        >
          {
            isAdd && (
              <div className="flex justify-end mb-4">
                <Button
                  onClick={() => setSearchOpen(true)}
                  className="custom-blue-btn"
                >
                  Search By
                </Button>
              </div>
            )
          }

          <Form.Item
            label="Name"
            name="guestName"
            rules={[{ required: true, message: "Facility Booking Name is Required" }]}
          >
            <Input readOnly={isView} placeholder="Enter Name" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="guestPhone"
            rules={[
              { required: true },

            ]}
          >
            <Input
              readOnly={isView}
              placeholder="Enter Phone"
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key) &&
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
            rules={[{ required: true, message: "Facility Package is Required" }]}

          >
            <Select
              options={facilityPackages}
              readOnly={isView}
              placeholder="Select Event Name"
              onSelect={(value) => {
                const selectedPackage = facilityPackages.find(
                  (item) => item.value === value
                );

                form.setFieldsValue({
                  expectedHours: selectedPackage?.expectedHours?.slice(0, 5),
                  expectedPax: selectedPackage?.expectedPax,
                });
              }}
            />
          </Form.Item>


          {/* <Form.Item
            label="Total Price"
            name="totalPrice"
            rules={[
              { required: true },
            ]}
          >
            <Input readOnly={isView} placeholder="Enter Total Price" />
          </Form.Item> */}

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
                <RangePicker
                  format={format}

                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Expected Hours"
                name="expectedHours"
                required
              >
                <Input readOnly />
                {/* value={frontformattedExpectedHours}  */}
              </Form.Item>
            </Col>

            <Form.Item
              label="Expected Hours"
              name="expectedHoursBackend"
              hidden
            >
              <Input readOnly />
              {/* value={frontformattedExpectedHours}  */}
            </Form.Item>
          </Row>

          <Form.Item
            label="Expected Pax"
            name="expectedPax"
            rules={[{ required: true, message: "Expected Pax is Required" }]}
          >
            <Input readOnly={isView} placeholder="Enter Expected Pax" />
          </Form.Item>

          <Status isView={isView} statusValue={initDataStatus} />

          <Form.Item label="Remark" name="remark">
            <TextArea readOnly={isView} placeholder="Enter Remark" />
          </Form.Item>

          {/* <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Event Order Date" name="eventOrderDate">
                <DatePicker className="w-full" disabled={isView} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Event Order Time" name="eventOrderTime">
                <TimePicker
                  className="w-full"
                  format="h:mm A"
                  disabled={isView}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Order Event Name" name="name">
            <Input placeholder="Enter Name" readOnly={isView} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Start Date" name="startDate">
                <DatePicker className="w-full" disabled={isView} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Time" name="startTime">
                <TimePicker
                  className="w-full"
                  format="h:mm A"
                  disabled={isView}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="End Date" name="endDate">
                <DatePicker className="w-full" disabled={isView} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Time" name="endTime">
                <TimePicker
                  className="w-full"
                  format="h:mm A"
                  disabled={isView}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Facility Name" name="facilityName">
            <Select
              placeholder="Select Facility"
              disabled={isView}
              options={[
                { value: "aa", label: "Facility AA" },
                { value: "bb", label: "Facility BB" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Estimated Pax"
            name="estimatedPax"
            rules={[{ required: true }]}
          >
            <InputNumber
              className="!w-full"
              min={0}
              suffix="Pax"
              placeholder="Enter Estimated Pax"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Guest Name" name="guestName">
                <Input readOnly={isView} placeholder="Enter Guest Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Guest Phone"
                name="guestPhone"
                rules={[
                  { validator: validatePhoneNumber }

                ]}
              >
                <Input
                  readOnly={isView}
                  placeholder="Enter Guest Phone"
                  maxLength={
                    phoneValue?.startsWith("09")
                      ? 11
                      : phoneValue?.startsWith("9")
                        ? 10
                        : 9
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Status" name="status">
            <Select
              disabled={isView}
              options={[
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Remarks" name="remarks">
            <TextArea rows={3} placeholder="Enter Remarks..." />
          </Form.Item> */}
        </Form>


      </Drawer>

      {searchOpen && (
        <SearchEventFacilityOrderForm
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          reservationId={reservationId}
          setDrawerOpen={setDrawerOpen}
          facilityPackagesOptions={facilityPackages}

        />)
      }
    </>
  );
};

export default EventFacilityOrderForm;
