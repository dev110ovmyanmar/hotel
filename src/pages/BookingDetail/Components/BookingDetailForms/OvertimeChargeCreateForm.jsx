import React from "react";
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
  Typography,
  Tag,
  Radio,
} from "antd";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import FormItem from "antd/es/form/FormItem";
import TextArea from "antd/es/input/TextArea";
import { darkModeStyle } from "../../../../utils";

const { Text } = Typography;

const OvertimeChargeCreateForm = ({ open, onClose, reservationId }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Overtime Create Data:", {
      reservationId,
      ...values,
    });

    onClose();
    form.resetFields();
  };

  return (
    <Drawer
      title="Overtime Charge"
      open={open}
      onClose={onClose}
      size={450}
      destroyOnClose
      extra={<Button type="primary">Create</Button>}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item>
          <Radio.Group>
            <div className="mb-2">
              <Radio value="checked_in">Early Check-In</Radio>
            </div>
            <div>
              <Radio value="cancelled">Late Check-Out</Radio>
            </div>
          </Radio.Group>
        </Form.Item>

        <FormItem label="Reason" name="reason">
          <Input className="no-radius-input" />
        </FormItem>

        <FormItem label="Amount" name="amount">
          <InputNumber
            min={0}
            suffix="MMK"
            className="no-radius-input"
            style={{ width: "100%" }}
          />
        </FormItem>

        <FormItem label="Description" name="description">
          <TextArea className={`no-radius-input ${darkModeStyle}`} />
        </FormItem>
      </Form>
    </Drawer>
  );
};

export default OvertimeChargeCreateForm;
