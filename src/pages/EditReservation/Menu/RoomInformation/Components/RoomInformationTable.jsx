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
import DateChangeModal from "./RoomAmendmentModals/DateChangeModals";
import StayExtensionModal from "./RoomAmendmentModals/StayExtensionModal";
import StayReductionModal from "./RoomAmendmentModals/StayReductionModal";
import GuestForm from "../../GuestDetails/Components/GuestForms/GuestForm";
import { BsPeople, BsPeopleFill } from "react-icons/bs";
import GuestListDrawer from "./RoomInformationForms/GuestListDrawer";
import RoomMoveModal from "./RoomAmendmentModals/RoomMoveModal";
import GuestUploadDrawer from "../../GuestDetails/Components/GuestForms/GuestUploadDrawer";
import UpdateRateModal from "./RoomAmendmentModals/UpdateRateModal";
import AddExtraBedModal from "./RoomAmendmentModals/AddExtraBedModal";
import RoomUpgradeModal from "./RoomAmendmentModals/RoomUpgradeModal";
import { useApiMutation } from "../../../../../hooks/useApiMutation";
import { availabilitySearch } from "../../../../../api/reservationSectionApi";
import Toast from "../../../../../component/Toast/Toast";
import RoomDowngradeModal from "./RoomAmendmentModals/RoomDowngradeModal";

