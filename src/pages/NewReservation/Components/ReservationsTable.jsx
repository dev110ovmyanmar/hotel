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

  const handleMenuClick = (item) => {
    if (item?.uuid) {
      navigate(`/reservations/${item.uuid}/room-information`);
    }
  };

  const columns = [
    { title: "Id", dataIndex: "id", key: "id", width: 60 },

    {
      title: "Guest Name",
      dataIndex: ["guest", "name"],
      key: "guestName",
      width: 140,
      render: (text) => (
        <span style={{ textTransform: "capitalize" }}>{text || ""}</span>
      ),
    },
    {
      title: "Res No:",
      dataIndex: ["reservation", "reservationNo"],
      key: "reservationNo",
      align: "center",
      width: 140,
      render: (text) => <span className="text-indigo-700">{text}</span>,
    },

    {
      title: "Room No:",
      key: "roomNo",
      align: "center",
      width: 100,
      render: (_, record) => {
        const roomNo = record?.room?.roomNo;

        return roomNo ? (
          <span className="font-medium">{roomNo}</span>
        ) : (
          <span
            className="text-[#1890ff] font-medium cursor-pointer hover:text-indigo-800"
            onClick={() => handleMenuClick(record)}
          >
            Assign Room
          </span>
        );
      },
    },
    {
      title: "Room Type",
      dataIndex: ["roomType", "name"],
      key: "roomType",
      align: "center",
      width: 120,
    },

    {
      title: "Rate Plan",
      dataIndex: ["ratePlan", "name"],
      key: ["ratePlan"],
      align: "center",
      width: 110,
    },

    {
      title: "Stay Period",
      align: "center",
      width: 110,
      render: (_, record) => {
        const arrival = record.checkinDate
          ? dayjs(record.checkinDate).format("YYYY-MM-DD")
          : "-";
        const departure = record.checkoutDate
          ? dayjs(record.checkoutDate).format("YYYY-MM-DD")
          : "-";
        const totalNight = record.totalNight ?? 0;

        return (
          <div className="flex flex-col items-center justify-center text-sm gap-0.5">
            <span>{arrival}</span>
            <span className="text-xs font-light text-gray-500 my-0.5">
              ({" "}
              <span className="font-medium text-black mr-1">
                {totalNight} -{" "}
              </span>
              {totalNight === 1 ? "night" : "nights"} )
            </span>
            <span>{departure}</span>
          </div>
        );
      },
    },

    {
      title: "Contact & Guests",
      key: "contact",
      width: 110,
      render: (_, record) => (
        <div className="flex flex-col gap-1" style={{ fontSize: "12px" }}>
          <div className="flex items-center gap-1">
            <PhoneOutlined /> {record?.guest?.phone}
          </div>

          <div className="flex items-center gap-3 text-gray-500">
            <span className="flex items-center gap-1">
              <IoPeopleSharp className="text-blue-500" /> {record?.adults}
            </span>

            {record?.children && (
              <span className="flex items-center gap-1">
                <FaChild className="text-pink-500" /> {record.children}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: ["roomStatus", "name"],
      key: "status",
      align: "center",
      width: 120,
      render: (roomStatus) => <ReservationStatusColor status={roomStatus} />,
    },
    {
      title: "Total Charges",
      dataIndex: "grandTotal",
      key: "total",
      align: "end",
      width: 120,
      render: (value) => (
        <div className="flex justify-end items-center gap-1">
          <PriceTag value={value} />
          <span className="font-medium">MMK</span>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      fixed: "end",
      align: "center",
      width: 80,
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleMenuClick(record)}
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
