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
import { createFacilityBooking } from "../../../../../../api/booking";
import { useApiMutation } from "../../../../../../hooks/useApiMutation";

const { RangePicker } = TimePicker;

const EventFacilityOrderForm = ({
  mode,
  setMode,
  drawerOpen,
  setDrawerOpen,
  selectedData,
  onSuccess,
  reservationId,
}) => {
  const [form] = Form.useForm();
  const phoneValue = Form.useWatch("guestPhone", form);
  const [searchOpen, setSearchOpen] = useState(false);
  const isView = mode === "view";

  const initData = queryClient.getQueryData([
    "initData",
    "authenticated",
  ])?.statuses;
  const initDataStatus = initData?.status;

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

  const { data: facilityMetaData } = useApiQuery({
    fetchQueryName: "facilityMetaData",
    fetchQueryFunction: facilityMeta,
  });

  const facilityPackages = facilityMetaData?.facility_packages?.map((item) => ({
    label: item?.name,
    value: item?.uuid,
  }));

  const createFacilityBooing = useApiMutation({
    mutationFn: createFacilityBooking,
    invalidateKeys: [["facility-booking-list"]],
    // shouldInvalidate: isEdit ? true : page === 1,
  });

  useEffect(() => {
    if (drawerOpen && selectedData) {
      form.setFieldsValue({
        ...selectedData,
        eventOrderDate: selectedData.eventOrderDate
          ? dayjs(selectedData.eventOrderDate)
          : null,
        eventOrderTime: selectedData.eventOrderTime
          ? dayjs(selectedData.eventOrderTime)
          : null,
        startDate: selectedData.startDate
          ? dayjs(selectedData.startDate)
          : null,
        startTime: selectedData.startTime
          ? dayjs(selectedData.startTime)
          : null,
        endDate: selectedData.endDate ? dayjs(selectedData.endDate) : null,
        endTime: selectedData.endTime ? dayjs(selectedData.endTime) : null,
      });
    } else if (drawerOpen && mode === "add") {
      form.resetFields();
    }
  }, [selectedData, drawerOpen, form, mode]);

  const onFinish = (values) => {
    const modifiedValues = {
      ...values,
      eventDate: values?.eventDate.format("YYYY-MM-DD"),
      startTime: values.timeRange[0].format("HH:mm:ss"),
      endTime: values.timeRange[1].format("HH:mm:ss"),
      expectedHours: formattedExpectedHours,
      facilityPackage: {
        uuid: values.facilityPackage
      },
      reservation: {
        uuid: reservationId
      }
    };

    createFacilityBooing.mutate(modifiedValues)
    //  API
    // console.log("Submitted Values:", formattedValues);

    // // LocalStorage
    // const existingData = JSON.parse(localStorage.getItem("events")) || [];
    // if (mode === "add") {
    //   localStorage.setItem(
    //     "events",
    //     JSON.stringify([
    //       ...existingData,
    //       { ...formattedValues, id: Date.now() },
    //     ]),
    //   );
    // } else {
    //   const updated = existingData.map((item) =>
    //     item.id === selectedData.id
    //       ? { ...formattedValues, id: item.id }
    //       : item,
    //   );
    //   localStorage.setItem("events", JSON.stringify(updated));
    // }

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
                ? "s Details"
                : mode === "edit"
                  ? "Edit Order"
                  : "Create Order"}
            </span>
            {isView ? (
              <Button type="primary" onClick={() => setMode("edit")}>
                Edit
              </Button>
            ) : (
              <FormButtons onClick={() => form.submit()} mode={mode} />
            )}
          </div>
        }
      >
        {/* <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          disabled={isView}
          initialValues={{ status: "Active" }}
        >
          <div className="flex justify-end mb-4">
            <Button
              onClick={() => setSearchOpen(true)}
              className="custom-blue-btn"
            >
              Search By
            </Button>
          </div>

          <Row gutter={16}>
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
          </Form.Item>
        </Form> */}

        <Form
          form={form}
          layout="vertical"
          validateTrigger="onSubmit"
          onFinish={onFinish}
          disabled={isView}
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

      <SearchEventFacilityOrderForm
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        reservationId={reservationId}
      />
    </>
  );
};

export default EventFacilityOrderForm;
