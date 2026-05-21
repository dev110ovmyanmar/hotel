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
  const phoneValue = Form.useWatch("guestPhone",form);
  const [searchOpen, setSearchOpen] = useState(false);
  const isView = mode === "view";

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
    const formattedValues = {
      ...values,
      eventOrderDate: getFormattedDate(values.eventOrderDate, false),
      eventOrderTime: getFormattedDateTime(values.eventOrderTime, false),
      startDate: getFormattedDate(values.startDate, false),
      startTime: getFormattedDateTime(values.startTime, false),
      endDate: getFormattedDate(values.endDate, false),
      endTime: getFormattedDateTime(values.endTime, false),
    };

    //  API
    console.log("Submitted Values:", formattedValues);

    // LocalStorage
    const existingData = JSON.parse(localStorage.getItem("events")) || [];
    if (mode === "add") {
      localStorage.setItem(
        "events",
        JSON.stringify([
          ...existingData,
          { ...formattedValues, id: Date.now() },
        ]),
      );
    } else {
      const updated = existingData.map((item) =>
        item.id === selectedData.id
          ? { ...formattedValues, id: item.id }
          : item,
      );
      localStorage.setItem("events", JSON.stringify(updated));
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
                ? "Event Facility Order Details"
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
        <Form
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
