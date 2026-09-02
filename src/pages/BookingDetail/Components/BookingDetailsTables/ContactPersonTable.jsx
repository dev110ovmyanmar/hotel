import React, { useState } from "react";
import { Card, Row, Typography, Divider, Space, Tooltip } from "antd";
import { EditOutlined, PhoneOutlined } from "@ant-design/icons";
import ContactPersonForm from "../BookingDetailForms/ContactPersonForm";

const { Text } = Typography;

const ContactPersonCard = ({ data }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const reservation = data?.reservation;
  const reservationRoom = data?.reservationRoom;

  const editOpen = reservationRoom?.roomStatus?.code === "booked" || reservationRoom?.roomStatus?.code === "confirmed"

  const CustomTitle = (
    <div className="flex items-center justify-between w-full">
      <Space>
        <div className="contact-icon-box">
          <PhoneOutlined style={{ color: "#312f2f", fontSize: "20px" }} />
        </div>
        <Text>Contact Person</Text>
      </Space>

      {(editOpen) && (
        <Tooltip title="Edit Contact Person">
          <EditOutlined
            style={{
              color: "#1070de",
              fontSize: "20px",
              cursor: "pointer",
            }}
            onClick={() => setDrawerOpen(true)}
          />
        </Tooltip>
      )}
    </div>
  );

  return (
    <>
      <Card title={CustomTitle} className="contact-card line-height">
        <Row justify="space-between">
          <Text strong>Name</Text>
          <Text strong>Phone Number</Text>
        </Row>

        <Row justify="space-between" className="mt-3">
          <Text className="capitalize">{reservation?.guest?.fullName}</Text>
          <Text>{reservation?.guest?.phone}</Text>
        </Row>
      </Card>

      {drawerOpen && (
        <ContactPersonForm open={drawerOpen} onClose={setDrawerOpen} />
      )}
    </>
  );
};

export default ContactPersonCard;
