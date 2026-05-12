import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Tag,
  Dropdown,
  Button,
  Space,
  Pagination,
  Empty,
} from "antd";
import {
  PhoneOutlined,
  MoreOutlined,
  EditOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { FaChild } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import PriceTag from "../../../component/PriceTag/PriceTag";

const ReservationsGrid = ({
  data,
  page,
  perPage,
  total,
  changePage,
  changePerPage,
}) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "booked":
      case "confirmed":
        return "green";
      case "cancelled":
        return "red";
      case "pending":
        return "orange";
      default:
        return "blue";
    }
  };

  const handleMenuClick = (key, uuid) => {
    if (key === "edit") {
      navigate(`/reservation/booking-detail`, { state: { bookingId: uuid } });
    }
  };

  const handelCardClick = (uuid) => {
    navigate(`/reservation/booking-detail`, { state: { bookingId: uuid } });
  };

  if (!data || data.length === 0) {
    return (
      <Empty description="No Reservations Found" style={{ marginTop: 60 }} />
    );
  }

  return (
    <div>
      <Row gutter={[16, 16]}>
        {data.map((item) => (
          <Col xs={24} sm={12} lg={8} key={item.id}>
            <Card
              hoverable
              onClick={() => handelCardClick(item.uuid)}
              title={
                <span style={{ fontWeight: 600 }}>{item?.guest?.name}</span>
              }
              extra={
                <Dropdown
                  menu={{
                    items: [
                      { key: "edit", label: "Edit", icon: <EditOutlined /> },
                      {
                        key: "print",
                        label: "Print",
                        icon: <PrinterOutlined />,
                      },
                    ],

                    onClick: ({ key }) => handleMenuClick(key, item.uuid),
                  }}
                  trigger={["click"]}
                >
                  <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
              }
            >
              {/* Info Row */}
              <div style={{ marginBottom: 12 }}>
                <Space size="middle" style={{ color: "#555" }}>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <PhoneOutlined /> {item?.guest?.phone}
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <IoPeopleSharp /> {item.adults}
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <FaChild /> {item.children}
                  </span>
                </Space>
              </div>

              {/* Date Box */}
              <div
                style={{
                  display: "flex",
                  border: "1px solid #f0f0f0",
                  borderRadius: "4px",
                  textAlign: "center",
                  marginBottom: 16,
                  overflow: "hidden",
                }}
              >
                <div style={{ flex: 1, padding: "8px", background: "#fafafa" }}>
                  {item.actualCheckin}
                </div>
                <div
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderLeft: "1px solid #f0f0f0",
                    borderRight: "1px solid #f0f0f0",
                  }}
                >
                  {item.totalNight}
                </div>
                <div style={{ flex: 1, padding: "8px", background: "#fafafa" }}>
                  {item.actualCheckout}
                </div>
              </div>

              {/* Details List */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "#8c8c8c" }}>Order Id</span>
                  <span>{item.id}</span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "#8c8c8c" }}>Booking Date</span>
                  <span>{item.createdAt}</span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "#8c8c8c" }}>Rooms</span>
                  <span>{item.totalRooms}</span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "#8c8c8c", borderRadius: "5px" }}>
                    Status
                  </span>
                  <Tag color={getStatusColor(item?.reservationStatus?.name)}>
                    {item?.reservationStatus?.name}
                  </Tag>
                </div>

                <hr
                  style={{
                    border: "none",
                    borderTop: "1px solid #f0f0f0",
                    margin: "8px 0",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: "bold",
                  }}
                >
                  <span>Total</span>
                  <span
                    style={{
                      display: "flex",
                      gap: "4px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <PriceTag value={item.grandTotal} />
                    <span>MMK</span>
                  </span>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <div
        style={{
          marginTop: "24px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Pagination
          current={page}
          total={total}
          pageSize={perPage}
          onChange={(page, perPage) => {
            changePage(page);
            changePerPage(perPage);
          }}
          showSizeChanger={true}
        />
      </div>
    </div>
  );
};

export default ReservationsGrid;
