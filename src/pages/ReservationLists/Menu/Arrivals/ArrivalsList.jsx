import React, { useState } from "react";
import ReservationListMenu from "../../Components/ReservationListMenu";
import ReservationSearchBar from "../../Components/ReservationSearchBar";
import ArrivalsGrid from "./Components/ArrivalsGrid";
import ArrivalsTable from "./Components/ArrivalsTable";

const ArrivalsList = () => {
  const [view, setView] = useState("grid");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [keyword, setKeyword] = useState(null);

  return (
    <div>
      <ReservationListMenu view={view} onViewChange={(mode) => setView(mode)} />
      <div className="w-full px-6">
        <ReservationSearchBar
          searchPlaceholder="Search ....."
          keyword={keyword}
          setKeyword={setKeyword}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />

        {view === "grid" ? <ArrivalsGrid /> : <ArrivalsTable />}
      </div>
    </div>
  );
};

export default ArrivalsList;
