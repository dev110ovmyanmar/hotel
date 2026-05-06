import React from "react";
import { Table, Tag, Space, Dropdown, Button } from "antd";
import { useNavigate } from "react-router-dom";
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

const dataSource = [
  {
    key: "1",
    orderId: "5001",
    guestName: "Liam Johnson Smith",
    rooms: 3,
    arrivalDate: "21/12/2025",
    departureDate: "22/12/2025",
    bookingDate: "10/12/2025",
    nights: 2,
    contact: { phone: "+95 9 123 456 789", adults: 1, kids: 0 },
    status: "Pending",
    total: "950,000 MMK",
  },
  {
    key: "2",
    orderId: "5002",
    guestName: "Zane Carter",
    rooms: 3,
    arrivalDate: "21/12/2025",
    departureDate: "22/12/2025",
    bookingDate: "11/12/2025",
    nights: 2,
    contact: { phone: "+95 9 123 456 789", adults: 1, kids: 0 },
    status: "Booked",
    total: "150,000 MMK",
  },
  {
    key: "3",
    orderId: "5003",
    guestName: "Zane Carter",
    rooms: 3,
    arrivalDate: "21/12/2025",
    departureDate: "22/12/2025",
    bookingDate: "11/12/2025",
    nights: 2,
    contact: { phone: "+95 9 123 456 789", adults: 1, kids: 0 },
    status: "Cancelled",
    total: "150,000 MMK",
  },
];

const CancelledTable = () => {
  const bookedData = dataSource.filter((item) => item.status === "Cancelled");

  const handleMenuClick = (key, id) => {
    if (key === "edit") {
      navigate(`/reservation/booking-detail`, { state: { bookingId: id } });
    }
  };

  const columns = [
    { title: "Order Id", dataIndex: "orderId", key: "orderId" },
    { title: "Guest Name", dataIndex: "guestName", key: "guestName" },
    { title: "Rooms", dataIndex: "rooms", key: "rooms", align: "center" },
    { title: "Arrival Date", dataIndex: "arrivalDate", key: "arrivalDate" },
    {
      title: "Departure Date",
      dataIndex: "departureDate",
      key: "departureDate",
    },
    {
      title: "Contact & Guests",
      key: "contact",
      render: (_, record) => (
        <div className="flex flex-col gap-1" style={{ fontSize: "12px" }}>
          <div className="flex items-center gap-1">
            <PhoneOutlined /> {record.contact.phone}
          </div>

          <div className="flex items-center gap-3 text-gray-500">
            <span className="flex items-center gap-1">
              <IoPeopleSharp /> {record.contact.adults}
            </span>
            <span className="flex items-center gap-1">
              <FaChild /> {record.contact.kids}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Order Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color="red" style={{ borderRadius: "4px" }}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    { title: "Order Total", dataIndex: "total", key: "total" },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleMenuClick("edit", record.orderId)}
          />
          <Button
            type="text"
            icon={<PrinterOutlined />}
            onClick={() => handleMenuClick("print", record.orderId)}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={bookedData}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          hideOnSinglePage: true,
        }}
        bordered={false}
      />
    </div>
  );
};

export default CancelledTable;
