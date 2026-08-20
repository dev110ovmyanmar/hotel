import { useState, useEffect } from "react";
import { Dropdown, Table } from "antd";
import dayjs from "dayjs";
import { PlusOutlined, MessageOutlined, EyeOutlined } from "@ant-design/icons";
import { CalendarPlus2 } from "lucide-react";
import { IoOptionsSharp } from "react-icons/io5";
import { Bs0Circle, BsPeople } from "react-icons/bs";
import RoomInformationForm from "./RoomInformationForms/RoomInformationForm";
import AssignRoomForm from "./RoomInformationForms/AssignRoomForm";
import NoteDrawer from "./RoomInformationForms/NoteDrawer";
import ColorStatusTag from "../../../../../component/ColorStatusTag/ColorStatusTag";
import RoomAmend from "./RoomInformationForms/RoomAmend";
import { queryClient } from "../../../../../app/queryClient";
import DateChangeModal from "./RoomAmendmentModals/DateChangeModals";
import StayExtensionModal from "./RoomAmendmentModals/StayExtensionModal";
import StayReductionModal from "./RoomAmendmentModals/StayReductionModal";
import GuestForm from "../../GuestDetails/Components/GuestForms/GuestForm";
import GuestListDrawer from "./RoomInformationForms/GuestListDrawer";
import RoomMoveModal from "./RoomAmendmentModals/RoomMoveModal";
import GuestUploadDrawer from "../../GuestDetails/Components/GuestForms/GuestUploadDrawer";
import UpdateRateModal from "./RoomAmendmentModals/UpdateRateModal";
import RoomUpgradeModal from "./RoomAmendmentModals/RoomUpgradeModal";
import RoomDowngradeModal from "./RoomAmendmentModals/RoomDowngradeModal";
import PriceTag from "../../../../../component/PriceTag/PriceTag";
import AddRoomWithExtensionDateModal from "./RoomAmendmentModals/AddRoomWithExtensionDateModal";
import SingleRoomComplimentaryUpdateModal from "./ComplimentaryModals/SingleRoomComplimentaryUpdateModal";
import RoomInformationDetailsForm from "./RoomInformationForms/RoomInformationDetailsForm";
import AddExtraAmenitiesModal from "./Extra/AddExtraAmenitiesModal";
import DailyOccupactionsTableDrawer from "./RoomInformationForms/DailyOccupactionsTableDrawer";

import { useApiMutation } from "../../../../../hooks/useApiMutation";
import { availabilitySearch } from "../../../../../api/reservationSectionApi";