const RoomInformationTable = ({
  data,
  reservation,
  page,
  perPage,
  total,
  loading,
  changePage,
  changePerPage,
  reservationUuid,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);
  const [guestListOpen, setGuestListOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [roomMoveOpen, setRoomMoveOpen] = useState(false);
  const [assignRoomOpen, setAssignRoomOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [roomAmend, setRoomAmend] = useState(false);
  const [guestFormMode, setGuestFormMode] = useState("add");
  const [selectedGuestData, setSelectedGuestData] = useState(null); // This is the Guest dat
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedUploadRow, setSelectedUploadRow] = useState(null);
  const [roomUpgrade, setRoomUpgrade] = useState(false);
  const [roomDowngrade, setRoomDowngrade] = useState(false);
  const [ratePlanUuid, setRatePlanUuid] = useState();

  // Unified State Engine for Split Modals
  const [activeModal, setActiveModal] = useState(null);

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const amendmentType = initData?.statuses?.amendment_type;
  const stayExtension = amendmentType?.find(
    (item) => item.code === "stay_extension",
  );
  const stayExtensionUuid = stayExtension?.uuid;

  const stayReduction = amendmentType?.find(
    (item) => item.code === "stay_reduction",
  );
  const stayReductionUuid = stayReduction?.uuid;

  const rateChange = amendmentType?.find((item) => item.code === "rate_change");
  const rateChangeUuid = rateChange?.uuid;

  const roomMove = amendmentType?.find((item) => item.code === "room_move");
  const roomMoveUuid = roomMove?.uuid;

  const extraBed = amendmentType?.find((item) => item.code === "extra_bed_add");
  const extraBedAmendmentUuid = extraBed?.uuid;

  const roomUpgrades = amendmentType?.find(
    (item) => item.code === "room_upgrade",
  );
  const roomUpgradeUuid = roomUpgrades?.uuid;

  const roomDowngrades = amendmentType?.find(
    (item) => item.code === "room_downgrade",
  );
  const roomDowngradeUuid = roomDowngrades?.uuid;

  const availabilitySearchs = useApiMutation({
    mutationFn: availabilitySearch,
    invalidateKeys: [["availability-search"]],
    // enabled: !!selectedData?.reservation?.uuid
  });

  console.log(availabilitySearchs, "AvailabilitySearchs");

  const handleAction = (key, record) => {
    setSelectedData(record);
    setActiveModal(key);

    console.log(record, "RecordInHandleAction");

    // 1. Keep them as objects, not formatted strings
    const checkinDate = dayjs().startOf("day");
    const checkoutDate = dayjs(record?.checkoutDate).startOf("day");

    // 2. Perform the diff directly on the objects
    // 'day' is the unit of measurement, 'true' returns a float (if partial days exist)
    const totalNights = checkoutDate.diff(checkinDate, "day", true);

    console.log(totalNights, "totalNights");

    const checkinDatePayload = dayjs().format("YYYY-MM-DD");
    const checkoutDatePayload = dayjs(record?.checkoutDate).format(
      "YYYY-MM-DD",
    );

    const ranks = record?.roomType?.rank;

    const modifiedValues = {
      reservation: {
        uuid: reservation?.uuid,
      },
      filter: {
        checkinDate: checkinDatePayload,
        checkoutDate: checkoutDatePayload,
      },
      totalNight: totalNights,
      rank: ranks,
      amendmentType: {
        code: key === "room_downgrade" ? "room_downgrade" : "room_upgrade",
      },
    };

    if (["room_upgrade", "room_downgrade"].includes(key)) {
      availabilitySearchs.mutate(modifiedValues);
    }
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

        const statusCode = record?.roomStatus?.code;
        const validStatuses = ["confirmed", "checked_in"];

        const isValidStatus = validStatuses.includes(statusCode);
        const isClickable =
          isRoomNull && isValidStatus && !record?.expiredStatus;

        return (
          <span
            style={{
              color: isRoomNull
                ? isClickable
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
      render: (value) => (value ? dayjs(value).format("YYYY-MM-DD") : "-"),
      width: 110,
    },
    {
      title: "Departure",
      dataIndex: "checkoutDate",
      key: "checkoutDate",
      render: (value) => (value ? dayjs(value).format("YYYY-MM-DD") : "-"),
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
        const rawCode = record?.roomStatus?.code || "";
        const statusCode = rawCode.toLowerCase().replace("-", "_");

        const isDisabled =
          statusCode === "cancelled" || statusCode === "no_show";

        if (isDisabled) {
          return (
            <IoOptionsSharp
              style={{
                fontSize: "30px",
                padding: "4px",
                color: "#bfbfbf",
                cursor: "not-allowed",
              }}
            />
          );
        }

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
          {
            key: "guestList",
            label: "Guest List",
            icon: <BsPeople />,
            onClick: () => {
              setSelectedData(record);
              setGuestListOpen(true);
            },
          },
        ];

        if (record?.amendStatus) {
          menuItems.push(
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
                    ...(record?.isExtend !== false ||
                      record?.roomStatus?.code === "checked_in"
                      ? [
                        {
                          key: "stay_extension",
                          label: "Extend Stay",
                          icon: <PlusOutlined />,
                          onClick: () =>
                            handleAction("stay_extension", record),
                        },
                      ]
                      : []),
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
                      // className:
                      //   record?.roomStatus?.code === "checked_in" &&
                      //     record?.room !== null
                      //     ? "!text-black"
                      //     : "!text-gray-300 !cursor-not-allowed !pointer-events-none",
                      onClick: () => {
                        handleAction("room_move", record);
                        setRoomMoveOpen(true);
                      },
                    },
                    {
                      key: "room_upgrade",
                      label: "Upgrade Room",
                      icon: <ArrowUpOutlined />,
                      onClick: () => {
                        (handleAction("room_upgrade", record),
                          setRoomUpgrade(true),
                          setRatePlanUuid(record?.ratePlan.uuid));
                      },
                    },
                    {
                      key: "room_downgrade",
                      label: "Downgrade Room",
                      icon: <ArrowDownOutlined />,
                      onClick: () => {
                        (handleAction("room_downgrade", record),
                          setRoomDowngrade(true),
                          setRatePlanUuid(record?.ratePlan.uuid));
                      },
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
                      onClick: () => {
                        setSelectedData(record);
                        setGuestOpen(true);
                      },
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
          );
        }

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
        rowClassName={(record) => {
          const targetUuid = reservationUuid?.reservationRoom?.uuid;
          return record?.uuid === targetUuid ? "active-reservation-row" : "";
        }}
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

      {/* <RoomMoveDrawer
        open={roomMoveOpen}
        selectedData={selectedData}
        onClose={() => setRoomMoveOpen(false)}
        reservationId={selectedData?.id}
      /> */}

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

      {guestOpen && (
        <GuestForm
          drawerOpen={guestOpen}
          setDrawerOpen={setGuestOpen}
          mode={guestFormMode}
          setMode={setGuestFormMode}
          guestData={selectedGuestData}
          setSelectedData={setSelectedGuestData}
          reservationUuid={reservationUuid?.reservation}
        />
      )}
      {guestListOpen && (
        <GuestListDrawer
          drawerOpen={guestListOpen}
          setDrawerOpen={setGuestListOpen}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
          setGuestOpen={setGuestOpen}
          setGuestFormMode={setGuestFormMode}
          setSelectedGuestData={setSelectedGuestData}
          setUploadOpen={setUploadOpen}
          setSelectedUploadRow={setSelectedUploadRow}
        />
      )}

      {uploadOpen && (
        <GuestUploadDrawer
          open={uploadOpen}
          onClose={() => {
            setUploadOpen(false);
            setSelectedUploadRow(null);
          }}
          selectedRow={selectedUploadRow}
        />
      )}

      {/* ============================================================== */}
      {/* Dynamic Conditional Mount Layer - Fast Local Record Binding    */}
      {/* ============================================================== */}
      {activeModal === "date_change" && selectedData && (
        <DateChangeModal
          isOpen={true}
          onClose={closeModal}
          record={selectedData} // Direct row object mapping
          refetch={refetch}
        />
      )}

      {activeModal === "stay_extension" && selectedData && (
        <StayExtensionModal
          isOpen={true}
          onClose={closeModal}
          record={selectedData}
          // refetch={refetch}
          stayExtensionUuid={stayExtensionUuid}
        />
      )}

      {activeModal === "stay_reduction" && selectedData && (
        <StayReductionModal
          isOpen={true}
          onClose={closeModal}
          record={selectedData}
          stayReductionUuid={stayReductionUuid}
        />
      )}

      {activeModal === "rate_change" && selectedData && (
        <UpdateRateModal
          isOpen={true}
          onClose={closeModal}
          record={selectedData}
          // record={mockRecord}
          rateChangeUuid={rateChangeUuid}
        />
      )}
      {selectedData && (
        <RoomMoveModal
          isOpen={roomMoveOpen}
          onClose={() => setRoomMoveOpen(false)}
          record={selectedData}
          roomMoveUuid={roomMoveUuid}
        />
      )}

      {activeModal === "extra_bed_add" && selectedData && (
        <AddExtraBedModal
          isOpen={true}
          onClose={closeModal}
          record={selectedData}
          extraBedAmendmentUuid={extraBedAmendmentUuid}
        />
      )}

      <RoomUpgradeModal
        isOpen={roomUpgrade}
        onClose={() => setRoomUpgrade(false)}
        record={selectedData}
        roomUpgradeUuid={roomUpgradeUuid}
        roomList={availabilitySearchs?.data}
        availabilitySearchsPendings={availabilitySearchs?.isPending}
        ratePlanUuid={ratePlanUuid}
      />

      <RoomDowngradeModal
        isOpen={roomDowngrade}
        onClose={() => setRoomDowngrade(false)}
        record={selectedData}
        roomDowngradeUuid={roomDowngradeUuid}
        roomList={availabilitySearchs?.data}
        availabilitySearchsPendings={availabilitySearchs?.isPending}
        ratePlanUuid={ratePlanUuid}
      />
    </div>
  );
};

export default RoomInformationTable;
