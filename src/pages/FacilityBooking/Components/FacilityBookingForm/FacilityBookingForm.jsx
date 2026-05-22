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
import { createFacilityBooking, editFacilityBooking, facilityBookingDetails } from "../../../../api/booking";
import dayjs from "dayjs";
import { facilityMeta } from "../../../../api/facilityPackageApi";

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
  setPage
}) => {
  const [form] = Form.useForm();
  const phoneValue = Form.useWatch("guestPhone", form);
  const dateFormat = "YYYY-MM-DD";
  const disabledDate = current => {
    return current < dayjs().startOf('day');
  };
  const format = "HH:mm:ss";

  const eventTime = Form.useWatch("timeRange", form);
  const startTime = eventTime?.[0];
  const endTime = eventTime?.[1];

  const expectedSeconds =
    startTime && endTime
      ? endTime.diff(startTime, "second")
      : null;

  const hours = Math.floor(expectedSeconds / 3600);
  const minutes = Math.floor((expectedSeconds % 3600) / 60);
  const seconds = expectedSeconds % 60;

  const formattedExpectedHours = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;


  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const initData = queryClient.getQueryData([
    "initData",
    "authenticated",
  ])?.statuses;
  const initDataStatus = initData?.status;

  const { data: facilityMetaData } = useApiQuery({
    fetchQueryName: "facilityMetaData",
    fetchQueryFunction: facilityMeta,
  });

  const facilityPackages = facilityMetaData?.facility_packages?.map((item) => ({
    label: item?.name,
    value: item?.uuid,
  }))

  const createFacilityBooing = useApiMutation({
    mutationFn: createFacilityBooking,
    invalidateKeys: [["facility-booking-list"]],
    // shouldInvalidate: isEdit ? true : page === 1,
  });

  const editFacilityBooing = useApiMutation({
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
        eventDate: dayjs(bookingDetails?.eventDate),

        timeRange: [
          dayjs(bookingDetails?.startTime, "HH:mm:ss"),
          dayjs(bookingDetails?.endTime, "HH:mm:ss"),
        ],

        expectedHours: dayjs(
          bookingDetails?.expectedHours,
          "HH:mm:ss"
        ),
        status: {
          uuid: bookingDetails?.status?.uuid,
        },
      });
    }
  }, [bookingDetails, isEdit, isAdd]);

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
        uuid: values?.facilityPackage
      }
    };

    if (isAdd) {
      createFacilityBooing.mutate(modifiedValues, {
        onSuccess: () => {
          form.resetFields();
          setPage(1);
          setDrawerOpen(false);
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
        uuid: selectedData?.uuid,
      };

      editFacilityBooing.mutate(editValues, {
        onSuccess: () => {
          setDrawerOpen(false);
          handleClose();
          Toast.success("FacilityBooking Updated Successfully!");
        },
      });
    }
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
              <Button
                type="primary"
                onClick={() => {
                  setMode("edit");
                }}
              >
                Edit
              </Button>
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
        >
          <Form.Item
            label="Guest Name"
            name="guestName"
            rules={[{ required: true, message: "Facility Booking Name is Required" }]}
          >
            <Input readOnly={isView} placeholder="Enter FacilityBooking Name" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="guestPhone"
            rules={[
              { required: true },
              { validator: validatePhoneNumber }
            ]}
          >
            <Input
              addonBefore="+959"
              readOnly={isView}
              placeholder="Enter Phone"
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              maxLength={
                phoneValue?.startsWith("09")
                  ? 11
                  : phoneValue?.startsWith("9")
                    ? 10
                    : 9
              }
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
            <Select options={facilityPackages} readOnly={isView} placeholder="Select Event Name" />
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
                required
              >
                <Input value={formattedExpectedHours} readOnly />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Expected Pax"
            name="expectedPax"
            rules={[{ required: true, message: "Expected Pax is Required" }]}
          >
            <TextArea readOnly={isView} placeholder="Enter Expected Hours" />
          </Form.Item>

          <Status isView={isView} statusValue={initDataStatus} />

          <Form.Item label="Remark" name="remark">
            <TextArea readOnly={isView} placeholder="Enter Remark" />
          </Form.Item>


        </Form>
      </Drawer>

    </div>
  );
};

export default FacilityBookingForm;
