import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Drawer,
  Row,
  Col,
  DatePicker,
  Button,
  TimePicker,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import FormItem from "antd/es/form/FormItem";
import SearchEventFacilityOrderForm from "./SearchEventFacilityOrderForm";
import FormButtons from "../../../../../../component/FormButtons/FormButtons";

const EventFacilityOrderForm = ({
  mode,
  setMode,
  drawerOpen,
  setDrawerOpen,
  selectedData,
  onSuccess,
  open,
  onClose,
  reservationId,
}) => {
  const [form] = Form.useForm();
  const isView = mode === "view";

  const [searchOpen, setSearchOpen] = useState(false);

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
    const existingData = JSON.parse(localStorage.getItem("events")) || [];

    const formattedValues = {
      ...values,
      eventOrderDate: values.eventOrderDate?.toISOString(),
      eventOrderTime: values.eventOrderTime?.toISOString(),
      startDate: values.startDate?.toISOString(),
      startTime: values.startTime?.toISOString(),
      endDate: values.endDate?.toISOString(),
      endTime: values.endTime?.toISOString(),
    };

    if (mode === "add") {
      const newData = {
        ...formattedValues,
        id: Date.now(),
      };
      localStorage.setItem(
        "events",
        JSON.stringify([...existingData, newData]),
      );
    } else if (mode === "edit") {
      const updatedData = existingData.map((item) =>
        item.id === selectedData.id
          ? { ...formattedValues, id: item.id }
          : item,
      );
      localStorage.setItem("events", JSON.stringify(updatedData));
    }

    setDrawerOpen(false);
    onSuccess();
    form.resetFields();
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
              {mode === "view"
                ? "Event Facility Order Details"
                : mode === "edit"
                  ? "Edit Event Facility Order"
                  : "Create Event Facility Order"}
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
        >
          <div className="flex justify-end mb-3">
            <Button
              onClick={() => setSearchOpen(true)}
              className="custom-blue-btn"
            >
              Search By
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Event Order Date" name="eventOrderDate">
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item
              label="Event Order Time"
              name="eventOrderTime"
              className="flex-1"
            >
              <TimePicker className="w-full" format="h:mm A" />
            </Form.Item>
          </div>

          <FormItem label="Order Event Name" name="name">
            <Input />
          </FormItem>

          <FormItem label="Facility Name" name="facilityName">
            <Input />
          </FormItem>

          <FormItem label="Package Name" name="packageName">
            <Input />
          </FormItem>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Start Date" name="startDate">
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item label="Start Time" name="startTime" className="flex-1">
              <TimePicker className="w-full" format="h:mm A" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="End Date" name="endDate">
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item label="End Time" name="endTime" className="flex-1">
              <TimePicker className="w-full" format="h:mm A" />
            </Form.Item>
          </div>

          <Form.Item label="Facility Name" name="facilityName">
            <Select
              placeholder="Select Facility Name"
              style={{ width: "100%" }}
              options={[
                { value: "aa", label: "aa" },
                { value: "bb", label: "bb" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Booking Type" name="bookingType">
            <Select
              placeholder="Select Booking Type"
              style={{ width: "100%" }}
              options={[
                { value: "aa", label: "aa" },
                { value: "bb", label: "bb" },
              ]}
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Guest Name" name="guestName">
              <Input />
            </Form.Item>

            <Form.Item label="Guest Phone" name="guestPhone">
              <Input />
            </Form.Item>
          </div>

          <Form.Item label="Status" name="status">
            <Select
              placeholder="Select Status"
              style={{ width: "100%" }}
              options={[
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Remarks" name="remarks">
            <TextArea />
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
