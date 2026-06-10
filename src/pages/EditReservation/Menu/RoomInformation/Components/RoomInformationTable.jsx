import { useState } from "react";
import { Dropdown, Table } from "antd";
import dayjs from "dayjs";
import {
  PlusOutlined,
  MessageOutlined,
  EyeOutlined,
  EditOutlined,
  CalendarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  MinusOutlined,
  DollarOutlined,
  UserOutlined,
  ConsoleSqlOutlined,
} from "@ant-design/icons";

import { MdOutlineMeetingRoom } from "react-icons/md";
import { IoOptionsSharp } from "react-icons/io5";

import RoomInformationForm from "./RoomInformationForms/RoomInformationForm";
import RoomMoveDrawer from "./RoomInformationForms/RoomMoveDrawer";
import AssignRoomForm from "./RoomInformationForms/AssignRoomForm";
import NoteDrawer from "./RoomInformationForms/NoteDrawer";
import ColorStatusTag from "../../../../../component/ColorStatusTag/ColorStatusTag";
import RoomAmend from "./RoomInformationForms/RoomAmend";

import { queryClient } from "../../../../../app/queryClient";

// Split Modal Component Import
// import DateChangeModal from "./RoomAmendmentModals/DateChangeModals";
import StayExtensionModal from "./RoomAmendmentModals/StayExtensionModal";
import StayReductionModal from "./RoomAmendmentModals/StayReductionModal";
// import UpdateRateModal from "./RoomAmendmentModals/UpdateRateModal";

const RoomInformationTable = ({
  data,
  page,
  perPage,
  total,
  loading,
  changePage,
  changePerPage,
  reservationUuid,
  // stayExtensionUuid,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);
  const [roomMoveOpen, setRoomMoveOpen] = useState(false);
  const [assignRoomOpen, setAssignRoomOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [roomAmend, setRoomAmend] = useState(false);

  // Unified State Engine for Split Modals
  const [activeModal, setActiveModal] = useState(null);

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const amendmentType = initData?.statuses?.amendment_type;
  const stayExtension = amendmentType?.find((item) => item.code === "stay_extension");
  const stayExtensionUuid = stayExtension?.uuid;

  const stayReduction = amendmentType?.find((item) => item.code === "stay_reduction");
  const stayReductionUuid = stayReduction?.uuid;

  const rateChange = amendmentType?.find((item) => item.code === "rate_change");
  const rateChangeUuid = rateChange?.uuid;

  // Core Orchestration Handler - Direct Pass
  const handleAction = (key, record) => {
    setSelectedData(record);
    setActiveModal(key);
  };

  const closeModal = () => {
    setActiveModal(null);
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
              color: isRoomNull ? (isConfirmed ? "#1890ff" : "#bfbfbf") : "inherit",
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
                    onClick: () => handleAction("date_change", record),
                  },
                  ...(record?.isExtend !== false || record?.roomStatus?.code === "checked_in"
                    ? [
                      {
                        key: "stay_extension",
                        label: "Extend Stay",
                        icon: <PlusOutlined />,
                        onClick: () => handleAction("stay_extension", record),
                      },
                    ]
                    : []
                  ),
                  {
                    key: "stay_reduction",
                    label: "Shorten Stay",
                    icon: <MinusOutlined />,
                    onClick: () => handleAction("stay_reduction", record),
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
                    onClick: () => handleAction("room_upgrade", record),
                  },
                  {
                    key: "room_downgraden",
                    label: "Downgrade Room",
                    icon: <ArrowDownOutlined />,
                    onClick: () => handleAction("room_downgraden", record),
                  },
                  {
                    key: "add_room",
                    label: "Add Room",
                    icon: <PlusOutlined />,
                    onClick: () => handleAction("add_room", record),
                  },
                  {
                    key: "remove_room",
                    label: "Remove Room",
                    icon: <MinusOutlined />,
                    onClick: () => handleAction("remove_room", record),
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
                    onClick: () => handleAction("rate_change", record),
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
                    onClick: () => handleAction("occupancy_change", record),
                  },
                  {
                    key: "extra_bed_add",
                    label: "Add Extra Bed",
                    icon: <PlusOutlined />,
                    onClick: () => handleAction("extra_bed_add", record),
                  },
                  {
                    key: "extra_bed_remove",
                    label: "Remove Extra Bed",
                    icon: <MinusOutlined />,
                    onClick: () => handleAction("extra_bed_remove", record),
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

      {/* Legacy Forms & Drawers */}
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

      {/* ============================================================== */}
      {/* Dynamic Conditional Mount Layer - Fast Local Record Binding    */}
      {/* ============================================================== */}
      {/* {activeModal === "date_change" && selectedData && (
        <DateChangeModal
          isOpen={true}
          onClose={closeModal}
          record={selectedData} // Direct row object mapping
          refetch={refetch}
        />
      )} */}


      {
        activeModal === "stay_extension" && selectedData && (
          <StayExtensionModal
            isOpen={true}
            onClose={closeModal}
            record={selectedData}
            // refetch={refetch}
            stayExtensionUuid={stayExtensionUuid}
          />
        )
      }

      {
        activeModal === "stay_reduction" && selectedData && (
          <StayReductionModal
            isOpen={true}
            onClose={closeModal}
            record={selectedData}
            stayReductionUuid={stayReductionUuid}
          />
        )
      }

      {/* {
        activeModal === "rate_change" && selectedData && (
          <UpdateRateModal
            isOpen={true}
            onClose={closeModal}
            record={selectedData}
            record={mockRecord}
            rateChangeUuid={rateChangeUuid}
          />
        )
      } */}
    </div>
  );
};

export default RoomInformationTable;