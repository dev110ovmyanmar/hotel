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
    guestName: "Liam Johnson Smith",
    rooms: 3,
    arrivalDate: "21/12/2025",
    departureDate: "22/12/2025",
    bookingDate: "10/12/2025",
    nights: 2,
    contact: { phone: "+95 9 123 456 789", adults: 1, kids: 0 },
    status: "Check-in",
    total: "950,000 MMK",
  },
  {
    key: "4",
    orderId: "5004",
    guestName: "Zane Carter",
    rooms: 3,
    arrivalDate: "21/12/2025",
    departureDate: "22/12/2025",
    bookingDate: "11/12/2025",
    nights: 2,
    contact: { phone: "+95 9 123 456 789", adults: 1, kids: 0 },
    status: "Check-out",
    total: "150,000 MMK",
  },
];

const DeparturesTable = () => {
  const navigate = useNavigate();

  const bookedData = dataSource.filter(
    (item) => item.status === "Check-in" || item.status === "Check-out",
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
        <div style={{ fontSize: "12px" }}>
          <div>
            <PhoneOutlined /> {record.contact.phone}
          </div>
          <Space size="middle">
            <span>
              <UserOutlined /> {record.contact.adults}
            </span>
            <span>
              <TeamOutlined /> {record.contact.kids}
            </span>
          </Space>
        </div>
      ),
    },
    {
      title: "Order Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status]} style={{ borderRadius: "4px" }}>
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
        <Dropdown
          menu={{
            items: [
              { key: "edit", label: "Edit", icon: <EditOutlined /> },
              { key: "print", label: "Print", icon: <PrinterOutlined /> },
            ],
            onClick: ({ key }) => handleMenuClick(key, record.orderId),
          }}
          trigger={["click"]}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
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

export default DeparturesTable;
