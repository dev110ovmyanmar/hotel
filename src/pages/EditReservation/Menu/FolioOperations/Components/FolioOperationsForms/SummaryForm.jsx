import React, { useState } from "react";
import {
  Drawer,
  Form,
  Button,
  Typography,
  Divider,
  Card,
  Input,
  Space,
  Select,
  Row,
  Col,
  Modal,
} from "antd";
import { MinusOutlined, PlusOutlined, CloseOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

const SummaryForm = ({ open, onClose, reservationId }) => {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);

  const onFinish = (values) => {
    setModalOpen(true);
    onClose();
    form.resetFields();
  };

  const orders = [
    {
      id: 1,
      items: [
        { name: "Fried Noodle", qty: 1, price: 7500 },
        { name: "Egg", qty: 2, price: 2000 },
      ],
      total: 9500,
    },
    {
      id: 2,
      items: [
        { name: "Fried Rice", qty: 1, price: 10000 },
        { name: "Egg", qty: 2, price: 2000 },
      ],
      total: 12000,
    },
    {
      id: 3,
      items: [
        { name: "Thai Milk Tea", qty: 3, price: 15000 },
        { name: "Bubble", qty: 1, price: 1500 },
      ],
      total: 16500,
    },
    {
      id: 4,
      items: [{ name: "Fried Rice", qty: 1, price: 10000 }],
      total: 10000,
    },
  ];

  const InfoRow = ({ label, value }) => (
    <Row justify="space-between" style={{ marginBottom: 12 }}>
      <Col>
        <Text type="secondary">{label}</Text>
      </Col>
      <Col>
        <Text>{value}</Text>
      </Col>
    </Row>
  );

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        size={550}
        destroyOnClose
        title={
          <div className="flex justify-between items-center">
            <span>Change Status</span>
            <Button type="primary" onClick={() => form.submit()}>
              Book Order
            </Button>
          </div>
        }
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          {/* --- 1. SCROLLABLE AREA --- */}
          <div style={{ flex: 1, overflowY: "auto", padding: "5px" }}>
            {orders.map((order) => (
              <Card
                key={order.id}
                title={`Order ${order.id}`}
                size="small"
                style={{ marginBottom: 16 }}
                headStyle={{ backgroundColor: "#fafafa" }}
              >
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{ display: "flex", gap: "8px", marginBottom: 8 }}
                  >
                    <Input value={item.name} readOnly style={{ flex: 2 }} />
                    <Space.Compact style={{ flex: 1.5 }}>
                      <Button icon={<MinusOutlined />} />
                      <Input
                        value={item.qty}
                        style={{ textAlign: "center", width: "50px" }}
                      />
                      <Button icon={<PlusOutlined />} />
                    </Space.Compact>
                    <Input
                      suffix="MMK"
                      value={item.price.toLocaleString()}
                      style={{ flex: 2, textAlign: "right" }}
                      readOnly
                    />
                  </div>
                ))}
                <div style={{ textAlign: "right", marginTop: 8 }}>
                  <Text type="secondary">
                    {order.items[0].name}: {order.total.toLocaleString()} MMK
                  </Text>
                </div>
              </Card>
            ))}
          </div>

          {/* --- 2. STABLE FOOTER --- */}
          <div
            style={{
              padding: "20px",
              borderTop: "1px solid #f0f0f0",
              backgroundColor: "#fff",
              boxShadow: "0 -4px 10px rgba(0,0,0,0.03)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <Text strong style={{ fontSize: "16px" }}>
                Sub Total:
              </Text>
              <Text strong style={{ fontSize: "16px" }}>
                40,000 MMK
              </Text>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Space>
                <Text>Select Tax</Text>
                <Select defaultValue="3%" style={{ width: 90 }}>
                  <Select.Option value="3%">3%</Select.Option>
                  <Select.Option value="5%">5%</Select.Option>
                </Select>
              </Space>
              <Text strong>1,250 MMK</Text>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Space>
                <Text>Select Service Charges</Text>
                <Select defaultValue="5%" style={{ width: 90 }}>
                  <Select.Option value="5%">5%</Select.Option>
                  <Select.Option value="10%">10%</Select.Option>
                </Select>
              </Space>
              <Text strong>2,500 MMK</Text>
            </div>

            <Divider style={{ margin: "12px 0" }} />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Title level={4} style={{ margin: 0 }}>
                Total Charges:
              </Title>
              <Title level={4} style={{ margin: 0 }}>
                44,850 MMK
              </Title>
            </div>
          </div>
        </Form>
      </Drawer>

      {/* Confirmation Modal */}
      <Modal
        title="Confirm Your Order"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        className="custom-ant-modal"
        closable={false}
        width={450}
        okText="Book Order"
        // footer={[
        //   <Button
        //     key="cancel"
        //     onClick={() => setModalOpen(false)}
        //     style={{ minWidth: 90 }}
        //   >
        //     Cancel
        //   </Button>,
        //   <Button
        //     key="submit"
        //     type="primary"
        //     onClick={() => setModalOpen(false)}
        //     style={{ minWidth: 90 }}
        //   >
        //     Book Order
        //   </Button>,
        // ]}
      >
        <div className="ml-5 mr-5 mt-5 ">
          <InfoRow label="Order Date Time" value="02/01/2026 11:05 AM" />
          <InfoRow label="Room" value="DBD - 1001" />
          <InfoRow label="Order Type" value="Room Charge" />
          <InfoRow label="Order Status" value="Pending" />

          <Divider className="ml-5 mt-5 border border-gray-400" />

          <Row justify="space-between">
            <Col>
              <Text>Total</Text>
            </Col>
            <Col>
              <Text strong>44,850 MMK</Text>
            </Col>
          </Row>
        </div>
        <Divider className="shadow" />
      </Modal>
    </>
  );
};

export default SummaryForm;
