import React, { useEffect, useState } from "react";
import { LIMITS } from "../../variables/constants";
import useApiQuery from "../../hooks/useApiQuery";
import MeanPlanTable from './Components/MeanPlanTable';
import MeanPlanForm from './Components/MealPlanForm/MealPlanForm';
import ListHeader from './../../component/ListHeader/ListHeader';
import { fetchMealPlan } from './../../api/mealPlanApi';

const MeanPlanList = () => {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("");
  const [selectedData, setSelectedData] = useState(null);

  const normalStatus = status === "all" ? null : status;

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "mealPlans",
    fetchQueryFunction: fetchMealPlan,
    params: {
      pagination: {
        page: page,
        perPage: perPage,
      },
      keyword,
      status: normalStatus,
    },
  });

  useEffect(() => {
    setPage(1)
  }, [keyword, status, perPage]);

  const handleAdd = () => {
    setDrawerOpen(true);
    setSelectedData({});
    setMode("add");
  }

  return (
    <div className="w-full px-6 py-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ListHeader
          title="Meal Plan List"
          searchPlaceholder="Search Meal Plan ..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText="Add New Meal Plan"
          onAdd={handleAdd}
        />
      </div>


      <MeanPlanTable
        data={data?.data || []}
        page={data?.pagination.currentPage}
        perPage={data?.pagination.perPage}
        total={data?.pagination?.total}
        changePage={(page) => setPage(page)}
        changePerPage={(perPage) => setPerPage(perPage)}
        loading={isLoading}
      />

      <MeanPlanForm
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        page={page}
        setPage={setPage}
        mode={mode}
        setMode={setMode}
        selectedData={selectedData}
        setSelectedData={setSelectedData}

      />
    </div>
  )
};


export default MeanPlanList;