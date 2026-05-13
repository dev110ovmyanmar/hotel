import React, { useEffect, useState } from "react";
import { Form, Input, Drawer, Button, DatePicker, Select, Divider } from "antd";
import dayjs from "dayjs";
import GetRoomForm from "./GetRoomForm";

const { RangePicker } = DatePicker;

const AssignRoomForm = ({ mode, open, onClose, selectedData, onSuccess }) => {
  const [form] = Form.useForm();
  const isView = mode === "view";
  const [showRoomResults, setShowRoomResults] = useState(false);

  const dates = Form.useWatch("dates", form);

  const calculateNights = () => {
    if (dates && dates[0] && dates[1]) {
      const diff = dayjs(dates[1]).diff(dayjs(dates[0]), "day");
      return diff > 0 ? diff : 0;
    }
    return 0;
  };

  useEffect(() => {
    if (open && selectedData) {
      form.setFieldsValue({
        ...selectedData,
        dates: [
          selectedData.arrivalDate ? dayjs(selectedData.arrivalDate) : null,
          selectedData.departureDate ? dayjs(selectedData.departureDate) : null,
        ],
      });
      setShowRoomResults(false);
    }
  }, [selectedData, open, form]);

  const handleSelectRoom = (roomNo) => {
    const values = form.getFieldsValue();
    const formattedValues = {
      ...values,
      arrivalDate: values.dates?.[0]?.toISOString(),
      departureDate: values.dates?.[1]?.toISOString(),
      newRoom: roomNo,
    };

    const existingData = JSON.parse(localStorage.getItem("roomInfo")) || [];
    const updated = existingData.map((item) =>
      item.id === selectedData.id ? { ...item, ...formattedValues } : item,
    );

    localStorage.setItem("roomInfo", JSON.stringify(updated));
    setShowRoomResults(false);
    if (onSuccess) onSuccess();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size={650}
      title="Assign Room"
      destroyOnClose
    >
      <div className="flex flex-col gap-6">
        <div className="border border-gray-200 rounded px-4 py-2">
          <Form form={form} layout="vertical" disabled={isView}>
            <h1 className="text-base font-semibold mb-6 text-gray-700">
              Assign Room
            </h1>

            <Form.Item label="Stay Duration (Check-in - Check-out)">
              <div className="flex items-center gap-3">
                <Form.Item name="dates" noStyle>
                  <RangePicker className="flex-1" format="DD/MM/YYYY" />
                </Form.Item>

                <div className="flex flex-col items-center justify-center bg-gray-200 rounded px-3 h-[32px] min-w-[65px] border border-gray-300">
                  <span className="text-[12px] font-bold leading-none">
                    {calculateNights()}{" "}
                    <span className="text-[10px] text-gray-600 font-normal">
                      {calculateNights() === 1 ? "Night" : "Nights"}
                    </span>
                  </span>
                </div>
              </div>
            </Form.Item>

            <div className="grid grid-cols-2 gap-6">
              <Form.Item label="Room Type" name="roomType">
                <Input disabled />
              </Form.Item>

              <Form.Item label="Floor Type" name="floorType">
                <Select
                  placeholder="Select Floor Type"
                  options={[
                    { value: "Garden View", label: "Garden View" },
                    { value: "Sea View", label: "Sea View" },
                  ]}
                />
              </Form.Item>
            </div>

            <div className="flex justify-end mt-4">
              <Button type="primary" onClick={() => setShowRoomResults(true)}>
                Search
              </Button>
            </div>
          </Form>
        </div>

        {showRoomResults && (
          <div className="mt-4">
            <Divider orientation="left">Available Rooms</Divider>
            <GetRoomForm onSelectRoom={handleSelectRoom} />
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default AssignRoomForm;
