import React, { useState, useMemo, useEffect } from "react";
import {
  getUnits, //Api function name
} from "../../api/unitApi";
import useApiQuery from "../../hooks/useApiQuery";
import { queryClient } from "../../app/queryClient";
import ListHeader from "../../component/ListHeader/ListHeader";
import UnitTable from "./components/UnitTable";
import UnitForm from "./components/UnitForm";
import { LIMITS } from "../../variables/constants";
import { PERMISSIONS } from "../../variables/permission";

const UnitListing = () => {

  const [selectedRow, setSelectedRow] = useState(null);
  const [currentMode, setCurrentMode] = useState("add");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const initData = queryClient.getQueryData(["initData", "authenticated"]);

  const statusOptions =
    initData?.statuses?.status
      ?.filter((item) => item.name.toLowerCase() !== "blocked")
      ?.map((item) => ({
        value: item.uuid,
        label: item.name,
      })) || [];

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "units",
    fetchQueryFunction: getUnits,
    params: {
      pagination:
      {
        page: page,
        perPage: perPage
      },
      keyword,
    },
  });

  console.log('Units API Response:', data);
  const units = data?.data || [];

  useEffect(() => {
    setPage(1);
  }, [keyword, perPage]);

  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedRow(null);
  };

  const handleAdd = () => {
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

  const switchToEdit = () => {
    setCurrentMode("edit");
  };

  return (
    <div className="w-full px-6 py-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ListHeader
          keyword={keyword}
          searchPlaceholder="Search Unit ..."
          setKeyword={setKeyword}
          addButtonText="Add New Unit"
          onAdd={handleAdd}
          permission={PERMISSIONS.UNIT_CREATE}
        />
      </div>

      <UnitTable
        dataSource={units} // Filtered by keyword via API or useMemo
        onView={handleView}
        onEdit={handleEdit}
        loading={isLoading}
        page={data?.pagination?.currentPage || page}
        perPage={data?.pagination?.perPage || perPage}
        total={data?.pagination?.total}
        changePage={(page) => setPage(page)}
        changePerPage={(perPage) => setPerPage(perPage)}
      />

      <UnitForm
        mode={currentMode}
        page={data?.pagination?.currentPage || page}
        setPage={setPage}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        switchToEdit={switchToEdit}
        loading={isLoading}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        statusOptions={statusOptions}
      />
    </div>
  );
};

export default UnitListing;

