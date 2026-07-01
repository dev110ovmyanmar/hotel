import React, { useEffect, useState } from "react";
import ReservationHeader from "../../Components/ReservationHeader";
import ReservationMenu from "../../Components/ReservationMenu";
import ReservationListHeader from "../../../../component/ReservationHeader/ReservationListHeader";
import RoomAttributeTable from "../../../RoomAttribute/Components/RoomAttributeTable";
import RoomInformationTable from "./Components/RoomInformationTable";
import RoomInformationForm from "./Components/RoomInformationForms/RoomInformationForm";
import { reservationRoomList } from "../../../../api/reservationSectionApi";
import useApiQuery from "../../../../hooks/useApiQuery";
import {
  useLocation,
  useParams,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { LIMITS } from "../../../../variables/constants";
import AssignRoomForm from "./Components/RoomInformationForms/AssignRoomForm";
import { Button } from "antd";
import ChangeStatusForm from "../../../BookingDetail/Components/BookingDetailForms/ChangeStatusForm";
import Loader from "../../../../component/Loader/Loader";

const RoomInformationList = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const uuid = bookingId; // assigned directly to your uuid variable

  // ROUTING GUARD: Kick out unassigned, empty, or partial/mangled IDs instantly
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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [assignRoomOpen, setAssignRoomOpen] = useState(false);
  const [showRoomResults, setShowRoomResults] = useState(false);
  const [open, setOpen] = useState(false);

  const { data, isLoading, refetch } = useApiQuery({
    fetchQueryName: "reservation-room",
    fetchQueryFunction: reservationRoomList,
    params: {
      pagination: {
        page: page,
        perPage: perPage,
      },
      keyword,
      reservationRoom: {
        uuid: uuid,
      },
    },
    options: {
      enabled: !!bookingId && bookingId.trim().length >= 32,
    },
  });

  useEffect(() => {
    if (bookingId && data?.reservation?.reservationNo) {
      sessionStorage.setItem(
        `breadcrumb_${bookingId}`,
        data.reservation.reservationNo,
      );
      window.dispatchEvent(new Event("breadcrumb_updated"));
    }
  }, [data, bookingId]);

  const handleAddRoom = () => {
    setSelectedData(null);
    setMode("add");
    setDrawerOpen(true);
  };

   if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-2">
      <ReservationHeader data={data || {}} />

      <ReservationMenu data={data} />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ReservationListHeader
          reservationId={data?.reservation?.reservationNo}
          onAddreservation={handleAddRoom}
          // addButtonText={
          //   ["confirmed", "checked_in"].includes(
          //     data?.reservationRoom?.roomStatus?.code?.toLowerCase(),
          //   )
          //     ? "Add New Room"
          //     : null
          // }
          addButtonText={"Add New Room"}
        />
      </div>
      <Button className="custom-blue-btn mb-2" onClick={() => setOpen(true)}>
        Change Status
      </Button>

      {open && (
        <ChangeStatusForm
          open={open}
          onClose={() => setOpen(false)}
          reservationId={data?.reservationNo}
          reservationDetails={data}
        />
      )}

      <RoomInformationTable
        data={data?.data || []}
        reservation={data?.reservation}
        page={page}
        perPage={perPage}
        total={data?.pagination?.total}
        changePage={setPage}
        changePerPage={setPerPage}
        loading={isLoading}
        reservationUuid={data || []}
      />
      <RoomInformationForm
        data={data?.reservation || []}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        mode={mode}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        onSuccess={refetch}
      />

      {assignRoomOpen && (
        <AssignRoomForm
          data={data?.data || []}
          open={assignRoomOpen}
          onClose={() => setAssignRoomOpen(false)}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
          reservationUuid={data || []}
        />
      )}

      {showRoomResults && (
        <GetRoomForm
          data={data?.data || []}
          open={showRoomResults}
          onClose={() => setShowRoomResults(false)}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
        />
      )}
    </div>
  );
};

export default RoomInformationList;
