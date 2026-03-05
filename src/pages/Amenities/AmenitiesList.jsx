import React, { useEffect, useState } from "react";
import { LIMITS } from "../../variables/constants";
import ContentBanner from "../../component/ContentBanner/ContentBanner";
import FilterBar from "../../component/FilterBar/FilterBar";
import useApiQuery from "../../hooks/useApiQuery";
import { amenitiesListFun } from "../../api/amenitiesFunctionApi";
import AmenitiesTable from "./Components/AmenitiesTable";
import AmenitiesForm from "./Components/AmenitiesForm/AmenitiesForm";

const AmenitiesList = () => {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [drawerOpen,setDrawerOpen] = useState(false);

  const normalStatus = status === "all" ? null : status;

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "amenities",
    fetchQueryFunction: amenitiesListFun ,
    params: {
      pagination: {
        page: page,
        perPage:perPage,
      },
      keyword,
      status: normalStatus,
    },
  });


  useEffect(()=>{
    setPage(1)
  },[keyword,status,perPage])

  return (
    <div className="w-full px-6 py-2">
      

      <ContentBanner
        title="Amenities"
        btntext="Create Amenities "
        setDrawerOpen={setDrawerOpen}
      />

      <FilterBar
        keyword={keyword}
        setKeyword={setKeyword}
        status={status}
        setStatus={setStatus}
        isProduct={false}
      />

      <AmenitiesTable
        data={data?.data || []}
        page={data?.pagination.currentPage}
        perPage={data?.pagination.perPage}
        total={data?.pagination?.total}
        changePage={(page) => setPage(page)}
        changePerPage={(perPage) =>setPerPage(perPage)}
      />

      <AmenitiesForm
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        mode="add"
      />
    </div>
  )
};


export default AmenitiesList;