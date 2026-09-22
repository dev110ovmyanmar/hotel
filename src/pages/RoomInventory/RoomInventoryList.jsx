import React, { useEffect, useState } from "react";
import { LIMITS } from "../../variables/constants";
import useApiQuery from "../../hooks/useApiQuery";
import ListHeader from "../../component/ListHeader/ListHeader";
import RoomInventoryForm from "./Components/RoomInventoryForm/RoomInventoryForm";
import RoomInventoryTable from "./Components/RoomInventoryTable";
import { getAvailabilityCalendar } from "../../api/availabilityCalendarApi";
import { PERMISSIONS } from "../../variables/permission";
import RoomInventoryCreateForm from "./Components/RoomInventoryForm/RoomInventoryCreateForm";

const RoomInventoryList = () => {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);

  const filter = {};
  if (startDate && endDate) {
    filter.startDate = startDate;
    filter.endDate = endDate;
  }

  const { data, isFetching, error } = useApiQuery({
    fetchQueryName: "availabilty-calendars",
    fetchQueryFunction: getAvailabilityCalendar,
    params: {
      filter,
      keyword,
    },
  });

  const roomTypeData = data?.data.map((item) => ({
    ...item.roomType,
    calendars: item.calendars,
  }));

  const handleAdd = () => {
    setSelectedData(null);
    setMode("add");
    setDrawerOpen(true);
  };

  useEffect(() => {
    setPage(1);
  }, [keyword, perPage, startDate, endDate]);

  return (
    <div className="w-full px-6 py-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ListHeader
          searchPlaceholder="Search Room Inventory..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText="Add New Room Inventory"
          onAdd={handleAdd}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          permission={PERMISSIONS.AVAILABILITY_CALENDAR_CREATE}
        />
      </div>

      <RoomInventoryTable data={roomTypeData || []} loading={isFetching}/>

      {mode === "add" ? (
        <RoomInventoryCreateForm
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          page={page}
          setPage={setPage}
          mode={mode}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
        />
      ) : (
        <RoomInventoryForm
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          page={page}
          setPage={setPage}
          mode={mode}
          selectedData={selectedData}
          setSelectedData={setSelectedData}
        />
      )}
    </div>
  );
};

export default RoomInventoryList;
