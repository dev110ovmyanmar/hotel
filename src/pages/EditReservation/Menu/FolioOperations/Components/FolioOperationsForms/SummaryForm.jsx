import React, { useState } from "react";
import {
  Drawer,
  Form,
  Button,
  Tag,
  Modal,
  Typography,
  Row,
  Col,
  Divider,
  Card,
} from "antd";

const { Text, Title } = Typography;

const SummaryForm = ({ open, onClose, reservationId }) => {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);

  const onFinish = (values) => {
    console.log("Change Status Data:", {
      reservationId,
      ...values,
    });
    setModalOpen(true);
    onClose();
    form.resetFields();
  };

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
        size={500}
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
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Card>

          </Card>
        </Form>
      </Drawer>

<Modal
  title={
    <Title level={5} style={{ margin: 0 }}>
      Confirm Your Order
    </Title>
  }
  open={modalOpen}
  onCancel={() => setModalOpen(false)}
  footer={[
    <Button
      key="cancel"
      onClick={() => setModalOpen(false)}
      style={{ minWidth: 90 }}
    >
      Cancel
    </Button>,
    <Button
      key="submit"
      type="primary"
      onClick={() => setModalOpen(false)}
      style={{ minWidth: 90 }}
    >
      Book Order
    </Button>,
  ]}
>
  <div style={{ padding: "16px 0" }}>
    <InfoRow label="Order Date Time" value="02/01/2026 11:05 AM" />
    <InfoRow label="Room" value="DBD - 1001" />
    <InfoRow label="Order Type" value="Room Charge" />
    <InfoRow label="Order Status" value="Pending" />

    <Divider style={{ margin: "12px 0" }} />

    <Row justify="space-between">
      <Col>
        <Text>Total</Text>
      </Col>
      <Col>
        <Text strong>44,850 MMK</Text>
      </Col>
    </Row>
  </div>
</Modal>
    </>
  );
};

export default SummaryForm;
