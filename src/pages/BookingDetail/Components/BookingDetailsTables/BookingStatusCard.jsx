import React from "react";
import { Row, Col, Typography, Card, Space, Tag } from "antd";
import { FaChild } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import { MdOutlineMeetingRoom } from "react-icons/md";
import ReservationStatusColor from "../../../../component/ReservationStatusColor/ReservationStatusColor";

const { Text } = Typography;

const RoomStatusCard = ({ data }) => {
  const reservation = data?.reservation;
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
          <ReservationStatusColor
            status={reservation?.reservationStatus?.name}
          />
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
              <IoPeopleSharp className="text-blue-500"/> <h1>{reservation?.adults}</h1>
              <FaChild className="text-pink-500"/> <h1>{reservation?.children}</h1>
            </div>
          </Col>
          <Col span={8}>
            <Text>{reservation?.totalNight}</Text>
          </Col>
          <Col span={8}>
            <Text>{reservation?.totalRooms}</Text>
          </Col>
        </Row>

        <div className="mt-5">
          <Text>Booking Date: </Text>
          <Text>10/11/2026 12:00 AM</Text>
        </div>

        <div>
          <Text>Booking Source: </Text>
          <Text strong>{reservation?.source?.name || "-"}</Text>
        </div>

        <div>
          <Text>Source Type: </Text>
          <Text strong>{reservation?.sourceType?.name}</Text>
        </div>
      </Card>
    </>
  );
};

export default RoomStatusCard;
