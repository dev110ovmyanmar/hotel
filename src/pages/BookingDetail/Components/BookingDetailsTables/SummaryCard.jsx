import React from "react";
import { Card, Row, Col, Typography, Divider } from "antd";

const { Text } = Typography;

const SummaryCard = () => {
  return (
    <Card title="Summary">
      <Row justify="space-between" style={{ marginBottom: 12 }}>
        <Text>Total Charge</Text>
        <Text strong>250,000 MMK</Text>
      </Row>

      <Row justify="space-between" style={{ marginBottom: 12 }}>
        <Text>Tax(3%)</Text>
        <Text strong>15,000 MMK</Text>
      </Row>

      <Divider style={{ margin: "12px 0" }} />

      <Row justify="space-between" style={{ marginBottom: 12 }}>
        <Text>Total Amount</Text>
        <Text strong>265,000 MMK</Text>
      </Row>

      <Row justify="space-between" style={{ marginBottom: 12 }}>
        <Text>Payment</Text>
        <Text strong>- 0 MMK</Text>
      </Row>

      <Divider style={{ margin: "12px 0" }} />

      <Row justify="space-between" style={{ marginBottom: 12 }}>
        <Text strong>Balance</Text>
        <Text strong>265,000 MMK</Text>
      </Row>

      <Divider style={{ margin: "12px 0" }} />

      <Row justify="space-between">
        <Text>Total Credit</Text>
        <Text strong>0 MMK</Text>
      </Row>
    </Card>
  );
};

export default SummaryCard;
