import React, { useEffect, useState } from "react";
import ReservationHeader from "../../Components/ReservationHeader";
import ReservationMenu from "../../Components/ReservationMenu";
import ReservationListHeader from "../../../../component/ReservationHeader/ReservationListHeader";
import EventFacilityOrderTable from "./Components/EventFacilityOrderTable";
import EventFacilityOrderForm from "./Components/EventFacilityOrderForms/EventFacilityOrderForm";

const EventFacilityOrderList = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);

  const handleAddEvent = () => {
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
          onAddreservation={handleAddEvent}
          addButtonText={"Add Event"}
        />
      </div>

      <EventFacilityOrderTable />
      <EventFacilityOrderForm
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        mode={mode}
      />
    </div>
  );
};

export default EventFacilityOrderList;
