import React, { useEffect, useState } from "react";
import { LIMITS } from "../../variables/constants";
import useApiQuery from "../../hooks/useApiQuery";
import ListHeader from "../../component/ListHeader/ListHeader";
import RatePlanForm from "./Components/RatePlanForms/RatePlanForm";
import RatePlanTable from "./Components/RatePlanTable";
import { fetchRatePlan } from "../../api/ratePlanApi";
import { PERMISSIONS } from "../../variables/permission";

const RatePlanList = () => {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);

  const normalStatus = status === "all" ? null : status;

  const { data: ratePlanList, isFetching } = useApiQuery({
    fetchQueryName: "ratePlan",
    fetchQueryFunction: fetchRatePlan,
    params: {
      pagination: {
        page: page,
        perPage: perPage,
      },
      keyword,
      status: normalStatus,
    },
  });

  const ratePlanListing = ratePlanList;

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
          title="Rate Plans List"
          searchPlaceholder="Search Rate Plans ..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText="Add New Rate Plans"
          onAdd={handleAdd}
          permission={PERMISSIONS.RATE_PLAN_CREATE}
        />
      </div>

      <RatePlanTable
        data={ratePlanList?.data || []}
        page={ratePlanList?.pagination.currentPage}
        perPage={ratePlanList?.pagination.perPage}
        total={ratePlanList?.pagination?.total}
        changePage={(page) => setPage(page)}
        changePerPage={(perPage) => setPerPage(perPage)}
        loading={isFetching}
        setDrawerOpen={setDrawerOpen}
        setMode={setMode}
        setSelectedData={setSelectedData}
      />

      <RatePlanForm
        page={page}
        setPage={setPage}
        mode={mode}
        setMode={setMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        ratePlanList={ratePlanListing}
      />
    </div>
  );
};

export default RatePlanList;
