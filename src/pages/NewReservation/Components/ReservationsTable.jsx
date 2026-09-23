import React, { useState } from "react";
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
import PrintReservation from "../../../component/Topbar/PrintReservation";
import usePermission from "../../../hooks/usePermission";
import { PERMISSIONS } from "../../../variables/permission";

const ReservationsTable = ({
  data,
  page,
  perPage,
  total,
  loading,
  changePage,
  changePerPage,
}) => {
  const { hasPermission } = usePermission();
  const reservation_room_list = hasPermission(PERMISSIONS.RESERVATION_ROOM_LIST);
  
  const navigate = useNavigate();
  const [printOpen, setPrintOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState();

  const handleMenuClick = (item) => {
    if (item?.uuid) {
      navigate(`/reservations/${item.uuid}/room-information`);
    }
  };

  const columns = [
    { title: "Id", dataIndex: "id", key: "id", width: 60 },

    {
      title: "Guest Name",
      dataIndex: ["contactGuest", "fullName"],
      key: "contactGuest",
      width: 120,
      render: (text, record) => {
        const title = record.guest?.title ? `${record.guest.title} ` : "";
        return (
          <span style={{ textTransform: "capitalize" }}>
            {`${title}${text || ""}`.trim()}
          </span>
        );
      },
    },
    {
      title: "Res No",
      dataIndex: ["reservation", "reservationNo"],
      key: "reservationNo",
      align: "center",
      render: (text) => <span className="text-indigo-700">{text}</span>,
    },

    {
      title: "Room No",
      key: "roomNo",
      align: "left",
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
      align: "left",
    },

    {
      title: "Rate Plan",
      dataIndex: ["ratePlan", "name"],
      key: ["ratePlan"],
      align: "left",
    },

    {
      title: "Stay Period",
      align: "center",
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
      width: 120,
      render: (_, record) => (
        <div className="flex flex-col gap-1" style={{ fontSize: "12px" }}>
          <div className="flex items-center gap-1">
            <UserOutlined style={{ fontSize: 14, color: "green" }} />{" "}
            {record?.contactGuest?.fullName}
          </div>

          <div className="flex items-center gap-3 ">
            <div className="flex items-center gap-1">
              <PhoneOutlined style={{ fontSize: 14, color: "green" }} />{" "}
              {record?.contactGuest?.phone}
            </div>
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
      title: "Total Charges (MMK)",
      dataIndex: "grandTotal",
      key: "total",
      align: "end",
      width: 120,
      render: (value) => (
        <div className="flex justify-end items-center gap-1">
          <PriceTag value={value} />
          {/* <span className="font-medium">MMK</span> */}
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      fixed: "end",
      align: "center",
      width: 80,
      onCell: () => ({ style: { cursor: reservation_room_list ? 'pointer' : 'default' } }),
      render: (_, record) => {
        const hasActions = reservation_room_list || record?.roomStatus?.code === "confirmed";
        if (!hasActions) return null;
        return (
          <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
            {reservation_room_list && (
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleMenuClick(record)}
              />
            )}
            {record?.roomStatus?.code === "confirmed" && (
              <Button
                type="text"
                icon={<PrinterOutlined />}
                onClick={() => {
                  (handleMenuClick(record.uuid),
                    setPrintOpen(true),
                    setSelectedReservation(record));
                }}
              />
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Table
        tableLayout="fixed"
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={data}
        rowKey="uuid"
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

      <PrintReservation
        open={printOpen}
        onClose={() => setPrintOpen(false)}
        data={selectedReservation}
      />
    </div>
  );
};

export default ReservationsTable;
