import { useState, useEffect } from "react";
import { Dropdown, Space, Table, Button, Tooltip, Divider } from "antd";
import dayjs from "dayjs";
import {
  MoreOutlined,
  PlusOutlined,
  UploadOutlined,
  MessageOutlined,
  EyeOutlined,
  EditOutlined,
  CalendarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined,
  DollarOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { MdOutlineMeetingRoom } from "react-icons/md";
import { IoBedOutline, IoOptionsSharp } from "react-icons/io5";

import RoomInformationForm from "./RoomInformationForms/RoomInformationForm";
import RoomMoveDrawer from "./RoomInformationForms/RoomMoveDrawer";
import AssignRoomForm from "./RoomInformationForms/AssignRoomForm";
import NoteDrawer from "./RoomInformationForms/NoteDrawer";
import GuestForm from "../../GuestDetails/Components/GuestForms/GuestForm";
import ColorStatusTag from "../../../../../component/ColorStatusTag/ColorStatusTag";
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
  console.log(reservationUuid,"reservationUuid")
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [roomMoveOpen, setRoomMoveOpen] = useState(false);
  const [assignRoomOpen, setAssignRoomOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);
  const [roomAmend, setRoomAmend] = useState(false);

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

        const statusCode = reservationUuid?.reservationRoom?.roomStatus?.code;

        const validStatuses = ["confirmed", "checked_in"];
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
      width: 80,
      render: (_, record) => {
        const statusCode = reservationUuid?.reservationStatus?.code;
        const validStatuses = ["confirmed", "check_in", "checked_in"];
        const isConfirmed = validStatuses.includes(statusCode);
        const isCheckin = statusCode === "checked_in";

        const handleAction = (key) => {
          setSelectedData(record);
          console.log(`Clicked: ${key}`);
        };

        const menuItems = [
          {
            key: "view",
            label: "View Details",
            icon: <EyeOutlined />,
            onClick: () => {
              setSelectedData(record);
              setMode("view");
              setDrawerOpen(true);
            },
          },
          {
            key: "notes",
            label: "Notes",
            icon: <MessageOutlined />,
            onClick: () => {
              setSelectedData(record);
              setNoteOpen(true);
            },
          },
          // ...(isConfirmed
          //   ? [
          //       {
          //         key: "move",
          //         label: "Move Room",
          //         icon: <MdOutlineMeetingRoom style={{ fontSize: "16px" }} />,
          //         onClick: () => {
          //           setSelectedData(record);
          //           setRoomMoveOpen(true);
          //         },
          //       },
          //     ]
          //   : []),
          // ...(isCheckin
          //   ? [
          //       {
          //         key: "amend",
          //         label: "Room Amend",
          //         icon: <IoBedOutline style={{ fontSize: "16px" }} />,
          //         onClick: () => {
          //           setSelectedData(record);
          //           setRoomAmend(true);
          //         },
          //       },
          //     ]
          //   : []),
          { type: "divider" },
          {
            key: "modify_group",
            label: "Amend Reservation",
            icon: <EditOutlined />,
            children: [
              {
                key: "col_date",
                type: "group",
                label: "DATE CHANGES",
                children: [
                  {
                    key: "date_change",
                    label: "Change CI/CO Dates",
                    icon: <CalendarOutlined />,
                    onClick: () => handleAction("date_change"),
                  },
                  {
                    key: "stay_extension",
                    label: "Extend Stay",
                    icon: <PlusOutlined />,
                    onClick: () => handleAction("stay_extension"),
                  },
                  {
                    key: "stay_reduction",
                    label: "Shorten Stay",
                    icon: <MinusOutlined />,
                    onClick: () => handleAction("stay_reduction"),
                  },
                ],
              },
              { type: "divider" },
              {
                key: "col_room",
                type: "group",
                label: "ROOM CHANGES",
                children: [
                  {
                    key: "room_move",
                    label: "Change Room",
                    icon: <MdOutlineMeetingRoom />,
                    onClick: () => {
                      setSelectedData(record);
                      setRoomMoveOpen(true);
                    },
                  },
                  {
                    key: "room_upgrade",
                    label: "Upgrade Room",
                    icon: <ArrowUpOutlined />,
                    onClick: () => handleAction("room_upgrade"),
                  },
                  {
                    key: "room_downgraden",
                    label: "Downgrade Room",
                    icon: <ArrowDownOutlined />,
                    onClick: () => handleAction("room_downgraden"),
                  },
                  {
                    key: "add_room",
                    label: "Add Room",
                    icon: <PlusOutlined />,
                    onClick: () => handleAction("add_room"),
                  },
                  {
                    key: "remove_room",
                    label: "Remove Room",
                    icon: <MinusOutlined />,
                    onClick: () => handleAction("remove_room"),
                  },
                ],
              },
              { type: "divider" },
              {
                key: "col_rate",
                type: "group",
                label: "RATE / PRICE CHANGES",
                children: [
                  {
                    key: "rate_change",
                    label: "Update Rates",
                    icon: <DollarOutlined />,
                    onClick: () => handleAction("rate_change"),
                  },
                ],
              },
              { type: "divider" },
              {
                key: "col_guest",
                type: "group",
                label: "GUEST / OCCUPANCY",
                children: [
                  {
                    key: "occupancy_change",
                    label: "Update Room Guests",
                    icon: <UserOutlined />,
                    onClick: () => handleAction("occupancy_change"),
                  },
                  {
                    key: "extra_bed_add",
                    label: "Add Extra Bed",
                    icon: <PlusOutlined />,
                    onClick: () => handleAction("extra_bed_add"),
                  },
                  {
                    key: "extra_bed_remove",
                    label: "Remove Extra Bed",
                    icon: <MinusOutlined />,
                    onClick: () => handleAction("extra_bed_remove"),
                  },
                ],
              },
            ],
          },
        ];

        return (
          <Dropdown
            menu={{ items: menuItems, style: { minWidth: "200px" } }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <IoOptionsSharp
              className="cursor-pointer"
              style={{ fontSize: "30px", padding: "4px" }}
            />
          </Dropdown>
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
