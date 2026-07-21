import React, { useState, useEffect } from "react";
import { getSuppliers } from "../../api/supplierApi";
import useApiQuery from "../../hooks/useApiQuery";
import ListHeader from "../../component/ListHeader/ListHeader";
import SupplierForm from "./components/SupplierForm";
import { LIMITS } from "../../variables/constants";
import { PERMISSIONS } from "../../variables/permission";
import { queryClient } from "../../app/queryClient";
import SupplierTable from "./components/SupplierTable";

const SupplierListing = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentMode, setCurrentMode] = useState("add");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch List Data
  const { data, isLoading } = useApiQuery({
    fetchQueryName: "suppliers",
    fetchQueryFunction: getSuppliers,
    params: {
      pagination: {
        page: page,
        perPage: perPage,
      },
      keyword,
    },
  });

  const initData = queryClient.getQueryData(["initData", "authenticated"]);

  const statusOptions =
    initData?.statuses?.status
      ?.filter((item) => item.name.toLowerCase() !== "blocked")
      ?.map((item) => ({
        value: item.uuid,
        label: item.name,
      })) || [];

  const suppliers = data?.data || [];

  // Reset page to 1 when searching
  useEffect(() => {
    setPage(1);
  }, [keyword, perPage]);

  // Handlers
  const handleAdd = () => {
    setSelectedRow(null);
    setCurrentMode("add");
    setDrawerOpen(true);
  };

  const handleView = (record) => {
    setSelectedRow(record);
    setCurrentMode("view");
    setDrawerOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedRow(record);
    setCurrentMode("edit");
    setDrawerOpen(true);
  };

  return (
    <div className="w-full px-6 py-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ListHeader
          title="Suppliers List"
          searchPlaceholder="Search Supplier..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText="Add New Supplier"
          onAdd={handleAdd}
          permission={PERMISSIONS.SUPPLIER_CREATE}
        />
      </div>

      <SupplierTable
        dataSource={suppliers}
        onView={handleView}
        onEdit={handleEdit}
        loading={isLoading}
        page={data?.pagination?.currentPage || page}
        perPage={data?.pagination?.perPage || perPage}
        total={data?.pagination?.total}
        changePage={(page) => setPage(page)}
        changePerPage={(perPage) => setPerPage(perPage)}
      />

      <SupplierForm
        mode={currentMode}
        setMode={setCurrentMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setPage={setPage}
        page={data?.pagination?.currentPage}
        statusOptions={statusOptions}
      />
    </div>
  );
};

export default SupplierListing;
