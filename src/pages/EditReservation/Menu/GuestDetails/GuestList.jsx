import React, { useEffect, useState } from "react";
import ReservationHeader from "../../Components/ReservationHeader";
import ReservationMenu from "../../Components/ReservationMenu";
import GuestTable from "./Components/GuestTable";
import GuestForm from "./Components/GuestForms/GuestForm";

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
        <div className="text-sm mb-6 mt-1.5">
          Reservation id: <strong> 1212122 </strong>
        </div>
      </div>

      <GuestTable />
      
      {/* <GuestForm
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        mode={mode}
      /> */}
    </div>
  );
};

export default GuestList;
