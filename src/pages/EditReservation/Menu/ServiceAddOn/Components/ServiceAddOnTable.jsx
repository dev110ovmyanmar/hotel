import { Dropdown, Space, Table, Button } from "antd";
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
    { title: "Service Name", dataIndex: "selectService", key: "nselectServiceame" },
    {
      title: "Start Date Time",
      dataIndex:"serviceOrderDate",
      key: "serviceOrderDate",
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
      render: (_, record) => {
        const smallStyle = { fontSize: "12px" };

        const items = [
          {
            key: "1",
            label: (
              <Space
                size={4}
                style={smallStyle}
                onClick={() => {
                  setDrawerOpen(true);
                  setMode("view");
                  setSelectedData(record);
                }}
              >
                <EyeOutlined style={{ fontSize: "12px" }} />
                <span style={{ fontSize: "14px" }}>View</span>
              </Space>
            ),
          },
          {
            key: "2",
            label: (
              <Space
                size={4}
                style={smallStyle}
                onClick={() => {
                  setDrawerOpen(true);
                  setMode("edit");
                  setSelectedData(record);
                }}
              >
                <EditOutlined style={{ fontSize: "12px" }} />
                <span style={{ fontSize: "14px" }}>Edit</span>
              </Space>
            ),
          },
        ];

        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <MoreOutlined style={{ fontSize: "16px" }} />
          </Dropdown>
        );
      },
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
