// import React, { useState } from "react";
// import GuestTable from "./Components/GuestTable";
// import ReservationMenu from "../Reservation/ReservationMenu";
// import ReservationHeader from "../Reservation/ReservationHeader";
// const GuestList = () => {
//   return (
//     <div>
//       <ReservationHeader />
//       <ReservationMenu />
//       <GuestTable />

//    </div>
//   );
// };

// export default GuestList;
import React, { useEffect, useState } from "react";

import { LIMITS } from "../../variables/constants";

import GuestTable from "./Components/GuestTable";
import GuestForm from "./Components/GuestForm/GuestForm";
import ReservationHeader from "../Reservation/ReservationHeader";
import ReservationMenu from "../Reservation/ReservationMenu";
import ReservationListHeader from "../../component/ReservationHeader/ReservationListHeader";

const GuestList = () => {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentMode, setCurrentMode] = useState("");

  const handleAdd = () => {
    setSelectedData(null);
    setMode("add");
    setDrawerOpen(true);
  };

  const handleAddGuest = () => {
    setSelectedRow(null);
    setCurrentMode("add");
    setOpen(true);
  };

  return (
    <div className="w-full px-6 py-2">
      <ReservationHeader />
      <ReservationMenu />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ReservationListHeader
          reservationId="123212321"
          onAddGuest={handleAddGuest}
        />
      </div>

      <GuestTable
      // data={data?.data || []}
      // page={data?.pagination.currentPage}
      // perPage={data?.pagination.perPage}
      // total={data?.pagination?.total}
      // changePage={(page) => setPage(page)}
      // changePerPage={(perPage) => setPerPage(perPage)}
      />

      <GuestForm
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        setPage={setPage}
        mode={mode}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        width={500}
      />
    </div>
  );
};

export default GuestList;
