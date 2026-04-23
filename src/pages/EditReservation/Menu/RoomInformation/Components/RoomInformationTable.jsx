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
import RoomInformationForm from "./RoomInformationForms/RoomInformationForm";

const RoomInformationTable = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const savedRoomInfo = JSON.parse(localStorage.getItem("roomInfo")) || [];
    setDataSource(savedRoomInfo);
  }, []);

  const refreshData = () => {
    const savedRoomInfo = JSON.parse(localStorage.getItem("roomInfo")) || [];
    setDataSource(savedRoomInfo);
  };
  
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Room Type",
      dataIndex: "roomType",
      key: "roomType",
    },
    {
      title: "Name",
      dataIndex: "guest",
      key: "guest",
    },
    {
      title: "Arrival",
      dataIndex: "arrivalDate",
      key: "arrivalDate",
      render: (text) => <div>{String(text)}</div>,
    },
    {
      title: "Departure",
      dataIndex: "departureDate",
      key: "departureDate",
      render: (text) => <div>{String(text)}</div>,
    },

    {
      title: "Room Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Rate Plan",
      dataIndex: "ratePlan",
      key: "ratePlan",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
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

      <RoomInformationForm
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

export default RoomInformationTable;
