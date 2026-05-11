import React from "react";
import { Row, Col, Typography, Space, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Text } = Typography;

const ServiceAddOn = () => {
  const CustomTitle = (
    <Space>
      <div className="service-icon-box">
        <PlusOutlined style={{ color: "#28e1c8", fontSize: "18px" }} />
      </div>
      <Text>Service Add On</Text>
    </Space>
  );

  return (
    <>
      <Card title={CustomTitle} className="service-card line-height">
        {/* Header Row */}
        <Row style={{ marginBottom: 8 }}>
          <Col span={6}>
            <Text strong>Service Name</Text>
          </Col>
          <Col span={7}>
            <Text strong>Start - End Time</Text>
          </Col>
          <Col span={5}>
            <Text strong>Qty Unit</Text>
          </Col>
          <Col span={6}>
            <Text strong>Room</Text>
          </Col>
        </Row>

        {/* Data Row */}
        <Row>
          <Col span={6}>
            <Text>12/11/2026</Text>
          </Col>
          <Col span={7}>
            <Text>4:00 PM - 6:00 PM</Text>
          </Col>
          <Col span={5}>
            <Text>4:00 PM</Text>
          </Col>
          <Col span={6}>
            <Text>DBD - 1001</Text>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default ServiceAddOn;
