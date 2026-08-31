import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "antd";
import ReservationHeader from "../../Components/ReservationHeader";
import ReservationMenu from "../../Components/ReservationMenu";
import ReservationListHeader from "../../../../component/ReservationHeader/ReservationListHeader";
import RoomInformationTable from "./Components/RoomInformationTable";
import RoomInformationForm from "./Components/RoomInformationForms/RoomInformationForm";
import AssignRoomForm from "./Components/RoomInformationForms/AssignRoomForm";
import ChangeStatusForm from "../../../BookingDetail/Components/BookingDetailForms/ChangeStatusForm";
import Loader from "../../../../component/Loader/Loader";
import { reservationRoomList } from "../../../../api/reservationSectionApi";
import useApiQuery from "../../../../hooks/useApiQuery";
import { LIMITS } from "../../../../variables/constants";

const RoomInformationList = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // Retrieve room UUID from URL parameters on page load/refresh
  const urlRoomUuid = searchParams.get("selectedRoomUuid");

  // ROUTING GUARD: Redirect invalid/malformed IDs instantly
  useEffect(() => {
    const cleanId = bookingId ? bookingId.trim() : "";
    if (
      !cleanId ||
      cleanId === "" ||
      cleanId === ":bookingId" ||
      cleanId.length < 32
    ) {
      navigate("/404", { replace: true });
    }
  }, [bookingId, navigate]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [assignRoomOpen, setAssignRoomOpen] = useState(false);
  const [showRoomResults, setShowRoomResults] = useState(false);
  const [open, setOpen] = useState(false);

  // Initialize selected room state directly from URL query param if available
  const [selectedRoomUuid, setSelectedRoomUuid] = useState(urlRoomUuid || null);

  // 1. MAIN API QUERY: Fetches table room list for current booking ID
  const {
    data: listData,
    isLoading: isListLoading,
    refetch,
  } = useApiQuery({
    fetchQueryName:"reservation-room",
    fetchQueryFunction: reservationRoomList,
    params: {
      pagination: { page, perPage },
      keyword,
      reservationRoom: { uuid: bookingId },
    },
    options: {
      enabled: !!bookingId && bookingId.trim().length >= 32,
    },
  });

  // Automatically sync selected room UUID on fresh loads if URL state is empty
  useEffect(() => {
    if (listData?.data?.length > 0) {
      const defaultUuid =
        urlRoomUuid || listData?.reservationRoom?.uuid || listData?.data[0]?.uuid;

      if (defaultUuid !== selectedRoomUuid) {
        setSelectedRoomUuid(defaultUuid);
        setSearchParams((prev) => {
          prev.set("selectedRoomUuid", defaultUuid);
          return prev;
        }, { replace: true });
      }
    }
  }, [listData, urlRoomUuid]);

  // Update Breadcrumbs
  useEffect(() => {
    if (bookingId && listData?.reservation?.reservationNo) {
      sessionStorage.setItem(
        `breadcrumb_${bookingId}`,
        listData.reservation.reservationNo
      );
      window.dispatchEvent(new Event("breadcrumb_updated"));
    }
  }, [listData, bookingId]);

  // 2. SINGLE ROOM API QUERY: Triggers whenever selectedRoomUuid updates
  const { data: singleRoomData, isLoading: isRoomLoading } = useApiQuery({
    fetchQueryName: "reservation-room-detail", selectedRoomUuid,
    fetchQueryFunction: reservationRoomList,
    params: {
      reservationRoom: { uuid: selectedRoomUuid },
    },
    options: {
      enabled: !!selectedRoomUuid,
    },
  });

  // Handle table row selection: updates state and syncs with URL
  const handleSelectRow = (record) => {
    if (record?.uuid && record.uuid !== selectedRoomUuid) {
      setSelectedRoomUuid(record.uuid);
      setSearchParams((prev) => {
        prev.set("selectedRoomUuid", record.uuid);
        return prev;
      });
    }
  };

  const handleAddRoom = () => {
    setSelectedData(null);
    setMode("add");
    setDrawerOpen(true);
  };

  // Resolve current active room object prioritize single room response over list response
  const activeReservationRoom =
    singleRoomData?.reservationRoom ||
    singleRoomData?.data?.[0] ||
    listData?.reservationRoom;

  // Merged structure to supply Header and Menu with active room state
  const activeRoomFullData = {
    ...listData,
    reservationRoom: activeReservationRoom,
  };

  if (isListLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-2">
      <ReservationHeader data={activeRoomFullData} />
      <ReservationMenu data={activeRoomFullData} />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ReservationListHeader
          reservationId={listData?.reservation?.reservationNo}
          onAddreservation={handleAddRoom}
          addButtonText={"Add New Room"}
        />
      </div>

      <div className="flex gap-2 mb-2">
        <Button className="custom-blue-btn" onClick={() => setOpen(true)}>
          Change Status
        </Button>
      </div>

      {open && (
        <ChangeStatusForm
          open={open}
          onClose={() => setOpen(false)}
          reservationId={listData?.reservationNo}
          reservationDetails={listData}
        />
      )}

      <RoomInformationTable
        data={listData?.data || []}
        reservation={listData?.reservation}
        page={page}
        perPage={perPage}
        total={listData?.pagination?.total}
        changePage={setPage}
        changePerPage={setPerPage}
        loading={isListLoading || isRoomLoading}
        reservationUuid={activeRoomFullData}
        onSelectRow={handleSelectRow}
      />

      <RoomInformationForm
        data={listData?.reservation || []}
        date={listData?.reservationRoom || []}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        mode={mode}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        onSuccess={refetch}
      />

      {assignRoomOpen && (
        <AssignRoomForm
          data={listData?.data || []}
          open={assignRoomOpen}
          onClose={() => setAssignRoomOpen(false)}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
          reservationUuid={listData || []}
        />
      )}
    </div>
  );
};

export default RoomInformationList;