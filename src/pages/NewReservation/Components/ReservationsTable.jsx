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
import ReservationStatusColor from "../../../component/ReservationStatusColor/ReservationStatusColor";
import dayjs from "dayjs";

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

  const handleMenuClick = (uuid) => {
    navigate(`/reservation/booking-detail`, { state: { bookingId: uuid } });
  };

  const columns = [
    { title: "Id", dataIndex: "id", key: "id", width: 70 },
    {
      title: "Guest Name",
      dataIndex: ["guest", "name"],
      key: "guestName",
      render: (text) => (
        <span style={{textTransform: "capitalize" }}>
          {text || ""}
        </span>
      ),
    },
    {
      title: "Room",
      dataIndex: "totalRooms",
      key: "totalRooms",
      align: "center",
      width: 80,
    },
    {
      title: "Arrival",
      dataIndex: "actualCheckin",
      key: "actualCheckin",
      align: "center",
      render: (value) => (value ? dayjs(value).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Departure",
      dataIndex: "actualCheckout",
      key: "actualCheckout",
      align: "center",
      render: (value) => (value ? dayjs(value).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Booking Date",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (value) => (value ? dayjs(value).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Night",
      dataIndex: "totalNight",
      key: "totalNight",
      align: "center",
      width: 70,
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
      align: "center",
      render: (reservationStatus) => (
        <ReservationStatusColor status={reservationStatus} />
      ),
    },
    {
      title: "Order Total",
      dataIndex: "grandTotal",
      key: "total",
      align: "end",
      render: (value) => (
        <div className="flex items-center gap-1">
          <PriceTag value={value} />
          <span className="text-gray-500 font-medium ">MMK</span>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      fixed: "end",
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleMenuClick(record.uuid)}
          />
          <Button
            type="text"
            icon={<PrinterOutlined />}
            onClick={() => handleMenuClick(record.uuid)}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table
        tableLayout="fixed"
        scroll={{ x: 1000 }}
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
