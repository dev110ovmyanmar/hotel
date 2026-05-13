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

  const { data, isLoading } = useApiQuery({
    fetchQueryName: "reservation-room",
    fetchQueryFunction: reservationRoomList,
    params: {
      pagination: {
        page: page,
        perPage: perPage,
      },
      keyword,
      reservation: {
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

      <ReservationMenu />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ReservationListHeader
          reservationId={data?.reservation?.reservationNo}
          onAddreservation={handleAddRoom}
          addButtonText={"Add New Room"}
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
      />
      <RoomInformationForm
        drawerOpen={drawerOpen}
        // setDrawerOpen={setDrawerOpen}
        mode={mode}
      />
    </div>
  );
};

export default RoomInformationList;
