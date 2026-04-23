import React, { useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Drawer,
  Row,
  Col,
  DatePicker,
  Button,
  InputNumber,
} from "antd";
import TextArea from "antd/es/input/TextArea";
// import dayjs from "dayjs";
import FormButtons from "../../../../../../component/FormButtons/FormButtons";

const RoomInformationForm = ({
  mode,
  setMode,
  drawerOpen,
  setDrawerOpen,
  selectedData,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const isView = mode === "view";

  useEffect(() => {
    if (drawerOpen && selectedData) {
      form.setFieldsValue({
        ...selectedData,
        date_of_birth: selectedData.date_of_birth
          ? dayjs(selectedData.date_of_birth)
          : null,
      });
    } else if (drawerOpen && mode === "add") {
      form.resetFields();
    }
  }, [selectedData, drawerOpen, form, mode]);

  const onFinish = (values) => {
    const existingData = JSON.parse(localStorage.getItem("roomInfo")) || [];

    if (mode === "add") {
      const newData = {
        ...values,
        id: Date.now(),
        date_of_birth: values.date_of_birth
          ? values.date_of_birth.toISOString()
          : null,
      };
      localStorage.setItem(
        "roomInfo",
        JSON.stringify([...existingData, newData]),
      );
    } else if (mode === "edit") {
      const updatedData = existingData.map((item) =>
        item.id === selectedData.id
          ? { ...item, ...values, id: item.id }
          : item,
      );
      localStorage.setItem("roomInfo", JSON.stringify(updatedData));
    }

    setDrawerOpen(false);
    onSuccess();
    form.resetFields();
  };

  return (
    <Drawer
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      size={600}
      title={
        <div className="flex justify-between items-center">
          <span>
            {mode === "view"
              ? "Room Information Details"
              : mode === "edit"
                ? "Edit Room Information"
                : "Create Room Information"}
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
      <Form form={form} layout="vertical" onFinish={onFinish} disabled={isView}>
        <div className="grid grid-cols-2 gap-6">
          <Form.Item label="Old Room Id" name="oldRoomId">
            <Input readOnly={isView} placeholder="Enter Old Room Id" />
          </Form.Item>
          <Form.Item label="Guest" name="guest">
            <Input readOnly={isView} placeholder="Enter Guest" />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Form.Item
            label="Room Type"
            name="roomType"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Selected Room Type"
              options={[
                {
                  value: "deluxeBangalowDouble",
                  label: "Deluxe Bangalow Double",
                },
                { value: "deluxeBangalow", label: "Deluxe Bangalow" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="New Room"
            name="newRoom"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Selected New Room"
              options={[
                { value: "DBD", label: "DBD 1001" },
                { value: "DB", label: "DB 1001" },
              ]}
            />
          </Form.Item>
        </div>

        {/* <div className="grid grid-cols-2 gap-6">
          <Form.Item label="Arrival Date" name="arrivalDate">
            <DatePicker
              className="w-full"
              disabled={isView}
              //   disabledDate={(current) => {
              //     return current && current < dayjs().startOf("day");
              //   }}
            />
          </Form.Item>
          <Form.Item label="Departure Date" name="departureDate">
            <DatePicker
              className="w-full"
              disabled={isView}
              //   disabledDate={(current) => {
              //     return current && current < dayjs().startOf("day");
              //   }}
            />
          </Form.Item>
        </div> */}

        <div className="grid grid-cols-2 gap-6">
          <Form.Item label="Status" name="status">
            <Select
              placeholder="Selected Status"
              options={[
                { value: "active", label: "Active" },
                { value: "inActive", label: "In Active" },
              ]}
            />
          </Form.Item>
          <Form.Item label="Amount" name="amount">
            <InputNumber
              className="!w-full"
              min={1}
              readOnly={isView}
              placeholder="Enter Amount"
              suffix="MMK"
            />
          </Form.Item>
        </div>
      </Form>
    </Drawer>
  );
};

export default RoomInformationForm;
