import React from "react";
import { Tabs } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

const ReservationMenu = ({ data }) => {

  const navigate = useNavigate();
  const location = useLocation();
  const bookingId = location?.state?.bookingId;
  const activeKey = location.pathname.split("/").pop();

  const onChange = (key) => {
    navigate(`/reservation/${key}`, { state: { bookingId } });
  };

  const allTabs = [
    { label: "Booking Details", key: "booking-detail" },
    { label: "Room Information", key: "room-information" },
    { label: "Guest Details", key: "guest-details" },
    { label: "Event Facility Booking", key: "event-facility-booking" },
    { label: "Folio Operations", key: "folio-operations" },
    { label: "Service Add On", key: "service-add-on" },
  ];

  const rawCode = data?.reservation?.reservationStatus?.code || "";
  const statusCode = rawCode.toLowerCase().replace("-", "_");
  console.log(statusCode, "statusCode");

  const fullAccessStatuses = ["pending", "booked", "confirmed", "cancelled"];
  const restrictedStatuses = ["no_show", "checked_out", "checked_in"];

  const filteredTabs = allTabs.filter((tab) => {
    if (restrictedStatuses.includes(statusCode)) {
      const allowedKeys = [
        "booking-detail",
        "room-information",
        "guest-details",
        "folio-operations",
      ];
      return allowedKeys.includes(tab.key);
    }

    if (fullAccessStatuses.includes(statusCode)) {
      const allowedKeys = [
        "booking-detail",
        "room-information",
        "guest-details",
        "event-facility-booking",
        "service-add-on",
      ];
      return allowedKeys.includes(tab.key);
    }
    return true;
  });

  return (
    <Tabs activeKey={activeKey} onChange={onChange} items={filteredTabs} />
  );
};

export default ReservationMenu;
