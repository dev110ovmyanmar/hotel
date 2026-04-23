import React from "react";
import { Row, Col, Typography } from "antd";

const { Text } = Typography;

const EventFacility = () => {
  return (
    <>
      {/* Header Row */}
      <Row style={{ marginBottom: 8 }}>
        <Col span={8}>
          <Text strong>Date</Text>
        </Col>
        <Col span={8}>
          <Text strong>Start - End Time</Text>
        </Col>
        <Col span={8}>
          <Text strong>Event Name</Text>
        </Col>
      </Row>

      {/* Data Row */}
      <Row>
        <Col span={8}>
          <Text>12/11/2026</Text>
        </Col>
        <Col span={8}>
          <Text>4:00 PM - 6:00 PM</Text>
        </Col>
        <Col span={8}>
          <Text>Wedding</Text>
        </Col>
      </Row>
    </>
  );
};

export default EventFacility;
