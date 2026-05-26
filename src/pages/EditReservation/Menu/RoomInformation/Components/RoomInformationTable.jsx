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
import ColorStatusTag from "../../../../../component/ColorStatusTag/ColorStatusTag";
import { IoBedOutline } from "react-icons/io5";
import RoomAmend from "./RoomInformationForms/RoomAmend";

const RoomInformationTable = ({
  data,
  page,
  perPage,
  total,
  loading,
  changePage,
  changePerPage,
  reservationUuid,
  refetch,
}) => {
  console.log(data, "noteDatas");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [roomMoveOpen, setRoomMoveOpen] = useState(false);
  const [assignRoomOpen, setAssignRoomOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);
  const [roomAmend, setRoomAmend] = useState(false);

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
      width: 120,
      render: (text, record) => {
        const isRoomNull = !text;

        const statusCode = reservationUuid?.reservationStatus?.code;

        const validStatuses = ["confirmed", "checked_in", "pending", "booked"];
        const isConfirmed = validStatuses.includes(statusCode);

        const isClickable = isRoomNull && isConfirmed;

        return (
          <span
            style={{
              color: isRoomNull
                ? isConfirmed
                  ? "#1890ff"
                  : "#bfbfbf"
                : "inherit",
              cursor: isClickable ? "pointer" : "not-allowed",
              textDecoration: isClickable ? "underline" : "none",
            }}
            onClick={(e) => {
              if (isClickable) {
                e.stopPropagation();
                setSelectedData(record);
                setAssignRoomOpen(true);
              }
            }}
          >
            {text ? text?.roomNo : "Assign Room"}
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
      width: 110,
    },
    {
      title: "Departure",
      dataIndex: "checkoutDate",
      key: "checkoutDate",
      render: (value) => (value ? dayjs(value).format("DD/MM/YYYY") : "-"),
      width: 110,
    },

    {
      title: "Status",
      dataIndex: ["roomStatus", "name"],
      key: "roomStatus",
      render: (_, record) => <ColorStatusTag status={record?.roomStatus} />,
      width: 110,
    },
    { title: "Rate Plan", dataIndex: ["ratePlan", "name"], key: "ratePlan" },
    {
      title: "Action",
      fixed: "end",
      align: "center",
      render: (_, record) => {
        const statusCode = reservationUuid?.reservationStatus?.code;

        const validStatuses = ["confirmed", "check_in", "checked_in"];
        const isConfirmed = validStatuses.includes(statusCode);
        const isCheckin =
          reservationUuid?.reservationStatus?.code === "checked_in";

        return (
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

            {isConfirmed && (
              <Tooltip title="Move Room">
                <MdOutlineMeetingRoom
                  style={{ fontSize: "20px", cursor: "pointer" }}
                  onClick={() => {
                    setSelectedData(record);
                    setRoomMoveOpen(true);
                  }}
                />
              </Tooltip>
            )}

            {isCheckin && (
              <Tooltip title="Room Amend">
                <IoBedOutline
                  style={{ fontSize: "18px", cursor: "pointer" }}
                  onClick={() => {
                    setSelectedData(record);
                    setRoomAmend(true);
                  }}
                />
              </Tooltip>
            )}

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
      />

      <RoomInformationForm
        page={page}
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

      {noteOpen && (
        <NoteDrawer
          noteData={data?.data || []}
          open={noteOpen}
          onClose={() => setNoteOpen(false)}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
        />
      )}

      {roomAmend && (
        <RoomAmend
          open={roomAmend}
          onClose={() => setRoomAmend(false)}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
        />
      )}
    </div>
  );
};

export default RoomInformationTable;
