import { Dropdown, Space, Table, Button, Tooltip } from "antd";
import { useState, useEffect } from "react";
import {
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  PlusOutlined,
  InboxOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import EventFacilityOrderForm from "./EventFacilityOrderForms/EventFacilityOrderForm";
import dayjs from "dayjs";

const EventFacilityOrderTable = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setDataSource(savedEvents);
  }, []);

  const refreshData = () => {
    const savedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setDataSource(savedEvents);
  };

  const columns = [
    { title: "Order ID", dataIndex: "id", key: "id" },
    { title: "Event Name", dataIndex: "name", key: "name" },
    {
      title: "Start Date Time",
      key: "startDateTime",
      render: (_, record) => {
        const date = record.startDate
          ? dayjs(record.startDate).format("DD/MM/YYYY")
          : "-";
        const time = record.startTime
          ? dayjs(record.startTime).format("h:mm A")
          : "";
        return (
          <div>
            <div className="font-medium">{date}</div>
            <div className="text-xs text-gray-500">{time}</div>
          </div>
        );
      },
    },
    {
      title: "End Date Time",
      key: "endDateTime",
      render: (_, record) => {
        const date = record.endDate
          ? dayjs(record.endDate).format("DD/MM/YYYY")
          : "-";
        const time = record.endTime
          ? dayjs(record.endTime).format("h:mm A")
          : "";
        return (
          <div>
            <div className="font-medium">{date}</div>
            <div className="text-xs text-gray-500">{time}</div>
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Guest Name",
      dataIndex: "guestName",
      key: "guestName",
    },

    {
      title: "Action",
      fixed:"end",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View Details">
            <EyeOutlined
              onClick={() => {
                setSelectedData(record);
                setMode("view");
                setDrawerOpen(true);
              }}
            />
          </Tooltip>

          <Tooltip title="Edit">
            <EditOutlined
              onClick={() => {
                setSelectedData(record);
                setMode("edit");
                setDrawerOpen(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={dataSource} rowKey="id" />

      <EventFacilityOrderForm
        mode={mode}
        setMode={setMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedData={selectedData}
        onSuccess={refreshData}
      />
    </div>
  );
};

export default EventFacilityOrderTable;
