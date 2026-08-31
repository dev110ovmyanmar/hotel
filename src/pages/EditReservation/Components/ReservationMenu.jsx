import React, { useMemo } from "react";
import { Tabs } from "antd";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const ALL_TABS = [
  { label: "Room Information", key: "room-information" },
  { label: "Guest Details", key: "guest-details" },
  { label: "Facility Booking", key: "event-facility-booking" },
  { label: "Service Add On", key: "service-add-on" },
  { label: "Service Order", key: "service-order" },
  { label: "F&B Order", key: "food-beverage-order" },
  { label: "Folio Operations", key: "folio-operations" },
  { label: "Booking Details", key: "booking-detail" },
];

const BASIC_TABS = ["booking-detail", "room-information"];
const EXTENDED_TABS = [
  ...BASIC_TABS,
  "guest-details",
  "event-facility-booking",
  "service-order",
  "food-beverage-order",
  "folio-operations",
];

const ReservationMenu = ({ data }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId } = useParams();

  const activeKey = location.pathname.split("/").pop();

  const onChange = (key) => {
    if (bookingId) {
      navigate(`/reservations/${bookingId}/${key}`);
    }
  };

  const rawCode = data?.reservationRoom?.roomStatus?.code || "";
  const statusCode = rawCode.toLowerCase().replace("-", "_");
  const cancelledFromStatus =
    data?.reservationRoom?.cancelledFromStatus?.code || "";

  const filteredTabs = useMemo(() => {
    if (!data || !statusCode) {
      return [];
    }
    if (statusCode === "cancelled") {
      return ALL_TABS.filter((tab) =>
        (cancelledFromStatus === "confirmed"
          ? EXTENDED_TABS
          : BASIC_TABS
        ).includes(tab.key),
      );
    }

    const statusTabMapping = {
      checked_in: EXTENDED_TABS,
      pending: BASIC_TABS,
      booked: BASIC_TABS,
      confirmed: [
        ...BASIC_TABS,
        "guest-details",
        "event-facility-booking",
        "service-add-on",
      ],
      no_show: [
        ...BASIC_TABS,
        "guest-details",
        "service-order",
        "food-beverage-order",
        "folio-operations",
      ],
      checked_out: [
        ...BASIC_TABS,
        "guest-details",
        "service-order",
        "food-beverage-order",
        "folio-operations",
      ],
    };

    const allowedKeys = statusTabMapping[statusCode];

    if (!allowedKeys) return [];

    return ALL_TABS.filter((tab) => allowedKeys.includes(tab.key));
  }, [statusCode, cancelledFromStatus, data]);

  return (
    <Tabs activeKey={activeKey} onChange={onChange} items={filteredTabs} />
  );
};

export default ReservationMenu;
