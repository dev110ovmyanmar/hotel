import React, { useEffect, useState } from "react";
import { LIMITS } from "../../variables/constants";
import useApiQuery from "../../hooks/useApiQuery";
import ListHeader from "../../component/ListHeader/ListHeader";
import { PERMISSIONS } from "../../variables/permission";
import RoomRestrictionTable from "./Components/RoomRestrictionTable";
import { fetchRoomRestriction } from "./../../api/roomrestriction";
import RoomRestrictionForm from "./Components/RoomRestrictionForms/RoomRestrictionForm";

const RoomRestrictionList = () => {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const filter = {};
  if (startDate && endDate) {
    filter.startDate = startDate;
    filter.endDate = endDate;
  }

  const { data } = useApiQuery({
    fetchQueryName: "roomRestriction",
    fetchQueryFunction: fetchRoomRestriction,
    params: {
      filter,
      keyword,
    },
  });

  useEffect(() => {
    setPage(1);
  }, [keyword, perPage, startDate, endDate]);

  const handleAdd = () => {
    setSelectedData(null);
    setMode("add");
    setDrawerOpen(true);
  };

  return (
    <div className="w-full px-6 py-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ListHeader
          searchPlaceholder="Search Extra Room Restriction ..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText="Add New Room Restriction"
          onAdd={handleAdd}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          // permission={PERMISSIONS.ROOM_RESTRICTION_CREATE}
        />
      </div>

      <RoomRestrictionTable data={data?.data || []} />

      <RoomRestrictionForm
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        page={page}
        setMode={setMode}
        setPage={setPage}
        mode={mode}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
      />
    </div>
  );
};

export default RoomRestrictionList;
