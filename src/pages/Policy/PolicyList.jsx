import React, { useEffect, useState } from "react";
import { LIMITS } from "../../variables/constants";
import ContentBanner from "../../component/ContentBanner/ContentBanner";
import FilterBar from "../../component/FilterBar/FilterBar";
import useApiQuery from "../../hooks/useApiQuery";
import PolicyTable from "./Components/PolicyTable";
import PolicyForm from "./Components/PolicyForm/PolicyForm";
import {policyListFun} from "../../api/policyFunctionApi";

const PolicyList = () => {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [drawerOpen,setDrawerOpen] = useState(false);

  const normalStatus = status === "all" ? null : status;

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "policies",
    fetchQueryFunction: policyListFun,
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
        title="Policies"
        btntext="Create Policy"
        setDrawerOpen={setDrawerOpen}
      />

      <FilterBar
        keyword={keyword}
        setKeyword={setKeyword}
        status={status}
        setStatus={setStatus}
        isProduct={false}
      />

      <PolicyTable
        data={data?.data || []}
        page={data?.pagination.currentPage}
        perPage={data?.pagination.perPage}
        total={data?.pagination?.total}
        changePage={(page) => setPage(page)}
        changePerPage={(perPage) =>setPerPage(perPage)}
      />

      <PolicyForm
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        mode="add"
      />
    </div>
  )
};


export default PolicyList;