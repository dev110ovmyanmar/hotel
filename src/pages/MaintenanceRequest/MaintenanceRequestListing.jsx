import React, { useState, useEffect } from "react";
import useApiQuery from "../../hooks/useApiQuery";
import ListHeader from "../../component/ListHeader/ListHeader";
import { getMaintenanceRequests } from "../../api/maintenanceRequestApi";
import MaintenanceRequestTable from "./components/MaintenancrRequestTable";
import MaintenanceRequestForm from "./components/MaintenanceRequestForm";
import { PERMISSIONS } from "../../variables/permission";

import { LIMITS } from "../../variables/constants";

const MaintenanceRequestListing = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentMode, setCurrentMode] = useState("add");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [taskAssignDrawerOpen, setTaskAssignDrawerOpen] = useState(false);

  const {
    data: maintenanceRequestsData,
    isLoading: isMaintenanceRequestsLoading,
  } = useApiQuery({
    fetchQueryName: "maintenance-requests",
    fetchQueryFunction: getMaintenanceRequests,
    params: {
      pagination: {
        page: page,
        perPage: perPage,
      },
      keyword,
    },
  });

  useEffect(() => {
    setPage(1);
  }, [keyword, perPage]);

  const handleAdd = () => {
    setSelectedRow(null);
    setCurrentMode("add");
    setDrawerOpen(true);
  };

  const handleAction = (record, mode) => {
    setSelectedRow(record);
    setCurrentMode(mode);
    setDrawerOpen(true);
  };

  const handleViewTaskAssign = (record) => {
    setSelectedRow(record);
    setCurrentMode("view");
    setTaskAssignDrawerOpen(true);
  };

  return (
    <div className="w-full px-6 py-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <ListHeader
          title="Maintenance Request"
          searchPlaceholder="Search Maintenance Request..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText="Add Maintenance Request"
          onAdd={handleAdd}
          permission={PERMISSIONS.MAINTENANCE_REQUEST_CREATE}
        />
      </div>

      <div className="px-1">
        <MaintenanceRequestTable
          dataSource={maintenanceRequestsData?.data || []}
          loading={isMaintenanceRequestsLoading}
          total={maintenanceRequestsData?.pagination?.total}
          page={page}
          perPage={perPage}
          changePage={setPage}
          changePerPage={setPerPage}
          onView={(rec) => handleAction(rec, "view")}
          onEdit={(rec) => handleAction(rec, "edit")}
        />
      </div>

      <MaintenanceRequestForm
        mode={currentMode}
        setMode={setCurrentMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setPage={setPage}
        page={page}
        //for task assign
        taskAssignDrawerOpen={taskAssignDrawerOpen}
        setTaskAssignDrawerOpen={setTaskAssignDrawerOpen}
        // staffOptionsforAssignment={staffOptionsforAssignment}
        onViewTaskAssign={handleViewTaskAssign}
      />
    </div>
  );
};

export default MaintenanceRequestListing;
