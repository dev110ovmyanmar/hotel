import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Drawer,
  Button,
  Card,
  DatePicker,
  TimePicker,
  Select,
} from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import FormButtons from "../../../../../../component/FormButtons/FormButtons";
import GetRoomForm from "./GetRoomForm";
import { FaSalesforce } from "react-icons/fa6";

const { TextArea } = Input;

const AssignRoomForm = ({
  mode,
  setMode,
  open,
  onClose,
  selectedData,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const isView = mode === "view";
  const [getRoomOpen, setGetRoomOpen] = useState(false);

  const onFinish = (values) => {
    console.log("assign room:", values.guestNotes);

    if (onSuccess) onSuccess();
  };

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        size={650}
        destroyOnClose
        title={
          <div className="flex justify-between items-center">
            <span>Assign Room</span>
          </div>
        }
      >
        <div className="border border-gray-200 rounded px-4 py-2">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            disabled={isView}
            className="w-full"
          >
            <h1 className="text-base font-semibold mb-6 text-gray-700">
              Assign Room
            </h1>

            {/* row 1 */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Form.Item label="Check-In Date" name="checkInDate">
                  <DatePicker className="w-full" />
                </Form.Item>
              </div>

              <div className="flex-1">
                <Form.Item label="Check-In Time" name="checkInTime">
                  <TimePicker className="w-full" format="HH:mm A" />
                </Form.Item>
              </div>

              <div className="flex flex-col items-center bg-gray-200 rounded px-2 py-1 mt-[6px] min-w-[55px] min-h-[32px]">
                <span className="text-[10px] font-bold leading-none">6</span>
                <span className="text-[10px] leading-none text-gray-600">
                  Nights
                </span>
              </div>

              <div className="flex-1">
                <Form.Item label="Check-Out Date" name="checkOutDate">
                  <DatePicker className="w-full" />
                </Form.Item>
              </div>

              <div className="flex-1">
                <Form.Item label="Check-Out Time" name="checkOutTime">
                  <TimePicker className="w-full" format="HH:mm A" />
                </Form.Item>
              </div>
            </div>

            {/* row 2 */}
            <div className="grid grid-cols-2 gap-6">
              <Form.Item label="Room Type" name="roomType">
                <Select
                  placeholder="Select Room Type"
                  options={[
                    { value: "Delux Double Room", label: "Delux Double Room" },
                    { value: "Standard Room", label: "Standard Room" },
                  ]}
                  className="w-full"
                />
              </Form.Item>

              <Form.Item label="Floor Type" name="floorType">
                <Select
                  placeholder="Select Floor Type"
                  options={[
                    { value: "Garden View", label: "Garden View" },
                    { value: "Sea View", label: "Sea View" },
                  ]}
                  className="w-full"
                />
              </Form.Item>
            </div>

            <div className="flex justify-end ">
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => setGetRoomOpen(true)}
              >
                Search
              </Button>
            </div>
          </Form>
        </div>
      </Drawer>
      <GetRoomForm open={getRoomOpen} onClose={() => setGetRoomOpen(false)} />
    </>
  );
};

export default AssignRoomForm;
