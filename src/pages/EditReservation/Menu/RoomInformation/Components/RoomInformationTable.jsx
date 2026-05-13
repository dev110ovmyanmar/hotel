import { Dropdown, Space, Table, Button, Tooltip, Divider } from "antd";
import { useState, useEffect } from "react";
import {
  MoreOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { MdOutlineMeetingRoom } from "react-icons/md";
import RoomInformationForm from "./RoomInformationForms/RoomInformationForm";
import RoomMoveDrawer from "./RoomInformationForms/RoomMoveDrawer";
import AssignRoomForm from "./RoomInformationForms/AssignRoomForm";
import dayjs from "dayjs";
import NoteDrawer from "./RoomInformationForms/NoteDrawer";
import { EyeOutlined } from "@ant-design/icons";
import GuestForm from "../../../../GuestsListing/Components/NewGuestForm";

const RoomInformationTable = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [roomMoveOpen, setRoomMoveOpen] = useState(false);
  const [assignRoomOpen, setAssignRoomOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    const savedRoomInfo = JSON.parse(localStorage.getItem("roomInfo")) || [];
    setDataSource(savedRoomInfo);
  };

  const expandedRowRender = (record) => {
    const nestedColumns = [
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

    const nestedData = record.guests || [];

    return (
      <>
        <div className="flex justify-between items-center mb-3">
          <Button
            className="py-4! ml-4 rounded-[5px]!"
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedData(record);
              setMode("add");
              setGuestOpen(true);
            }}
          >
            Add Guest
          </Button>
        </div>

        {nestedData.length > 0 && (
          <Table
            className="ml-4 [&_.ant-table-cell]:!border [&_.ant-table-cell]:!border-blue-300 [&_.ant-table-thead>tr>th]:!bg-[#F0F5FF]"
            columns={nestedColumns}
            dataSource={nestedData}
            pagination={false}
            size="small"
            rowKey="id"
          />
        )}
      </>
    );
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Room",
      key: "newRoom",
      dataIndex: "newRoom",
      className: "font-medium",
      render: (text, record) => {
        const isAssignRoom = text === "Assign Room";
        return (
          <span
            style={{
              color: isAssignRoom ? "#1890ff" : "inherit",
              cursor: isAssignRoom ? "pointer" : "default",
              display: "inline-block",
            }}
            onClick={(e) => {
              if (isAssignRoom) {
                e.stopPropagation();
                setSelectedData(record);
                setAssignRoomOpen(true);
              }
            }}
          >
            <div className="flex flex-col">
              <div
                className={`font-medium ${isAssignRoom ? "text-blue-500" : "text-gray-900"}`}
              >
                {text || "-"}
              </div>
              <div className="text-xs text-gray-500">{record.roomType}</div>
            </div>
          </span>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "guest",
      key: "guest",
    },
    {
      title: "Arrival",
      key: "arrivalDate",
      render: (_, record) => (
        <div className="font-medium">
          {record.arrivalDate
            ? dayjs(record.arrivalDate).format("DD/MM/YYYY")
            : "-"}
        </div>
      ),
    },
    {
      title: "Departure",
      key: "departureDate",
      render: (_, record) => (
        <div className="font-medium">
          {record.departureDate
            ? dayjs(record.departureDate).format("DD/MM/YYYY")
            : "-"}
        </div>
      ),
    },
    { title: "Room Status", dataIndex: "status", key: "status" },
    { title: "Rate Plan", dataIndex: "ratePlan", key: "ratePlan" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    {
      title: "Action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View Details">
            <EyeOutlined
              className="cursor-pointer"
              onClick={() => {
                setSelectedData(record);
                setMode("view");
                setDrawerOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <EditOutlined
              className="cursor-pointer"
              onClick={() => {
                setSelectedData(record);
                setMode("edit");
                setDrawerOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Move Room">
            <MdOutlineMeetingRoom
              style={{ fontSize: "20px", cursor: "pointer" }}
              onClick={() => {
                setSelectedData(record);
                setRoomMoveOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Notes">
            <MessageOutlined
              style={{ fontSize: "18px", cursor: "pointer" }}
              onClick={() => {
                setSelectedData(record);
                setNoteOpen(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => record.id !== null,
        }}
      />

      <RoomInformationForm
        mode={mode}
        setMode={setMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedData={selectedData}
        onSuccess={refreshData}
      />

      <RoomMoveDrawer
        open={roomMoveOpen}
        selectedData={selectedData}
        onClose={() => setRoomMoveOpen(false)}
        reservationId={selectedData?.id}
      />

      <AssignRoomForm
        open={assignRoomOpen}
        onClose={() => setAssignRoomOpen(false)}
        selectedData={selectedData}
        onSuccess={refreshData}
      />

      <NoteDrawer open={noteOpen} onClose={() => setNoteOpen(false)} />

      <GuestForm
        mode={mode}
        setMode={setMode}
        drawerOpen={guestOpen}
        setDrawerOpen={setGuestOpen}
        selectedData={selectedData} 
        onSuccess={refreshData}
      />
    </div>
  );
};

export default RoomInformationTable;
