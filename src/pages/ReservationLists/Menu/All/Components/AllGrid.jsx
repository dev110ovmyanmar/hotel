import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Tag, Dropdown, Button, Space, Pagination } from "antd";
import {
  PhoneOutlined,
  UserOutlined,
  TeamOutlined,
  MoreOutlined,
  EditOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { FaChild } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";

const bookingData = [
  {
    id: 5001,
    name: "Liam Johnson Smith",
    phone: "+959 123-4567-890",
    adults: 1,
    kids: 0,
    checkIn: "21/12/2025",
    checkOut: "22/12/2025",
    duration: "1 Night",
    bookingDate: "10/12/2025",
    rooms: 3,
    status: "Pending",
    total: "950,000 MMK",
  },
  {
    id: 5002,
    name: "Zane Carter",
    phone: "+959 123-4567-890",
    adults: 2,
    kids: 2,
    checkIn: "21/12/2025",
    checkOut: "22/12/2025",
    duration: "1 Night",
    bookingDate: "11/12/2025",
    rooms: 1,
    status: "Booked",
    total: "150,000 MMK",
  },
  {
    id: 5003,
    name: "Evelyn Carter",
    phone: "+959 123-4567-890",
    adults: 2,
    kids: 0,
    checkIn: "21/12/2025",
    checkOut: "22/12/2025",
    duration: "1 Night",
    bookingDate: "12/12/2025",
    rooms: 2,
    status: "Cancelled",
    total: "200,000 MMK",
  },
  {
    id: 5004,
    name: "Sophia Martinez",
    phone: "+959 123-4567-890",
    adults: 2,
    kids: 2,
    checkIn: "21/12/2025",
    checkOut: "22/12/2025",
    duration: "1 Night",
    bookingDate: "13/12/2025",
    rooms: 1,
    status: "Cancelled",
    total: "150,000 MMK",
  },
  {
    id: 5005,
    name: "Oliver Brown",
    phone: "+959 123-4567-890",
    adults: 2,
    kids: 2,
    checkIn: "21/12/2025",
    checkOut: "22/12/2025",
    duration: "1 Night",
    bookingDate: "14/12/2025",
    rooms: 2,
    status: "Confirmed",
    total: "300,000 MMK",
  },
  {
    id: 5006,
    name: "Mia Wilson",
    phone: "+959 123-4567-890",
    adults: 2,
    kids: 0,
    checkIn: "21/12/2025",
    checkOut: "22/12/2025",
    duration: "1 Night",
    bookingDate: "15/12/2025",
    rooms: 2,
    status: "Pending",
    total: "400,000 MMK",
  },
];

const CancelledGrid = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const navigate = useNavigate();

  const filteredData = bookingData.filter((item) => item.status);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleMenuClick = (key, id) => {
    if (key === "edit") {
      navigate(`/reservation/booking-detail`, { state: { bookingId: id } });
    }
  };

  const statusColors = {
    "Check-in": "cyan",
    "Check-out": "#8B4513",
    Booked: "blue",
    Pending: "gold",
    Cancelled: "red",
    Confirmed: "green",
  };
  return (
    <div>
      <Row gutter={[16, 16]}>
        {paginatedData.map((item) => (
          <Col xs={24} sm={12} lg={8} key={item.id}>
            <Card
              title={item.name}
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
                    onClick: ({ key }) => handleMenuClick(key, item.id),
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
                    <PhoneOutlined /> {item.phone}
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
                    <FaChild /> {item.kids}
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
                }}
              >
                <div style={{ flex: 1, padding: "8px", background: "#fafafa" }}>
                  {item.checkIn}
                </div>
                <div
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderLeft: "1px solid #f0f0f0",
                    borderRight: "1px solid #f0f0f0",
                  }}
                >
                  {item.duration}
                </div>
                <div style={{ flex: 1, padding: "8px", background: "#fafafa" }}>
                  {item.checkOut}
                </div>
              </div>

              {/* Details */}
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
                  <span>{item.bookingDate}</span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "#8c8c8c" }}>Number of Room</span>
                  <span>{item.rooms}</span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "#8c8c8c" }}>Order Status</span>
                  <Tag color={statusColors[item.status]}>{item.status}</Tag>
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
                  <span>{item.total}</span>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination length */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Pagination
          current={currentPage}
          total={filteredData.length}
          pageSize={pageSize}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
          hideOnSinglePage={true}
        />
      </div>
    </div>
  );
};

export default CancelledGrid;
