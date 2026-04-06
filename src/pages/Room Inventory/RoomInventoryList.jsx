import React, { useEffect, useState } from "react";
import { LIMITS } from "../../variables/constants";
import useApiQuery from "../../hooks/useApiQuery";
import ListHeader from "../../component/ListHeader/ListHeader";
import RoomInventoryForm from "./Components/RoomInventoryForm/RoomInventoryForm";
import RoomInventoryTable from "./Components/RoomInventoryTable";
import { getAvailabilityCalendar } from "../../api/availabilityCalendarApi";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const RoomInventoryList = () => {
  const { RangePicker } = DatePicker;
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  // const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [perPage, setPerPage] = useState(13);
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

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "availabilty-calendars",
    fetchQueryFunction: getAvailabilityCalendar,
    params: {
      filter,
      keyword,
    },
  });

  const roomTypeData = data?.data.map(item => ({
    ...item.roomType,
    rates: item.rates
  }));

  useEffect(() => {
    setPage(1);
  }, [keyword, perPage, startDate, endDate]);

  return (
    <div className="w-full px-6 py-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ListHeader
          searchPlaceholder="Search availabiliy calendar..."
          keyword={keyword}
          setKeyword={setKeyword}
          showCreateButton={false}
        />

        <div className="w-full md:w-80">
          <RangePicker
            style={{ width: "100%" }}
            onChange={(dates) => {
              if (dates) {
                setStartDate(dayjs(dates[0]).format("YYYY-MM-DD"));
                setEndDate(dayjs(dates[1]).format("YYYY-MM-DD"));
              } else {
                setStartDate(null);
                setEndDate(null);
              }
            }}
          />
        </div>
      </div>

      <RoomInventoryTable
        data={roomTypeData || []}
        loading={isLoading}
      />

      <RoomInventoryForm
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        page={page}
        setPage={setPage}
        mode={mode}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
      />
    </div>
  );
};

export default RoomInventoryList;
