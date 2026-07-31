import React, { useState, useEffect } from "react";
import {
  Radio,
  Select,
  Input,
  Row,
  Col,
  Button,
  Space,
  Badge,
  Spin,
  Pagination,
} from "antd";
import {
  TableOutlined,
  AppstoreOutlined,
  FilterOutlined,
  ClearOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import useApiQuery from "../../hooks/useApiQuery";
import ListHeader from "../../component/ListHeader/ListHeader";
import { getHouseKeeping, roomMeta } from "../../api/houesKeepingStatusApi";
import HouseKeepingStatusTable from "./Components/HouseKeepingStatusTable";
import HouseKeepingStatusForm from "./Components/HouseKeepingStatusForm";
import HouseKeepingStatusCard from "./Components/HouseKeepingStatusCard";
import { LIMITS } from "../../variables/constants";
import { PERMISSIONS } from "../../variables/permission";
import usePermission from "../../hooks/usePermission";

const { Option } = Select;

const HouseKeepingStatusListing = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentMode, setCurrentMode] = useState("add");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState("card");

  const { hasPermission } = usePermission();
  const createPermission = hasPermission(PERMISSIONS.HK_TASK_CREATE);

  // API Query with combined params
  const { data, isLoading } = useApiQuery({
    fetchQueryName: "houseKeeping-statuses",
    fetchQueryFunction: getHouseKeeping,
    params: {
      pagination: {
        page: page,
        perPage: perPage,
      },
      keyword,
    },
  });

  const { data: roomData } = useApiQuery({
    fetchQueryName: "room-meta",
    fetchQueryFunction: roomMeta,
  });

  const houseKeepingStatuses = data?.data || [];
  const roomTypeOptions = roomData?.room_types?.map((roomType) => ({
    value: roomType.uuid,
    label: roomType.name,
  }));

  // Reset to page 1 whenever search keyword or any filter changes
  useEffect(() => {
    setPage(1);
  }, [
    keyword,
    ,
    //  filters
    perPage,
  ]);

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

  const showCreateButton = houseKeepingStatuses ? false : true;

  const radioButtonsForTableAndGrid = (
    <div className="inline-flex items-center gap-1 rounded-lg bg-transparent">
      <button
        type="button"
        onClick={() => setViewMode("card")}
        className={`p-2 rounded-sm transition-all duration-200 flex items-center justify-center ${
          viewMode === "card"
            ? "bg-[#1677ff] shadow-sm text-gray-100!"
            : "hover:text-gray-500 hover:bg-gray-200!"
        }`}
      >
        <AppstoreOutlined className="text-sm! " />
      </button>

      <button
        type="button"
        onClick={() => setViewMode("table")}
        className={`p-2 rounded-sm transition-all duration-200 flex items-center justify-center ${
          viewMode === "table"
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
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-5">
        <ListHeader
          title="Housekeeping"
          searchPlaceholder="Quick search room..."
          keyword={keyword}
          setKeyword={setKeyword}
          addButtonText="Add Task"
          onAdd={handleAdd}
          showCreateButton={showCreateButton}
          radioButtonsForTableAndGrid={radioButtonsForTableAndGrid}
        />
      </div>

      {viewMode === "table" ? (
        <div className="px-1">
          <HouseKeepingStatusTable
            dataSource={houseKeepingStatuses}
            onView={(rec) => handleAction(rec, "view")}
            onEdit={(rec) => handleAction(rec, "edit")}
            loading={isLoading}
            page={data?.pagination?.currentPage || page}
            perPage={data?.pagination?.perPage || perPage}
            total={data?.pagination?.total}
            changePage={setPage}
            changePerPage={setPerPage}
          />
        </div>
      ) : (
        <Spin spinning={isLoading}>
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
              {houseKeepingStatuses?.map((item) => (
                <HouseKeepingStatusCard
                  key={item.uuid}
                  data={item}
                  onEdit={() => handleAction(item, "edit")}
                  onView={() => handleAction(item, "view")}
                />
              ))}
            </div>

            {/* Standard Pagination for Grid View */}
            <div className="mt-8 flex justify-center sm:justify-end bg-white p-4 ">
              <Pagination
                current={page}
                pageSize={perPage}
                total={data?.pagination?.total || 0}
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

      <HouseKeepingStatusForm
        mode={currentMode}
        setMode={setCurrentMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setPage={setPage}
        page={data?.pagination?.currentPage}
      />
    </div>
  );
};

export default HouseKeepingStatusListing;
