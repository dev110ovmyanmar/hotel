import React from "react";
import { Row, Col, Table, Card, Tag } from "antd";
import ReservationHeader from "../EditReservation/Components/ReservationHeader";
import ReservationMenu from "../EditReservation/Components/ReservationMenu";
import ReservationListHeader from "../../component/ReservationHeader/ReservationListHeader";
import PaymentSummaryTable from "./Components/BookingDetailsTables/PaymentSummaryTable";
import EventFacility from "./Components/BookingDetailsTables/EventFacility";
import ServiceAddOn from "./Components/BookingDetailsTables/ServiceAddOn";
import FoodBeverageOrder from "./Components/BookingDetailsTables/FoodBeverageOrder";
import SummaryCard from "./Components/BookingDetailsTables/SummaryCard";
import ContactPersonTable from "./Components/BookingDetailsTables/ContactPersonTable";
import RoomStatusTable from "./Components/BookingDetailsTables/RoomStatusTable";
import BookingDetailButton from "./Components/BookingDetailButton/BookingDetailButton";
import BookingStatusCard from "./Components/BookingDetailsTables/BookingStatusCard";

const BookingDetailList = () => {
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Age", dataIndex: "age", key: "age" },
  ];

  const data = [
    { key: "1", name: "John", age: 30 },
    { key: "2", name: "Jane", age: 25 },
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
              <Card title="Payment Summary">
                {/* <Table columns={columns} dataSource={data} pagination={false} /> */}
                <PaymentSummaryTable />
              </Card>
            </Col>

            <Col span={24}>
              <Card
                title="Room Status"
                extra={<Tag color="blue">Reserved - 2 Rooms</Tag>}
              >
                <RoomStatusTable />
              </Card>
            </Col>

            <Col span={24}>
              <Card title="Event Facility">
                <EventFacility />
              </Card>
            </Col>
            <Col span={24}>
              <Card title="Service Add On">
                <ServiceAddOn />
              </Card>
            </Col>

            <Col span={24}>
              <Card title="Food Beverage Order">
                <FoodBeverageOrder />
              </Card>
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
              <Card
                title="Booking Status"
                extra={<Tag color="warning">Pending</Tag>}
              >
                <BookingStatusCard />
              </Card>
            </Col>

            <Col span={24}>
              <Card title="Contact Person">
                <ContactPersonTable />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={8}></Col>
      </Row>
    </div>
  );
};

export default BookingDetailList;
