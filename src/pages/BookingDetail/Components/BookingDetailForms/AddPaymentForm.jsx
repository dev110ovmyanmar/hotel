import React, { useState } from "react";
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
  Radio,
  Typography,
  Card,
  Upload,
} from "antd";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import dayjs from "dayjs";
import { PlusOutlined } from "@ant-design/icons";
import { FcApproval } from "react-icons/fc";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const AddPaymentForm = ({ open, onClose, reservationId }) => {
  const [form] = Form.useForm();
  const [payBy, setPayBy] = useState("Digital");

  const handleSubmit = (values) => {
    console.log("Amend Booking Data:", {
      reservationId,
      ...values,
    });

    onClose();
    form.resetFields();
  };

  const PaymentCard = ({ name, icon, value }) => (
    <Form.Item name="paymentMethod" noStyle>
      <Card
        hoverable
        style={{
          textAlign: "center",
          borderRadius: 8,
          border:
            form.getFieldValue("paymentMethod") === value
              ? "2px solid #1890ff"
              : "1px solid #d9d9d9",
          position: "relative",
        }}
        bodyStyle={{ padding: "12px" }}
      >
        <div style={{ fontSize: "24px", marginBottom: 8 }}>{icon}</div>
        <Text strong style={{ fontSize: "12px" }}>
          {name}
        </Text>
        <Radio
          value={value}
          style={{ position: "absolute", top: 5, right: 5 }}
        />
      </Card>
    </Form.Item>
  );

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size={550}
      destroyOnClose
      title={
        <div className="flex justify-between items-center">
          <span>Add Payment</span>
          <FormButtons onClick={() => form.submit()} />
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ payBy: "Digital", payDate: dayjs("2026-02-20") }}
      >
        {/* Pay By Section */}
        <Form.Item label={<strong>Pay By</strong>} name="payBy">
          <Radio.Group onChange={(e) => setPayBy(e.target.value)}>
            <Radio value="Cash">Cash</Radio>
            <Radio value="Digital">Digital</Radio>
          </Radio.Group>
        </Form.Item>

        {payBy === "Digital" && (
          <>
            <Title level={5}>Choose Payment</Title>

            {/* Mobile Banking */}
            <Text type="secondary">Mobile Banking</Text>
            <Radio.Group
              style={{ width: "100%", marginTop: 8, marginBottom: 20 }}
            >
              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <PaymentCard
                    name="KBZ Pay"
                    value="kbz_pay"
                    icon={<FcApproval />}
                  />
                </Col>
                <Col span={6}>
                  <PaymentCard
                    name="CB Pay"
                    value="cb_pay"
                    icon={<FcApproval />}
                  />
                </Col>
                <Col span={6}>
                  <PaymentCard
                    name="AYA Pay"
                    value="aya_pay"
                    icon={<FcApproval />}
                  />
                </Col>
                <Col span={6}>
                  <PaymentCard
                    name="UAB Pay"
                    value="uab_pay"
                    icon={<FcApproval />}
                  />
                </Col>
              </Row>
            </Radio.Group>

            {/* Bank Transfer */}
            <Text type="secondary">Bank Transfer</Text>
            <Radio.Group
              style={{ width: "100%", marginTop: 8, marginBottom: 24 }}
            >
              <Row gutter={[16, 16]}>
                <Col span={4.8} style={{ width: "20%" }}>
                  <PaymentCard
                    name="KBZ Bank"
                    value="kbz_bank"
                    icon={<FcApproval />}
                  />
                </Col>
                <Col span={4.8} style={{ width: "20%" }}>
                  <PaymentCard
                    name="CB Bank"
                    value="cb_bank"
                    icon={<FcApproval />}
                  />
                </Col>
                <Col span={4.8} style={{ width: "20%" }}>
                  <PaymentCard
                    name="AYA Bank"
                    value="aya_bank"
                    icon={<FcApproval />}
                  />
                </Col>
                <Col span={4.8} style={{ width: "20%" }}>
                  <PaymentCard
                    name="UAB Bank"
                    value="uab_bank"
                    icon={<FcApproval />}
                  />
                </Col>
                <Col span={4.8} style={{ width: "20%" }}>
                  <PaymentCard name="Wave" value="wave" icon={<FcApproval />} />
                </Col>
              </Row>
            </Radio.Group>
          </>
        )}

        {/* Form Fields */}
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Pay Date"
              name="payDate"
              rules={[{ required: true }]}
              required
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Payment Type"
              name="paymentType"
              rules={[{ required: true }]}
              required
            >
              <Select placeholder="Select type">
                <Option value="full">Full Payment</Option>
                <Option value="partial">Partial Payment</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Amount"
          name="amount"
          rules={[{ required: true }]}
          required
        >
          <Input placeholder="Enter amount" />
        </Form.Item>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Accepted A/C"
              name="acceptedAc"
              rules={[{ required: true }]}
              required
            >
              <Select placeholder="Select account">
                <Option value="acc1">Account 001</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true }]}
              required
            >
              <Select placeholder="Select status">
                <Option value="pending">Pending</Option>
                <Option value="completed">Completed</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Notes" name="notes">
          <TextArea rows={3} />
        </Form.Item>

        {/* Upload Section */}
        <Form.Item
          label={<strong>Payment Transfer Slips Upload</strong>}
          name="upload"
        >
          <Upload listType="picture-card">
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddPaymentForm;
