import React, { useEffect, useState } from "react";
import AdminTable from "./Components/AdminTable";
import AdminForm from "./Components/AdminForm/AdminForm";
import { LIMITS } from "../../variables/constants";
import useApiQuery from "../../hooks/useApiQuery";
import { adminFunctionApi } from "../../api/adminFunctionApi";
import ListHeader from "../../component/ListHeader/ListHeader";

const AdminList = () => {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);

  const normalStatus = status === "all" ? null : status;

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "admins",
    fetchQueryFunction: adminFunctionApi,
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
          title="Admin List"
          searchPlaceholder="Search Admin ..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText="Add New Admin"
          onAdd={handleAdd}
        />
      </div>

      <AdminTable
        data={data?.data || []}
        page={data?.pagination.currentPage}
        perPage={data?.pagination.perPage}
        total={data?.pagination?.total}
        changePage={(page) => setPage(page)}
        changePerPage={(perPage) => setPerPage(perPage)}
      />

      <AdminForm
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        setPage={setPage}
        mode={mode}
        setMode={setMode}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        width={500}
      />
    </div>
  );
};

export default AdminList;
