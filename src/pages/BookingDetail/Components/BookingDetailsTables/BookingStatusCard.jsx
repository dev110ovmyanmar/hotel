import React from "react";
import { Row, Col, Typography } from "antd";
import { FaChild } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";

const { Text } = Typography;

const RoomStatusCard = () => {
  return (
    <>
      {/* Header Row */}
      <Row style={{ marginBottom: 8 }}>
        <Col span={8}>
          <Text strong>Total Person</Text>
        </Col>
        <Col span={8}>
          <Text strong>Total Night</Text>
        </Col>
        <Col span={8}>
          <Text strong>Extra Bed</Text>
        </Col>
      </Row>

      {/* Data Row */}
      <Row>
        <Col span={8}>
          <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            <IoPeopleSharp /> <h1>1</h1>
            <FaChild /> <h1>1</h1>
          </div>
        </Col>
        <Col span={8}>
          <Text>2 Night</Text>
        </Col>
        <Col span={8}>
          <Text>1 Bed</Text>
        </Col>
      </Row>

      <div className="mt-5">
        <Text>Booking Date: </Text>
        <Text>10/11/2026 12:00 AM</Text>
      </div>

      <div className="mt-5">
        <Text>Booking Source: </Text>
        <Text strong>Company</Text>
      </div>

      <div className="mt-5">
        <Text>Source Type: </Text>
        <Text strong>Company</Text>
      </div>
    </>
  );
};

export default RoomStatusCard;
