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
import EventFacilityOrderForm from "./EventFacilityOrderForms/EventFacilityOrderForm";

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
      // dataIndex:
    },
    {
      title: "End Date Time",
      key: "endDateTime",
      // dataIndex:
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
