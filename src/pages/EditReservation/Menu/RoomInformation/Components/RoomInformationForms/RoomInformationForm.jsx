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
import dayjs from "dayjs";
import FormButtons from "../../../../../../component/FormButtons/FormButtons";
import { getFormattedDate } from "../../../../../../utils";

const RoomInformationForm = ({
  data,
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
    if (data) {
      form.setFieldsValue({
        ...data,
      });
    }
  }, [data]);

  const onFinish = (values) => {
    const formattedValues = {
      ...values,
      arrivalDate: getFormattedDate(values.actualCheckin, false),
      departureDate: getFormattedDate(values.actualCheckout, false),
    };
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
          <Form.Item label="Arrival Date" name="actualCheckin">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Departure Date" name="actualCheckout">
            <Input disabled />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Form.Item label="Room" name="room">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Floor" name="floor" rules={[{ required: true }]}>
            <Select
              placeholder="Selected New Room"
              options={[
                { value: "DBD", label: "DBD 1001" },
                { value: "DB", label: "DB 1001" },
                { value: "Assign Room", label: "Assign Room" },
              ]}
            />
          </Form.Item>
        </div>
      </Form>
    </Drawer>
  );
};

export default RoomInformationForm;
