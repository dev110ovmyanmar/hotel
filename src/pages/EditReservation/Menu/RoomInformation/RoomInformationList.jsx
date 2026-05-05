import React, { useEffect, useState } from "react";
import ReservationHeader from "../../Components/ReservationHeader";
import ReservationMenu from "../../Components/ReservationMenu";
import ReservationListHeader from "../../../../component/ReservationHeader/ReservationListHeader";
import RoomAttributeTable from "../../../RoomAttribute/Components/RoomAttributeTable";
import RoomInformationTable from "./Components/RoomInformationTable";
import RoomInformationForm from "./Components/RoomInformationForms/RoomInformationForm";

const RoomInformationList = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);

  const handleAddRoom = () => {
    setSelectedData(null);
    setMode("add");
    setDrawerOpen(true);
  };

  return (
    <div className="w-full px-6 py-2">
      <ReservationHeader />
      <ReservationMenu />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ReservationListHeader
          reservationId="123212321"
          onAddreservation={handleAddRoom}
          addButtonText={"Add New Room"}
        />
      </div>

      <RoomInformationTable />
      <RoomInformationForm
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        mode={mode}
      />
    </div>
  );
};

export default RoomInformationList;