import { getAmendReservationMenuItems } from "./AmendReservationList";

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

  const formattedData = data.map(item => ({
    ...item,
    children: Array.isArray(item.children) ? item.children : null
  }));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);
  const [guestListOpen, setGuestListOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [roomMoveOpen, setRoomMoveOpen] = useState(false);
  const [assignRoomOpen, setAssignRoomOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [roomAmend, setRoomAmend] = useState(false);
  const [guestFormMode, setGuestFormMode] = useState("add");
  const [selectedGuestData, setSelectedGuestData] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedUploadRow, setSelectedUploadRow] = useState(null);
  const [roomUpgrade, setRoomUpgrade] = useState(false);
  const [roomDowngrade, setRoomDowngrade] = useState(false);
  const [ratePlanUuid, setRatePlanUuid] = useState();
  const [addRoomWithStayExtension, setAddRoomWithStayExtension] =
    useState(false);
  const [dailyOccupactionsTableDrawerOpen, setDailyOccupactionsTableDrawerOpen] = useState(false);

  const [compOpen, setCompOpen] = useState(false);
  const [addExtraBedOpen, setExtraBedOpen] = useState(false);
  const [reservationRoomUuid, setReservationRoomUuid] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const amendmentType = initData?.statuses?.amendment_type;

  const stayExtensionUuid = amendmentType?.find(
    (item) => item.code === "stay_extension",
  )?.uuid;
  const stayReductionUuid = amendmentType?.find(
    (item) => item.code === "stay_reduction",
  )?.uuid;
  const rateChangeUuid = amendmentType?.find(
    (item) => item.code === "rate_change",
  )?.uuid;
  const roomMoveUuid = amendmentType?.find(
    (item) => item.code === "room_move",
  )?.uuid;
  const roomUpgradeUuid = amendmentType?.find(
    (item) => item.code === "room_upgrade",
  )?.uuid;
  const roomDowngradeUuid = amendmentType?.find(
    (item) => item.code === "room_downgrade",
  )?.uuid;
  const addRoomUuid = amendmentType?.find(
    (item) => item.code === "add_room",
  )?.uuid;
  const dateChangeUuid = amendmentType?.find(
    (item) => item.code === "date_change",
  )?.uuid;
  console.log(amendmentType,"dateChangeUuid")

  const availabilitySearchs = useApiMutation({
    mutationFn: availabilitySearch,
    invalidateKeys: [["availability-search"]],
  });

  const handleAction = (key, record) => {
    setSelectedData(record);
    setActiveModal(key);

    const checkinDate = dayjs().startOf("day");
    const checkoutDate = dayjs(record?.checkoutDate).startOf("day");
    const totalNights = checkoutDate.diff(checkinDate, "day", true);

    const modifiedValues = {
      reservation: { uuid: reservation?.uuid },
      filter: {
        checkinDate: dayjs().format("YYYY-MM-DD"),
        checkoutDate: dayjs(record?.checkoutDate).format("YYYY-MM-DD"),
      },
      totalNight: totalNights,
      rank: record?.roomType?.rank,
      amendmentType: {
        code: key === "room_downgrade" ? "room_downgrade" : "room_upgrade",
      },
    };

    if (["room_upgrade", "room_downgrade"].includes(key)) {
      availabilitySearchs.mutate(modifiedValues);
    }
  };

  const closeModal = () => setActiveModal(null);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 70 },
    {
      title: "Room No",
      key: "room",
      dataIndex: "room",
      width: 130,
      render: (text, record) => {
        const isRoomNull = !text;
        const isClickable =
          record?.assignStatus === true && !record?.expiredStatus;
        const shouldHighlightRoom =
          !isRoomNull && record?.assignStatus === true;

        return (
          <span
            style={{
              color: isRoomNull
                ? isClickable
                  ? "#1890ff"
                  : "#bfbfbf"
                : shouldHighlightRoom
                  ? "#1890ff"
                  : "inherit",
              cursor:
                isClickable || shouldHighlightRoom ? "pointer" : "not-allowed",
              textDecoration:
                isClickable || shouldHighlightRoom ? "underline" : "none",
            }}
            onClick={(e) => {
              if (isClickable || shouldHighlightRoom) {
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
    { title: "Room Type", dataIndex: ["roomType", "name"], key: "name" },
    { title: "Rate Plan", dataIndex: ["ratePlan", "name"], key: "ratePlan" },
    {
      title: "Check In",
      dataIndex: "checkinDate",
      key: "checkinDate",
      render: (value) => (value ? dayjs(value).format("YYYY-MM-DD") : "-"),
      width: 110,
    },
    {
      title: "Check Out",
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
    {
      title: "Total Charges",
      dataIndex: "grandTotal",
      align: "center",
      key: "grandTotal",
      render: (value) => (
        <div className="flex justify-end items-center gap-1">
          <PriceTag value={value} />
          <span className=" font-medium">MMK</span>
        </div>
      ),
      width: 150,
    },
    {
      title: "Action",
      width: 80,
      render: (_, record) => {
        const rawCode = record?.roomStatus?.code || "";
        const enableComplimentaryUpdateButton = record?.roomStatus?.code == "checked_in" || record?.roomStatus?.code == "confirmed";
        const statusCode = rawCode.toLowerCase().replace("-", "_");
        if (["cancelled", "no_show"].includes(statusCode)) {
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

        const baseMenuItems = [
          {
            key: "view",
            label: "View Details",
            icon: <EyeOutlined />,
            onClick: () => {
              setSelectedData(record);
              setMode("view");
              setDetailsDrawerOpen(true);
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
          {
            key: "roomComp",
            label: "Room Complimentary",
            icon: <Bs0Circle />,
            onClick: () => {
              setReservationRoomUuid(record.uuid);
              setCompOpen(true);
            },
            hidden: !enableComplimentaryUpdateButton,
          },
          // {
          //   key: "addExtra",
          //   label: "Extra",
          //   icon: <PlusOutlined />,
          //   onClick: () => {
          //     setSelectedData(record);
          //     setExtraBedOpen(true);
          //   },
          // },
          {
            key: "dailyOccupaction",
            label: "Daily Occupaction",
            icon: <CalendarPlus2 className="w-4 h-4" />,
            onClick: () => {
              setSelectedData(record);
              setMode("view");
              setDailyOccupactionsTableDrawerOpen(true);
            },
          },
        ];

        const amendmentItems = getAmendReservationMenuItems({
          record,
          handleAction,
          setRoomMoveOpen,
          setRoomUpgrade,
          setRoomDowngrade,
          setAddRoomWithStayExtension,
          setRatePlanUuid,
          setGuestOpen,
          setSelectedData,
        });

        const menuItems = [...baseMenuItems, ...amendmentItems];

        return (
          <Dropdown
            menu={{ items: menuItems, style: { minWidth: "200px" } }}
            trigger={["click"]}
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
        dataSource={formattedData}
        rowKey="uuid"
        rowClassName={(record) =>
          record?.uuid === reservationUuid?.reservationRoom?.uuid
            ? "active-reservation-row"
            : ""
        }
        pagination={{
          current: page,
          pageSize: perPage,
          total: total,
          onChange: (p, ps) => {
            changePage(p);
            changePerPage(ps);
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
      <RoomInformationDetailsForm
        drawerOpen={detailsDrawerOpen}
        setDrawerOpen={setDetailsDrawerOpen}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
      />

      <DailyOccupactionsTableDrawer
        drawerOpen={dailyOccupactionsTableDrawerOpen}
        setDrawerOpen={setDailyOccupactionsTableDrawerOpen}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
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
      {guestOpen && (
        <GuestForm
          drawerOpen={guestOpen}
          setDrawerOpen={setGuestOpen}
          mode={guestFormMode}
          setMode={setGuestFormMode}
          guestData={selectedGuestData}
          setSelectedData={setSelectedGuestData}
          roomuuid={reservationUuid?.reservationRoom?.uuid}
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

      {activeModal === "date_change" && selectedData && (
        <DateChangeModal
          isOpen={true}
          onClose={closeModal}
          record={selectedData}
          dateChangeUuid={dateChangeUuid}
        />
      )}
      {activeModal === "stay_extension" && selectedData && (
        <StayExtensionModal
          isOpen={true}
          onClose={closeModal}
          record={selectedData}
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
          rateChangeUuid={rateChangeUuid}
        />
      )}
      {roomMoveOpen && selectedData && (
        <RoomMoveModal
          isOpen={roomMoveOpen}
          onClose={() => {
            setRoomMoveOpen(false);
            setSelectedData(null);
          }}
          record={selectedData}
          roomMoveUuid={roomMoveUuid}
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
      <AddRoomWithExtensionDateModal
        isOpen={addRoomWithStayExtension}
        record={selectedData}
        extensionDateonClose={() => setAddRoomWithStayExtension(false)}
        addRoomUuid={addRoomUuid}
        availabilitySearchs={availabilitySearchs}
        reservation={reservation}
        ratePlanUuid={ratePlanUuid}
      />
      <SingleRoomComplimentaryUpdateModal
        reservationRoomUuid={reservationRoomUuid}
        open={compOpen}
        onCancel={() => setCompOpen(false)}
      />
      <AddExtraAmenitiesModal
        isOpen={addExtraBedOpen}
        onClose={() => setExtraBedOpen(false)}
        record={selectedData}
      />
    </div>
  );
};

export default RoomInformationTable;
