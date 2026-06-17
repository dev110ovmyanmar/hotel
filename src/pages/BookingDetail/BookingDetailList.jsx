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
import { useLocation } from "react-router-dom";
import useApiQuery from "../../hooks/useApiQuery";
import { folioPaymentList, reservationDetails } from "../../api/reservationSectionApi";
import Loader from "../../component/Loader/Loader";

const BookingDetailList = () => {
  const location = useLocation();
  const uuid = location.state?.bookingId;

  const { data, isLoading } = useApiQuery({
    fetchQueryName: "reservation-details",
    fetchQueryFunction: reservationDetails,
    params: { reservationRoom: { uuid: uuid } },
    options: { enabled: !!uuid },
  });

  const { data: folioPaymentListing } = useApiQuery({
    fetchQueryName: "folio-payments",
    fetchQueryFunction: folioPaymentList,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <Loader />
      </div>
    );
  }

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
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <PaymentSummaryTable data={folioPaymentListing || []} />
            </Col>
            <Col span={24}>
              <RoomStatusTable />
            </Col>
            <Col span={24}>
              <EventFacility />
            </Col>
            <Col span={24}>
              <ServiceAddOn />
            </Col>
            <Col span={24}>
              <FoodBeverageOrder />
            </Col>
          </Row>
        </Col>

        {/* RIGHT */}
        <Col xs={24} lg={8}>
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <SummaryCard data={data || {}} />
            </Col>
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
