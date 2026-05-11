import React from "react";
import { Row, Col, Typography, Card, Space } from "antd";
import { IoCalendarClearOutline } from "react-icons/io5";

const { Text } = Typography;

const EventFacility = () => {
  const CustomTitle = (
    <Space>
      <div className="event-icon-box">
        <IoCalendarClearOutline style={{ color: "#6923c5", fontSize: "18px" }} />
      </div>
      <Text>Event Facility</Text>
    </Space>
  );
  return (
    <>
      <Card title={CustomTitle} className="event-card line-height">
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
      </Card>
    </>
  );
};

export default EventFacility;
