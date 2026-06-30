import React from "react";
import { Row, Col, Typography, Card, Space, Tag } from "antd";
import { FaChild } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import { MdOutlineMeetingRoom } from "react-icons/md";
import ReservationStatusColor from "../../../../component/ReservationStatusColor/ReservationStatusColor";

const { Text } = Typography;

const BookingStatusCard = ({ data }) => {
  const reservation = data?.reservationRoom;
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
      // extra={
      //   <ReservationStatusColor
      //     status={data?.reservation?.reservationStatus?.name}
      //   />
      // }
      >
        {/* <Row>
          <Col span={8}>
            <Text strong>Total Person</Text>
          </Col>
          <Col span={8}>
            <Text strong>Total Night</Text>
          </Col>
          <Col span={8}>
            <Text strong>Extra Bed</Text>
          </Col>
        </Row> */}

        {/* <Row>
          <Col span={8}>
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              <IoPeopleSharp className="text-blue-500" />{" "}
              <h1>{reservation?.adults}</h1>
              {reservation?.children && (
                <>
                  <FaChild className="text-pink-500" />
                  <h1>{reservation.children}</h1>
                </>
              )}
            </div>
          </Col>
          <Col span={8}>
            <Text>
              {reservation?.totalNight}{" "}
              {reservation?.totalNight === 1 ? "Night" : "Nights"}
            </Text>
          </Col>

          <Col span={8}>
            <Text>
              {reservation?.roomType?.maxExtraBed
                ? reservation.roomType.maxExtraBed
                : "-"}
            </Text>
          </Col>
        </Row> */}

        <div>
          <Text>Booking Date: </Text>
          <Text>{reservation?.updatedAt}</Text>
        </div>

        <div>
          <Text>Booking Source: </Text>
          <Text strong>{data?.reservation?.bookedVia?.name || "-"}</Text>
        </div>

        <div>
          <Text>Source Type: </Text>
          <Text strong>{data?.reservation?.sourceType?.name}</Text>
        </div>

        {
          data?.reservation?.source?.name &&
          <div>
            <Text>Source Name: </Text>
            <Text strong>{data?.reservation?.source?.name}</Text>
          </div>
        }
      </Card>
    </>
  );
};

export default BookingStatusCard;
