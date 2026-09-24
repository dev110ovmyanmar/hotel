import React, { useMemo } from "react";
import { Tabs } from "antd";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import usePermission from "../../../hooks/usePermission";
import { PERMISSIONS } from "../../../variables/permission";

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
  const { hasPermission } = usePermission();
  const canViewRoomInformation = hasPermission(PERMISSIONS.RESERVATION_ROOM_LIST);
  // const canViewGuestDetails = hasPermission(PERMISSIONS.RESERVATION_EDIT);
  const canViewGuestDetails = hasPermission(PERMISSIONS.RESERVATION_LIST);
  const canViewFacilityBooking = hasPermission(PERMISSIONS.FACILITY_BOOKING_LIST);
  const canViewServiceAddOn = hasPermission(PERMISSIONS.RESERVATION_EDIT);
  const canViewServiceOrder = hasPermission(PERMISSIONS.SERVICE_ORDER_LIST);
  const canViewFoodBeverageOrder = hasPermission(PERMISSIONS.FNB_ORDER_LIST);
  const canViewFolioOperations = hasPermission(PERMISSIONS.FOLIO_LIST);
  const canViewBookingDetail = hasPermission(PERMISSIONS.RESERVATION_VIEW);
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

    return ALL_TABS.filter((tab) => {
      const permissionMap = {
        "room-information": canViewRoomInformation,
        "guest-details": canViewGuestDetails,
        "event-facility-booking": canViewFacilityBooking,
        "service-add-on": canViewServiceAddOn,
        "service-order": canViewServiceOrder,
        "food-beverage-order": canViewFoodBeverageOrder,
        "folio-operations": canViewFolioOperations,
        "booking-detail": canViewBookingDetail,
      };
      if (permissionMap[tab.key] === false) return false;
      return allowedKeys.includes(tab.key);
    });
  }, [statusCode, cancelledFromStatus, data, canViewRoomInformation, canViewGuestDetails, canViewFacilityBooking, canViewServiceAddOn, canViewServiceOrder, canViewFoodBeverageOrder, canViewFolioOperations, canViewBookingDetail]);

  return (
    <Tabs activeKey={activeKey} onChange={onChange} items={filteredTabs} />
  );
};

export default ReservationMenu;
