import React, { useEffect, useState } from "react";
import { LIMITS } from "../../variables/constants";
import useApiQuery from "../../hooks/useApiQuery";
import ListHeader from "../../component/ListHeader/ListHeader";
import { PERMISSIONS } from "../../variables/permission";
import ExtraBedRateForm from "./Components/ExtraBedRateForms/ExtraBedRateForm";
import ExtraBedRateTable from "./Components/ExtraBedRateTable";
import { fetchExtraBedRate } from "../../api/exteraBedRateApi";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const ExtraBedRateList = () => {
  const { RangePicker } = DatePicker;
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
    fetchQueryName: "extraBedRate",
    fetchQueryFunction: fetchExtraBedRate,
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
        <div className="w-full md:w-auto">
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
        <ListHeader
          searchPlaceholder="Search Extra Bed Rate ..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText="Add New Extra Bed Rate"
          onAdd={handleAdd}
          permission={PERMISSIONS.EXTRA_BED_RATE_CREATE}
        />
      </div>

      <ExtraBedRateTable data={data?.data || []} />

      <ExtraBedRateForm
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

export default ExtraBedRateList;
