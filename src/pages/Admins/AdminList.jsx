import React, { useEffect, useState } from "react";
import AdminTable from "./Components/AdminTable";
import AdminForm from "./Components/AdminForm/AdminForm";
import { LIMITS } from "../../variables/constants";
import ContentBanner from "../../component/ContentBanner/ContentBanner";
import FilterBar from "../../component/FilterBar/FilterBar";
import useApiQuery from "../../hooks/useApiQuery";
import { adminListFunApi } from "../../api/adminFunApi";

const AdminList = () => {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const normalStatus = status === "all" ? null : status;

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "admins",
    fetchQueryFunction: adminListFunApi,
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
        title="Admin List"
        btntext="Create Admin"
        setDrawerOpen={setDrawerOpen}
      />

      <FilterBar
        keyword={keyword}
        setKeyword={setKeyword}
        status={status}
        setStatus={setStatus}
        isProduct={false}

      />

      <AdminTable
        data={data?.data || []}
        page={data?.pagination.currentPage}
        perPage={data?.pagination.perPage}
        total={data?.pagination?.total}
        changePage={(page) => setPage(page)}
        changePerPage={(perPage) =>setPerPage(perPage)}
      />

      <AdminForm
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        mode="add"
      />

    </div>
  )
};


export default AdminList;