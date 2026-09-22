import { useEffect, useState } from "react";
import { LIMITS } from "../../variables/constants";
import useApiQuery from "../../hooks/useApiQuery";
import ListHeader from "../../component/ListHeader/ListHeader";
import SeasonalRateForm from "./Components/SeasonalRateForms/SeasonalRateForm";
import SeasonalRateTable from "./Components/SeasonalRateTable";
import { fetchSeasonlRate } from "../../api/seasonalRateApi";
import { PERMISSIONS } from "../../variables/permission";

const SeasonalRateList = () => {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const normalStatus = status === "all" ? null : status;
  const filter = {};
  if (startDate && endDate) {
    filter.startDate = startDate;
    filter.endDate = endDate;
  }
  const { data, isFetching } = useApiQuery({
    fetchQueryName: "SeasonlRate",
    fetchQueryFunction: fetchSeasonlRate,
    params: {
      filter,
      keyword,
      status: normalStatus,
    },
  });

  const seasonalRoomTypeData = data?.data?.map((item) => ({
    ...item.roomType,
    rates: item.rates,
  }));

  useEffect(() => {
    setPage(1);
  }, [keyword, status, perPage]);

  const handleAdd = () => {
    setSelectedData(null);
    setMode("add");
    setDrawerOpen(true);
  };

  return (
    <div className="w-full px-6 py-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ListHeader
          searchPlaceholder="Search Room Type Rate ..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText="Add New Room Type Rate"
          onAdd={handleAdd}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          permission={PERMISSIONS.SEASONAL_RATE_CREATE}
        />
      </div>

      <SeasonalRateTable
        data={seasonalRoomTypeData || []}
        loading={isFetching}
      />

      <SeasonalRateForm
        page={page}
        setPage={setPage}
        mode={mode}
        setMode={setMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
      />
    </div>
  );
};

export default SeasonalRateList;
