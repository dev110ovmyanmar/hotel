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
import ServiceAddOnForm from "./ServiceAddOnForms/ServiceAddOnForm";
import PriceTag from "../../../../../component/PriceTag/PriceTag";
import dayjs from "dayjs";

const ServiceAddOnTable = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const savedServices = JSON.parse(localStorage.getItem("services")) || [];
    setDataSource(savedServices);
  }, []);

  const refreshData = () => {
    const savedServices = JSON.parse(localStorage.getItem("services")) || [];
    setDataSource(savedServices);
  };

  const handleAdd = () => {
    setMode("add");
    setSelectedData(null);
    setDrawerOpen(true);
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 70 },
    {
      title: "Service Name",
      dataIndex: "selectService",
      key: "nselectServiceame",
    },

    {
      title: "Start Date Time",
      key: "startDateTime",
      render: (_, record) => {
        const date = record.serviceOrderDate
          ? dayjs(record.serviceOrderDate).format("DD-MM-YYYY")
          : "-";
        const time = record.serviceOrderTime
          ? dayjs(record.serviceOrderTime).format("h:mm A")
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
      title: "Room No",
      dataIndex: "roomNo",
      key: "roomNo",
    },

    { title: "Qty Unit", dataIndex: "quantity", key: "quantity" },
    {
      title: "Price (MMK)",
      dataIndex: "basePrice",
      key: "basePrice",
      render: (text) => <PriceTag value={text} />,
      width: "80",
      align: "right",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
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

      <ServiceAddOnForm
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

export default ServiceAddOnTable;
