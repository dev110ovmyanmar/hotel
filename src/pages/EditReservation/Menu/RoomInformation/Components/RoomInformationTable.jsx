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
import GuestForm from "../../GuestDetails/Components/GuestForms/GuestForm";
import { EyeOutlined } from "@ant-design/icons";

const RoomInformationTable = ({
  data,
  page,
  perPage,
  total,
  loading,
  changePage,
  changePerPage,
  reservationUuid,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [roomMoveOpen, setRoomMoveOpen] = useState(false);
  const [assignRoomOpen, setAssignRoomOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);

  console.log(reservationUuid, "reservationUuidtable");

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Room",
      key: "room",
      dataIndex: "room",
      render: (text, record) => {
        const isRoomNull = !text;

        return (
          <span
            style={{
              color: isRoomNull ? "#1890ff" : "inherit",
              cursor: isRoomNull ? "pointer" : "default",
              textDecoration: isRoomNull ? "underline" : "none",
            }}
            onClick={(e) => {
              if (isRoomNull) {
                e.stopPropagation();
                setSelectedData(record);
                setAssignRoomOpen(true);
              }
            }}
          >
            {text ? text : "Assign Room"}
          </span>
        );
      },
    },

    {
      title: "Name",
      dataIndex: ["roomType", "name"],
      key: "name",
    },
    {
      title: "Arrival",
      dataIndex: "checkinDate",
      key: "checkinDate",
      render: (value) => (value ? dayjs(value).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Departure",
      dataIndex: "checkoutDate",
      key: "checkoutDate",
      render: (value) => (value ? dayjs(value).format("DD/MM/YYYY") : "-"),
    },

    { title: "Room Status", dataIndex: "roomStatus", key: "roomStatus" },
    { title: "Rate Plan", dataIndex: ["ratePlan", "name"], key: "ratePlan" },
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
        tableLayout="fixed"
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={data}
        rowKey="id"
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
      />

      <RoomInformationForm
        mode={mode}
        setMode={setMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedData={selectedData}
      />

      <RoomMoveDrawer
        open={roomMoveOpen}
        selectedData={selectedData}
        onClose={() => setRoomMoveOpen(false)}
        reservationId={selectedData?.id}
      />

      {assignRoomOpen && (
        <AssignRoomForm
          data={data?.data || []}
          open={assignRoomOpen}
          onClose={() => setAssignRoomOpen(false)}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
          reservationUuid={reservationUuid}
        />
      )}

      <NoteDrawer open={noteOpen} onClose={() => setNoteOpen(false)} />
    </div>
  );
};

export default RoomInformationTable;
