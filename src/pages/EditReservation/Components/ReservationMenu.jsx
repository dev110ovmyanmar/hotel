import React from "react";
import { Tabs } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

const ReservationMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeKey = location.pathname.split("/").pop();

  const onChange = (key) => {
    navigate(`/reservation/${key}`);
  };

  return (
    <Tabs
      activeKey={activeKey}
      onChange={onChange}
      items={[
        { label: "Booking Detail", key: "booking-detail" },
        { label: "Room Information", key: "room-information" },
        { label: "Guest Details", key: "guest-details" },
        { label: "Event Facility Order", key: "event-facility-order" },
        { label: "Room Charges", key: "room-charges" },
        { label: "Folio Operations", key: "folio-operations" },
        { label: "Service Add On", key: "service-add-on" },
      ]}
    />
  );
};

export default ReservationMenu;
