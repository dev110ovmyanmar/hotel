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
import GuestForm from "./GuestForms/GuestForm";
import NewGuestUploadForm from "./../../../../GuestsListing/Components/NewGuestUploadForm";
import GuestNoteDrawer from "./GuestForms/GuestNoteDrawer";

const GuestTable = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);

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

          <Tooltip title="File Upload">
            <UploadOutlined
              onClick={() => {
                setSelectedData(record);
                setUploadOpen(true);
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

      <GuestForm
        mode={mode}
        setMode={setMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedData={selectedData}
        onSuccess={refreshData}
      />

      <NewGuestUploadForm
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        reservationId={selectedData?.id}
      />

      {/* <GuestNoteDrawer
        open={noteOpen}
        onClose={() => setNoteOpen(false)}
        reservationId={selectedData?.id}
      /> */}
    </div>
  );
};

export default GuestTable;
