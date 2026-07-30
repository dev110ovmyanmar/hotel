import React from "react";
import { Row, Col, Table, Card, Tag, Spin } from "antd";
import ReservationHeader from "../EditReservation/Components/ReservationHeader";
import ReservationMenu from "../EditReservation/Components/ReservationMenu";
import ReservationListHeader from "../../component/ReservationHeader/ReservationListHeader";
import PaymentSummaryTable from "./Components/BookingDetailsTables/PaymentSummaryTable";
import EventFacility from "./Components/BookingDetailsTables/EventFacility";
import ServiceAddOn from "./Components/BookingDetailsTables/ServiceAddOn";
import FoodBeverageOrder from "./Components/BookingDetailsTables/FoodBeverageOrder";
import SummaryCard from "./Components/BookingDetailsTables/SummaryCard";
import RoomStatusTable from "./Components/BookingDetailsTables/RoomStatusTable";
import BookingDetailButton from "./Components/BookingDetailButton/BookingDetailButton";
import BookingStatusCard from "./Components/BookingDetailsTables/BookingStatusCard";
import ContactPersonCard from "./Components/BookingDetailsTables/ContactPersonTable";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import useApiQuery from "../../hooks/useApiQuery";
import { folioPaymentList, reservationDetails } from "../../api/reservationSectionApi";
import Loader from "../../component/Loader/Loader";
import ServiceOrder from "./Components/BookingDetailsTables/ServiceOrder";
import { useEffect } from "react";
import FolioSummaryCard from "./Components/BookingDetailsTables/FolioSummaryCard";

const BookingDetailList = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const uuid = bookingId; // assigned directly to your uuid variable

  // ROUTING GUARD: Kick out unassigned, empty, or partial/mangled IDs instantly
  useEffect(() => {
    const cleanId = bookingId ? bookingId.trim() : "";

    if (
      !cleanId ||
      cleanId === "" ||
      cleanId === ":bookingId" ||
      cleanId.length < 32
    ) {
      navigate('/404', { replace: true });
    }
  }, [bookingId, navigate]);

  const { data, isLoading } = useApiQuery({
    fetchQueryName: "reservation-details",
    fetchQueryFunction: reservationDetails,
    params: { reservationRoom: { uuid: uuid } },
    options: { enabled: !!uuid },
  });

  useEffect(() => {
    if (bookingId && data?.reservation?.reservationNo) {
      sessionStorage.setItem(`breadcrumb_${bookingId}`, data.reservation.reservationNo);
      window.dispatchEvent(new Event("breadcrumb_updated"));
    }
  }, [data, bookingId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <Loader />
      </div>
    );
  }

  const reservationBooked = data?.reservationRoom?.roomStatus?.code === "booked";

  const reservationCheckIn = data?.reservationRoom?.roomStatus?.code === "checked_in";
  const reservationCheckOut = data?.reservationRoom?.roomStatus?.code === "checked_out";


  return (
    <div className="w-full px-6 py-2">
      <ReservationHeader data={data || {}} />

      <ReservationMenu data={data || {}} />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <BookingDetailButton data={data || {}}
        />
      </div>

      <Row gutter={[16, 16]}>
        {/* LEFT */}
        <Col xs={24} lg={16}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <PaymentSummaryTable data={data?.reservation?.folioPayments} />
            </Col>
            <Col span={24}>
              <RoomStatusTable data={data?.reservation?.reservationRooms} />
            </Col>
            <Col span={24}>
              <ServiceAddOn data={data?.reservation?.reservationAddOns} />
            </Col>
            <Col span={24}>
              <ServiceOrder data={data?.reservation?.serviceOrders} serviceOrderStatus={reservationCheckIn || reservationCheckOut}/>
            </Col>
            <Col span={24}>
              <EventFacility data={data?.reservation?.facilityBookings} />
            </Col>
          </Row>
        </Col>

        {/* RIGHT */}
        <Col xs={24} lg={8}>
          <Row gutter={[16, 16]}>
            {
              !reservationBooked &&
              (
                <>
                  <Col span={24}>
                    <FolioSummaryCard data={data?.reservation || {}} />
                  </Col>
                  <Col span={24}>
                    <SummaryCard data={data?.reservation || {}} />
                  </Col>
                </>
              )
            }
            <Col span={24}>
              <BookingStatusCard data={data || {}} />
            </Col>
            <Col span={24}>
              <ContactPersonCard data={data || {}} />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default BookingDetailList;
