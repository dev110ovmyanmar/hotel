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
import PriceTag from "../../../component/PriceTag/PriceTag";

const ReservationsTable = ({
  data,
  page,
  perPage,
  total,
  loading,
  changePage,
  changePerPage,
}) => {
  const navigate = useNavigate();

  const handleMenuClick = (key, uuid) => {
    if (key === "edit") {
      navigate(`/reservation/booking-detail`, { state: { bookingId: uuid } });
    }
  };

  const columns = [
    { title: "Order Id", dataIndex: "id", key: "id" },
    { title: "Guest Name", dataIndex: ["guest", "name"], key: "guestName" },
    {
      title: "Rooms",
      dataIndex: "totalRooms",
      key: "totalRooms",
      align: "center",
    },
    { title: "Arrival Date", dataIndex: "actualCheckin", key: "actualCheckin" },
    {
      title: "Departure Date",
      dataIndex: "actualCheckout",
      key: "actualCheckout",
    },
    {
      title: "Booking Date",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Night",
      dataIndex: "totalNight",
      key: "totalNight",
    },
    {
      title: "Contact & Guests",
      key: "contact",
      render: (_, record) => (
        <div className="flex flex-col gap-1" style={{ fontSize: "12px" }}>
          <div className="flex items-center gap-1">
            <PhoneOutlined /> {record?.guest?.phone}
          </div>

          <div className="flex items-center gap-3 text-gray-500">
            <span className="flex items-center gap-1">
              <IoPeopleSharp /> {record?.adults}
            </span>
            <span className="flex items-center gap-1">
              <FaChild /> {record?.children}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Order Status",
      dataIndex: ["reservationStatus", "name"],
      key: "status",
      render: (status) => <Tag>{status}</Tag>,
    },
    {
      title: "Order Total",
      dataIndex: "grandTotal",
      key: "total",
      align: "end",
      render: (value) => <PriceTag value={value} />,
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleMenuClick("edit", record.uuid)}
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
        dataSource={data}
        pagination={{
          current: page,
          pageSize: perPage,
          total: total,
          onChange: (page, perPage) => {
            changePage(page);
            changePerPage(perPage);
          },
          showSizeChanger: true,
        }}
        loading={loading}
        bordered={false}
      />
    </div>
  );
};

export default ReservationsTable;
