import React from "react";
import { Row, Col, Typography, Card, Space, Tag } from "antd";
import { FaChild } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import { MdOutlineMeetingRoom } from "react-icons/md";

const { Text } = Typography;

const RoomStatusCard = ({ data }) => {
  const CustomTitle = (
    <Space>
      <div className="booking-icon-box">
        <MdOutlineMeetingRoom style={{ color: "#e761d1", fontSize: "20px" }} />
      </div>
      <Text>Booking Status</Text>
    </Space>
  );

  return (
    <>
      <Card
        title={CustomTitle}
        className="booking-status-card line-height"
        extra={
          <Tag
            style={{
              backgroundColor: "#fffbe6",
              color: "#d99408",
              border: "1px solid #ffe58f",
              borderRadius: "4px",
            }}
          >
            {data?.reservationStatus?.name}
          </Tag>
        }
      >
        <Row>
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

        <Row>
          <Col span={8}>
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              <IoPeopleSharp /> <h1>{data?.adults}</h1>
              <FaChild /> <h1>{data?.children}</h1>
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

        <div>
          <Text>Booking Source: </Text>
          <Text strong>Company</Text>
        </div>

        <div>
          <Text>Source Type: </Text>
          <Text strong>Company</Text>
        </div>
      </Card>
    </>
  );
};

export default RoomStatusCard;
