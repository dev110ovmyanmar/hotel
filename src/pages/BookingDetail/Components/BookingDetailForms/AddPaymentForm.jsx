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
import aya from "../../../../assets/images/payments/aya.png";
import ayaPay from "../../../../assets/images/payments/ayaPay.png";
import kbz from "../../../../assets/images/payments/kbz.png";
import kPay from "../../../../assets/images/payments/kPay.png";
import cb from "../../../../assets/images/payments/cb.png";
import cbPay from "../../../../assets/images/payments/cbPay.png";
import uab from "../../../../assets/images/payments/uab.png";
import uabPay from "../../../../assets/images/payments/uabPay.png";
import wave from "../../../../assets/images/payments/wave.png";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const AddPaymentForm = ({ open, onClose, reservationId }) => {
  const [form] = Form.useForm();
  const [payBy, setPayBy] = useState("Digital");

  const onFinish = (values) => {
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
        onFinish={onFinish}
        initialValues={{ payBy: "Digital" }}
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
                    icon={
                      <div className="flex justify-center items-center w-full">
                        <img
                          src={kPay}
                          alt="KPay Logo"
                          className="h-6 w-auto object-contain"
                        />
                      </div>
                    }
                  />
                </Col>
                <Col span={6}>
                  <PaymentCard
                    name="CB Pay"
                    value="cb_pay"
                    icon={
                      <div className="flex justify-center items-center w-full">
                        <img
                          src={cbPay}
                          alt="CBPay Logo"
                          className="h-6 w-auto object-contain"
                        />
                      </div>
                    }
                  />
                </Col>
                <Col span={6}>
                  <PaymentCard
                    name="AYA Pay"
                    value="aya_pay"
                    icon={
                      <div className="flex justify-center items-center w-full">
                        <img
                          src={ayaPay}
                          alt="AYAPay Logo"
                          className="h-6 w-auto object-contain"
                        />
                      </div>
                    }
                  />
                </Col>
                <Col span={6}>
                  <PaymentCard
                    name="UAB Pay"
                    value="uab_pay"
                    icon={
                      <div className="flex justify-center items-center w-full">
                        <img
                          src={uabPay}
                          alt="UABPay Logo"
                          className="h-6 w-auto object-contain"
                        />
                      </div>
                    }
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
                    icon={
                      <div className="flex justify-center items-center w-full">
                        <img
                          src={kbz}
                          alt="KBZ Bank Logo"
                          className="h-6 w-auto object-contain"
                        />
                      </div>
                    }
                  />
                </Col>
                <Col span={4.8} style={{ width: "20%" }}>
                  <PaymentCard
                    name="CB Bank"
                    value="cb_bank"
                    icon={
                      <div className="flex justify-center items-center w-full">
                        <img
                          src={cb}
                          alt="CB Bank Logo"
                          className="h-6 w-auto object-contain"
                        />
                      </div>
                    }
                  />
                </Col>

                <Col span={4.8} style={{ width: "20%" }}>
                  <PaymentCard
                    name="AYA Bank"
                    value="aya_bank"
                    icon={
                      <div className="flex justify-center items-center w-full">
                        <img
                          src={aya}
                          alt="AYA Bank Logo"
                          className="h-6 w-auto object-contain"
                        />
                      </div>
                    }
                  />
                </Col>
                <Col span={4.8} style={{ width: "20%" }}>
                  <PaymentCard
                    name="UAB Bank"
                    value="uab_bank"
                    icon={
                      <div className="flex justify-center items-center w-full">
                        <img
                          src={uab}
                          alt="UAB Bank Logo"
                          className="h-6 w-auto object-contain"
                        />
                      </div>
                    }
                  />
                </Col>
                <Col span={4.8} style={{ width: "20%" }}>
                  <PaymentCard
                    name="Wave"
                    value="wave"
                    icon={
                      <div className="flex justify-center items-center w-full">
                        <img
                          src={wave}
                          alt="Wave Bank Logo"
                          className="h-6 w-auto object-contain"
                        />
                      </div>
                    }
                  />
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
