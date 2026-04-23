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
import GuestForm from "./GuestForms/GuestForm";

const GuestTable = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const savedGuests = JSON.parse(localStorage.getItem("guests")) || [];
    setDataSource(savedGuests);
  }, []);

  const refreshData = () => {
    const savedGuests = JSON.parse(localStorage.getItem("guests")) || [];
    setDataSource(savedGuests);
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 70 },
    { title: "Guest Name", dataIndex: "name", key: "name" },
    { title: "NRC", dataIndex: "nrc_no", key: "nrc_no" },
    {
      title: "Passport",
      dataIndex: "passport",
      key: "passport",
    },
    { title: "Room No", dataIndex: "room_no", key: "room_no" },
    { title: "Phone Number", dataIndex: "phone_no1", key: "phone_no1" },
    {
      title: "Guest",
      dataIndex: "guest",
      key: "guest",
    },
    {
      title: "Nationality",
      dataIndex: "nationality",
      key: "nationality",
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
          {
            key: "3",
            label: (
              <Space
                size={4}
                style={smallStyle}
                onClick={() => {
                  setSelectedData(record);
                }}
              >
                <UploadOutlined style={{ fontSize: "12px" }} />
                <span style={{ fontSize: "14px" }}>Upload File</span>
              </Space>
            ),
          },
          {
            key: "4",
            label: (
              <Space
                size={4}
                style={smallStyle}
                onClick={() => {
                  setConfirmModal(true);
                  setSelectedData(record);
                }}
              >
                <InboxOutlined style={{ fontSize: "12px" }} />
                <span style={{ fontSize: "14px" }}>Guest Note</span>
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

      <GuestForm
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

export default GuestTable;
