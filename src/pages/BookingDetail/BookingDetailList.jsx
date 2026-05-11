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
import { reservationDetails } from "../../api/reservationList";

const BookingDetailList = () => {
  const location = useLocation();
  const uuid = location.state?.bookingId;

  const { data, isLoading } = useApiQuery({
    fetchQueryName: ["reservation-details", uuid],
    fetchQueryFunction: reservationDetails,
    params: { uuid },
    options: { enabled: !!uuid },
  });

  if (isLoading) {
    return <Spin className="w-full flex justify-center my-10" />;
  }
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Age", dataIndex: "age", key: "age" },
  ];

  return (
    <div className="w-full px-6 py-2">
      <ReservationHeader />
      <ReservationMenu />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <BookingDetailButton reservationId="123212321" />
      </div>

      <Row gutter={16}>
        {/* LEFT */}
        <Col span={16}>
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <PaymentSummaryTable data={data?.data || []} />
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
        <Col span={8}>
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <SummaryCard />
            </Col>

            <Col span={24}>
              <BookingStatusCard />
            </Col>

            <Col span={24}>
              <ContactPersonCard />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default BookingDetailList;
