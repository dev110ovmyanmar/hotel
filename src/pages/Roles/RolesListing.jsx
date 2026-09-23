import React, { useState, useMemo, useEffect } from "react";
import RoleForm from "./Components/RoleForm.jsx";
import {
    getRoles
} from "../../api/roleApi.js";
import useApiQuery from "../../hooks/useApiQuery";
import RolesTable from "./Components/RolesTable.jsx";
import ListHeader from "../../component/ListHeader/ListHeader.jsx";
import { LIMITS } from "../../variables/constants.js";

const RolesListing = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentMode, setCurrentMode] = useState("add");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);


  const { data, isFetching, error } = useApiQuery({
    fetchQueryName: "roles",
    fetchQueryFunction: getRoles,
    params: {
      pagination: {
        page: page,
        perPage: perPage
      },
      keyword,
    },
  });

  const roles = data?.data || [];

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

  const onClose = () => {
    setDrawerOpen(false);
    setSelectedRow(null);
  };

  const switchToEdit = () => {
    setCurrentMode("edit");
  };


  return (
    <>
      <>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4 w-full px-6 py-2">
          <ListHeader
            searchPlaceholder="Search roles by name, code...."
            keyword={keyword}
            setKeyword={setKeyword}
            addButtonText="Add New Role"
            onAdd={handleAdd}
          />
        </div>

        <RolesTable
          dataSource={roles}
          onView={handleView}
          onEdit={handleEdit}
          loading={isFetching}
          page={data?.pagination?.currentPage || page}
          perPage={data?.pagination?.perPage || perPage}
          total={data?.pagination?.total}
          changePage={(page) => setPage(page)}
          changePerPage={(perPage) => setPerPage(perPage)}
        />
      </>
      
      <RoleForm
        mode={currentMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        roles={roles}
        loading={isFetching}
        switchToEdit={switchToEdit}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        page={page}
        setPage={setPage}
      />
    </>
  );
};

export default RolesListing;



