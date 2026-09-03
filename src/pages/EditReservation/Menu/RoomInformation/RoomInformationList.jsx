import React, { useEffect, useState } from "react";
import ReservationHeader from "../../Components/ReservationHeader";
import ReservationMenu from "../../Components/ReservationMenu";
import ReservationListHeader from "../../../../component/ReservationHeader/ReservationListHeader";
import RoomInformationTable from "./Components/RoomInformationTable";
import RoomInformationForm from "./Components/RoomInformationForms/RoomInformationForm";
import {
  useParams,
  useNavigate,
} from "react-router-dom";
import AssignRoomForm from "./Components/RoomInformationForms/AssignRoomForm";
import { Button } from "antd";
import ChangeStatusForm from "../../../BookingDetail/Components/BookingDetailForms/ChangeStatusForm";
import Loader from "../../../../component/Loader/Loader";
import { reservationRoomList } from "../../../../api/reservationSectionApi";
import useApiQuery from "../../../../hooks/useApiQuery";
import { LIMITS } from "../../../../variables/constants";

const RoomInformationList = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();

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
  const [open, setOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedRoomUuid, setSelectedRoomUuid] = useState(bookingId);

    useEffect(() => {
    if (bookingId) {
      setSelectedRoomUuid(bookingId);
    }
  }, [bookingId]);

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
      reservationRoom: { uuid: selectedRoomUuid },
    },
    options: {
      enabled: !!bookingId && bookingId.trim().length >= 32,
    },
  });

  useEffect(() => {
    if (bookingId && listData?.reservation?.reservationNo) {
      sessionStorage.setItem(
        `breadcrumb_${bookingId}`,
        listData.reservation.reservationNo,
      );
      window.dispatchEvent(new Event("breadcrumb_updated"));
    }
  }, [listData, bookingId]);

   useEffect(() => {
    if (listData?.reservationRoom) {
      setSelectedRoom(listData.reservationRoom);
    }
  }, [listData]);

  const handleSelectRow = (roomRecord) => {
  setSelectedRoom(roomRecord);
  const nextUuid = roomRecord?.uuid;
  if (!nextUuid) return;
  setSelectedRoomUuid(nextUuid);
  navigate(`/reservations/${nextUuid}/room-information`);
};

  const headerData = {
    ...listData,
    reservationRoom: selectedRoom || listData?.reservationRoom,
  };

  const handleAddRoom = () => {
    setSelectedData(null);
    setMode("add");
    setDrawerOpen(true);
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
      <ReservationHeader data={headerData} />
      <ReservationMenu data={headerData} selectedRoomUuid={selectedRoomUuid}/>
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
        loading={isListLoading}
        reservationUuid={{
          ...listData,
          reservationRoom: selectedRoom || listData?.reservationRoom,
        }}
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
