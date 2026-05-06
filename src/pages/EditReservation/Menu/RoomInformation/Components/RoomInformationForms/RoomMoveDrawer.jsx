import React, { useEffect, useState } from "react";
import {
  Drawer,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Button,
  Space,
  Row,
  Col,
  TimePicker,
  Select,
  Card,
} from "antd";
import FormButtons from "../../../../../../component/FormButtons/FormButtons";
import TextArea from "antd/es/input/TextArea";
import UpdateRoomMoveDrawer from "./UpdateRoomMoveDrawer";
import dayjs from "dayjs";
import { getFormattedDate } from "../../../../../../utils";

const onChange = (value) => {
  console.log("changed", value);
};

const RoomMoveDrawer = ({ open, onClose, reservationId, selectedData }) => {
  const [form] = Form.useForm();
  const [updateOpen, setUpdateOpen] = useState(false);

  useEffect(() => {
    if (open && selectedData) {
      form.setFieldsValue({
        ...selectedData,

        arrivalDate: selectedData.arrivalDate
          ? dayjs(selectedData.arrivalDate)
          : null,
        departureDate: selectedData.departureDate
          ? dayjs(selectedData.departureDate)
          : null,
      });
    } else if (open) {
      form.resetFields();
    }
  }, [selectedData, form, open]);

  const onFinish = (values) => {
    const formattedValues = {
      reservationId,
      ...values,
      arrivalDate: getFormattedDate(values.arrivalDate, false),
      departureDate: getFormattedDate(values.departureDate, false),
    };

    setDrawerOpen(false);
    onSuccess();
    form.resetFields();
  };

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        size={550}
        destroyOnClose
        title={
          <div className="flex justify-between items-center">
            <span>Room Move</span>
            <Button type="primary" onClick={() => setUpdateOpen(true)}>
              Room Move
            </Button>
          </div>
        }
      >
        <Card className="rounded">
          <Form layout="vertical" form={form} onFinish={onFinish}>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item label="Arrival Date" name="arrivalDate">
                <DatePicker className="w-full" />
              </Form.Item>

              <Form.Item label="Departure Date" name="departureDate">
                <DatePicker className="w-full" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Form.Item
                label="Room Type"
                name="roomType"
                rules={[{ required: true }]}
              >
                <Select
                  value="roomType"
                  placeholder="Select Room Type"
                  style={{ width: "100%" }}
                  onChange={(value) => console.log(value)}
                  options={[
                    {
                      value: "Deluxe Bangalow Double",
                      label: "Deluxe Bangalow Double",
                    },
                    { value: "Deluxe Bangalow ", label: "Deluxe Bangalow " },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label="Room No"
                name="roomNo"
                rules={[{ required: true }]}
              >
                <Select
                  value="roomNo"
                  placeholder="Select Room No"
                  style={{ width: "100%" }}
                  onChange={(value) => console.log(value)}
                  options={[
                    { value: "DBD 1001", label: "DBD 1001" },
                    { value: "DBD 1003", label: "DBD 1003" },
                  ]}
                />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Form.Item
                label="floor Type"
                name="floorType"
                rules={[{ required: true }]}
              >
                <Select
                  value="floorType"
                  placeholder="Select Floor Type"
                  style={{ width: "100%" }}
                  onChange={(value) => console.log(value)}
                  options={[
                    { value: "Floor 1", label: "Floor 1" },
                    { value: "Floor 2", label: "Floor 2" },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label="Room Status"
                name="status"
                rules={[{ required: true }]}
              >
                <Select
                  value="roomStatus"
                  placeholder="Select Room Status"
                  style={{ width: "100%" }}
                  onChange={(value) => console.log(value)}
                  options={[
                    { value: "Cleaning", label: "Cleaning" },
                    { value: "Dirty", label: "Dirty" },
                  ]}
                />
              </Form.Item>
            </div>

            <Form.Item
              label="Reason"
              name="reason"
              rules={[{ required: true }]}
            >
              <TextArea />
            </Form.Item>
          </Form>
        </Card>
      </Drawer>
      <UpdateRoomMoveDrawer
        open={updateOpen}
        onClose={() => setUpdateOpen(false)}
      />
    </>
  );
};

export default RoomMoveDrawer;
