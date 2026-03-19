import React, { useEffect, useState } from "react";
import GuestTable from "./Components/GuestTable";
import GuestForm from "./Components/GuestForm/GuestForm";
import ReservationHeader from "../Reservation/ReservationHeader";
import ReservationMenu from "../Reservation/ReservationMenu";
import ReservationListHeader from "../../component/ReservationHeader/ReservationListHeader";

const GuestList = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);

  const handleAddGuest = () => {
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
          onAddGuest={handleAddGuest}
          addButtonText={"Add Guest"}
        />
      </div>

      <GuestTable />
      <GuestForm
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        mode={mode}
      />
    </div>
  );
};

export default GuestList;
