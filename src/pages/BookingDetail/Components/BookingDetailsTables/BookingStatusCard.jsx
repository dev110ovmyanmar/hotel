import React, { useState } from "react";
import { Typography, Card, Space, Tag, Button, Tooltip, Form } from "antd";
import { MdOutlineMeetingRoom } from "react-icons/md";
import { EditOutlined } from "@ant-design/icons";
import ReservationDetailsForm from "../BookingDetailForms/ReservationDetailsForm";

const { Text } = Typography;

const BookingStatusCard = ({ data }) => {
  const reservationRoom = data?.reservationRoom;

  const editOpen =
    reservationRoom?.roomStatus?.code === "booked" ||
    reservationRoom?.roomStatus?.code === "confirmed";

  const [drawerOpen, setDrawerOpen] = useState(false);

  const CustomTitle = (
    <div className="flex items-center justify-between w-full">
      <Space>
        <div className="booking-icon-box">
          <MdOutlineMeetingRoom
            style={{ color: "#e761d1", fontSize: "20px" }}
          />
        </div>

        <Text>Reservation Details</Text>
      </Space>

      {editOpen && (
        <Tooltip title="Edit Reservation">
          <EditOutlined
            style={{ color: "#1070de", fontSize: "20px", cursor: "pointer" }}
            onClick={() => setDrawerOpen(true)}
          />
        </Tooltip>
      )}
    </div>
  );

  return (
    <>
      <Card title={CustomTitle} className="booking-status-card line-height">
        <div>
          <Text>Ref No:</Text>
          <Text strong> {data?.reservation?.refNo || " -"}</Text>
        </div>

        <div>
          <Text>Booking Source: </Text>
          <Text strong>{data?.reservation?.bookedVia?.name || "-"}</Text>
        </div>

        <div>
          <Text>Source Type: </Text>
          <Text strong>{data?.reservation?.sourceType?.name}</Text>
        </div>

        {data?.reservation?.source?.name && (
          <div>
            <Text>Source Name: </Text>
            <Text strong>{data?.reservation?.source?.name}</Text>
          </div>
        )}
      </Card>

      {drawerOpen && (
        <ReservationDetailsForm open={drawerOpen} onClose={setDrawerOpen} />
      )}
    </>
  );
};

export default BookingStatusCard;
