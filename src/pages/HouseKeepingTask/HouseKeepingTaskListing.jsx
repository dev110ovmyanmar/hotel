import React, { useState, useEffect, useMemo } from "react";
import { Radio, Pagination, Spin } from "antd";
import {
  TableOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import useApiQuery from "../../hooks/useApiQuery";
import ListHeader from "../../component/ListHeader/ListHeader";
import { getHouseKeepingTasks, adminMeta } from "../../api/houseKeepingTaskApi";
import HouseKeepingTaskTable from "./components/HouseKeepingTaskTable";
import HouseKeepingTaskForm from "./components/HouseKeepingTaskForm";
import HouseKeepingTaskCard from "./components/HouseKeepingTaskCard";
import { LIMITS } from "../../variables/constants";
import ColorStatusTag from "../../component/ColorStatusTag/ColorStatusTag";
import { PERMISSIONS } from "../../variables/permission";

const HouseKeepingTaskListing = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentMode, setCurrentMode] = useState("add");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState("card");
  const [taskAssignDrawerOpen, setTaskAssignDrawerOpen] = useState(false);

  // --- Unified Data Fetching (Pagination for both Table and Grid) ---
  const { data: listData, isLoading: isListLoading } = useApiQuery({
    fetchQueryName: "houseKeeping-tasks",
    fetchQueryFunction: getHouseKeepingTasks,
    params: {
      pagination: {
        page: page,
        perPage: perPage,
      },
      keyword,
    },
  });

  // Fetch Metadata for staff options
  const { data: adminMetaData } = useApiQuery({
    fetchQueryName: "admin-meta",
    fetchQueryFunction: adminMeta,
  });

  const staffOptionsforTask = useMemo(
    () =>
      adminMetaData?.staffs
        ?.filter((s) => s.department?.code === "housekeeping")
        .map((s) => ({ value: s.id, label: s.name })),
    [adminMetaData],
  );

  const staffOptionsforAssignment = useMemo(
    () =>
      adminMetaData?.staffs
        ?.filter((s) => s.department?.code === "housekeeping")
        .map((s) => ({ value: s.uuid, label: s.name, id: s.id })),
    [adminMetaData],
  );

  const roomOptions = useMemo(
    () =>
      adminMetaData?.rooms?.map((r) => ({
        value: r.uuid,
        label: (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <span>{r.roomNo}</span>
            <ColorStatusTag
              status={{
                code: r.housekeepingStatus?.cleanStatus?.code,
                name: r.housekeepingStatus?.cleanStatus?.name,
              }}
            />
          </div>
        ),
      })),
    [adminMetaData],
  );

  // Reset to page 1 when searching or changing page size
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

  const radioButtonsForTableAndGrid = (
    <div className="inline-flex items-center gap-1 rounded-lg bg-transparent">
      <button
        type="button"
        onClick={() => setViewMode("card")}
        className={`p-2 rounded-sm transition-all duration-200 flex items-center justify-center ${viewMode === "card"
            ? "bg-[#1677ff] shadow-sm text-gray-100!"
            : "hover:text-gray-500 hover:bg-gray-200!"
          }`}
      >
        <AppstoreOutlined className="text-sm! " />
      </button>

      <button
        type="button"
        onClick={() => setViewMode("table")}
        className={`p-2 rounded-sm transition-all duration-200 flex items-center justify-center ${viewMode === "table"
            ? "bg-[#1677ff]  shadow-sm text-gray-100!"
            : "hover:text-gray-500 hover:bg-gray-200!"
          }`}
      >
        <UnorderedListOutlined className="text-sm!" />
      </button>
    </div>
  );

  return (
    <div className="w-full px-6 py-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <ListHeader
          title="Housekeeping Task"
          searchPlaceholder="Search Housekeeping Task..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText="Add Housekeeping Task"
          onAdd={handleAdd}
          radioButtonsForTableAndGrid={radioButtonsForTableAndGrid}
          isHouseKeepingTask={true}
          permission={PERMISSIONS.HK_TASK_CREATE}
        />
      </div>

      {viewMode === "table" ? (
        <div>
          <HouseKeepingTaskTable
            dataSource={listData?.data || []}
            loading={isListLoading}
            total={listData?.pagination?.total}
            page={page}
            perPage={perPage}
            changePage={setPage}
            changePerPage={setPerPage}
            onView={(rec) => handleAction(rec, "view")}
            onEdit={(rec) => handleAction(rec, "edit")}
          // onViewTaskAssign={(rec) => handleViewTaskAssign(rec)}
          />
        </div>
      ) : (
        <Spin spinning={isListLoading}>
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
              {listData?.data?.map((item) => (
                <HouseKeepingTaskCard
                  key={item.uuid}
                  data={item}
                  onEdit={() => handleAction(item, "edit")}
                  onView={() => handleAction(item, "view")}
                  onViewTaskAssign={() => handleViewTaskAssign(item)}
                />
              ))}
            </div>

            {/* Standard Pagination for Grid View */}
            <div className="mt-8 flex justify-center sm:justify-end bg-white p-4 ">
              <Pagination
                current={page}
                pageSize={perPage}
                total={listData?.pagination?.total || 0}
                onChange={(p, ps) => {
                  setPage(p);
                  setPerPage(ps);
                }}
                showSizeChanger
              />
            </div>
          </div>
        </Spin>
      )}

      <HouseKeepingTaskForm
        mode={currentMode}
        setMode={setCurrentMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setPage={setPage}
        page={page}
        staffOptions={staffOptionsforTask}
        onViewTaskAssign={handleViewTaskAssign}
        roomOptions={roomOptions}
        //for task assign
        taskAssignDrawerOpen={taskAssignDrawerOpen}
        setTaskAssignDrawerOpen={setTaskAssignDrawerOpen}
        staffOptionsforAssignment={staffOptionsforAssignment}
        adminMetaData={adminMetaData}
      />
    </div>
  );
};

export default HouseKeepingTaskListing;
