import React, { useState } from "react";
import { Card, Row, Typography, Space, Tooltip } from "antd";
import { EditOutlined, PhoneOutlined } from "@ant-design/icons";
import ContactPersonForm from "../BookingDetailForms/ContactPersonForm";
import usePermission from "../../../../hooks/usePermission";
import { PERMISSIONS } from "../../../../variables/permission";

const { Text } = Typography;

const ContactPersonCard = ({ data }) => {
  const { hasPermission } = usePermission();
  const canEditContactPerson = hasPermission(PERMISSIONS.RESERVATION_EDIT);

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

      {(editOpen && canEditContactPerson) && (
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
        <ContactPersonForm open={drawerOpen} onClose={setDrawerOpen} data={data}/>
      )}
    </>
  );
};

export default ContactPersonCard;
