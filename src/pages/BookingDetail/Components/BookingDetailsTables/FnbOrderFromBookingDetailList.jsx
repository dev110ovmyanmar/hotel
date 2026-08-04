import React from "react";
import { Card, Row, Col, Typography, Tag, Space } from "antd";
import { MdOutlineMeetingRoom } from "react-icons/md";
import { IoRestaurantOutline } from "react-icons/io5";

const { Text } = Typography;

const FnbOrderFromBookingDetailList = () => {
  const getStatusTag = (status) => {
    const colors = {
      pending: "warning",
      confirm: "processing",
      completed: "success",
      cancelled: "error",
      delivered: "cyan",
    };

    return (
      <Tag
        color={colors[status.toLowerCase()] || "default"}
        className="rounded-full px-3"
      >
        {status}
      </Tag>
    );
  };

  const CustomTitle = (
    <Space>
      <div className="food-icon-box">
        <IoRestaurantOutline style={{ color: "#d56333", fontSize: "18px" }} />
      </div>
      <Text>Food Beverage Order</Text>
    </Space>
  );

  return (
    <>
      <Card title={CustomTitle} className="food-card line-height">
        <Row style={{ marginBottom: 8 }}>
          <Col span={5}>
            <Text strong>Order Date</Text>
          </Col>
          <Col span={4}>
            <Text strong>Order Time</Text>
          </Col>
          <Col span={5}>
            <Text strong>Room</Text>
          </Col>
          <Col span={5}>
            <Text strong>Order Type</Text>
          </Col>
          <Col span={5}>
            <Text strong>Order Status</Text>
          </Col>
        </Row>

        <Row>
          <Col span={5}>
            <Text>12/11/2026</Text>
          </Col>
          <Col span={4}>
            <Text>11:05 AM</Text>
          </Col>
          <Col span={5}>
            <Text>DBD - 1001</Text>
          </Col>
          <Col span={5}>
            <Text>Room Charge</Text>
          </Col>
          <Col span={5}>{getStatusTag("Pending")}</Col>
        </Row>
      </Card>
    </>
  );
};

export default FnbOrderFromBookingDetailList;