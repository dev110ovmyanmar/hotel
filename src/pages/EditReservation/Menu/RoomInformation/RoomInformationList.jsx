import React, { useEffect, useState } from "react";
import ReservationHeader from "../../Components/ReservationHeader";
import ReservationMenu from "../../Components/ReservationMenu";
import ReservationListHeader from "../../../../component/ReservationHeader/ReservationListHeader";
import RoomAttributeTable from "../../../RoomAttribute/Components/RoomAttributeTable";
import RoomInformationTable from "./Components/RoomInformationTable";
import RoomInformationForm from "./Components/RoomInformationForms/RoomInformationForm";
import { reservationRoomList } from "../../../../api/reservationSectionApi";
import useApiQuery from "../../../../hooks/useApiQuery";
import { useLocation } from "react-router-dom";
import { LIMITS } from "../../../../variables/constants";
import AssignRoomForm from "./Components/RoomInformationForms/AssignRoomForm";

const RoomInformationList = () => {
  const location = useLocation();
  const uuid = location.state?.bookingId;

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
  });

  const handleAddRoom = () => {
    setSelectedData(null);
    setMode("add");
    setDrawerOpen(true);
  };
  return (
    <div className="w-full px-6 py-2">
      <ReservationHeader data={data || {}} />

      <ReservationMenu data={data} />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ReservationListHeader
          reservationId={data?.reservation?.reservationNo}
          onAddreservation={handleAddRoom}
          addButtonText={
            ["confirmed", "checked_in"].includes(
              data?.reservationRoom?.roomStatus?.code?.toLowerCase(),
            )
              ? "Add New Room"
              : null
          }
        />
      </div>

      <RoomInformationTable
        data={data?.data || []}
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
