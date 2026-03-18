
import React, { useState, useMemo, useEffect } from "react";
import {
  getPermissions,
} from "../../api/permissionApi";
import useApiQuery from "../../hooks/useApiQuery";
import ListHeader from "../../component/ListHeader/ListHeader";
import PermissionTable from "./Components/PermissionTable";
import PermissionForm from "./Components/PermissionForm";
import { LIMITS } from "../../variables/constants";

const PermissionListing = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentMode, setCurrentMode] = useState("add");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data, isLoading, error } = useApiQuery({
    fetchQueryName: "permissions",
    fetchQueryFunction: getPermissions,
    params: {
      pagination: 
      { page: page, 
        perPage: perPage
      },
      keyword,
    },
  });


  const permissions = data?.data || [];

   useEffect(() => {
    setPage(1);
  }, [keyword, perPage]);

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

  const switchToEdit = () => {
    setCurrentMode("edit");
  };


  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4 w-full px-6 py-2">
        <ListHeader
          title="Permission List"
          searchPlaceholder="Search Permission ..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText=" Add New Permission"
          onAdd={handleAdd}
        />
      </div>

      <PermissionTable
        permissions={permissions}
        onView={handleView}
        onEdit={handleEdit}
        loading={isLoading}
        page={data?.pagination?.currentPage || page}
        perPage={data?.pagination?.perPage || perPage}
        total={data?.pagination?.total}
        changePage={(page) => setPage(page)}
        changePerPage={(perPage) => setPerPage(perPage)}
      />

      <PermissionForm
        mode={currentMode}
        page={data?.pagination?.currentPage || page}
        setPage={setPage}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        permissions={permissions}
        loading={isLoading}
        switchToEdit={switchToEdit}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
    </>
  );
};
export default PermissionListing;
