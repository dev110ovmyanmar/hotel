import React, { useState, useEffect, useMemo } from "react";
import { Radio, Pagination, Spin } from "antd";
import { TableOutlined, AppstoreOutlined } from "@ant-design/icons";
import useApiQuery from "../../hooks/useApiQuery";
import ListHeader from "../../component/ListHeader/ListHeader";
import { getHouseKeepingTasks, adminMeta } from "../../api/houseKeepingTaskApi";
import HouseKeepingTaskTable from "./components/HouseKeepingTaskTable";
import HouseKeepingTaskForm from "./components/HouseKeepingTaskForm";
import HouseKeepingTaskCard from "./components/HouseKeepingTaskCard";
import { LIMITS } from "../../variables/constants";
import HouseKeepingTaskAssignForm from "./components/HousKeepingTaskAssignForm";

const HouseKeepingTaskListing = () => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [currentMode, setCurrentMode] = useState("add");
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [viewMode, setViewMode] = useState("table");
    const [taskAssignDrawerOpen, setTaskAssignDrawerOpen] = useState(false);

    // --- Unified Data Fetching (Pagination for both Table and Grid) ---
    const { data: listData, isLoading: isListLoading } = useApiQuery({
        fetchQueryName: "houseKeeping-tasks",
        fetchQueryFunction: getHouseKeepingTasks,
        params: {
            pagination: {
                page: page,
                perPage: perPage
            },
            keyword
        }
    });

    // Fetch Metadata for staff options
    const { data: adminMetaData } = useApiQuery({
        fetchQueryName: "admin-meta",
        fetchQueryFunction: adminMeta,
    });

    const staffOptionsforTask = useMemo(() =>
        adminMetaData?.staffs?.filter(s => s.department?.code === "housekeeping")
            .map(s => ({ value: s.id, label: s.name })),
        [adminMetaData]);

    const staffOptionsforAssignment = useMemo(() =>
        adminMetaData?.staffs?.filter(s => s.department?.code === "housekeeping")
            .map(s => ({ value: s.uuid, label: s.name, id: s.id })),
        [adminMetaData]);

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
        <Radio.Group
            value={viewMode}
            onChange={e => setViewMode(e.target.value)}
            buttonStyle="solid"
            className="shadow-sm"
        >
            <Radio.Button value="table"><TableOutlined /> Table</Radio.Button>
            <Radio.Button value="card"><AppstoreOutlined /> Grid</Radio.Button>
        </Radio.Group>);

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4 px-5">
                <ListHeader
                    title="Housekeeping Task"
                    searchPlaceholder="Search Housekeeping Task..."
                    keyword={keyword}
                    setKeyword={setKeyword}
                    addButtonText="Add Housekeeping Task"
                    onAdd={handleAdd}
                    radioButtonsForTableAndGrid={radioButtonsForTableAndGrid}
                />
            </div>

            {viewMode === "table" ? (
                <div className="px-1">
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
                        onViewTaskAssign={(rec) => handleViewTaskAssign(rec)}
                    />
                </div>
            ) : (
                <Spin spinning={isListLoading}>
                    <div className="px-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[400px]">
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
                        <div className="mt-8 flex justify-center sm:justify-end bg-white p-4 rounded border border-gray-200 shadow-sm">
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
            />

            <HouseKeepingTaskAssignForm
                drawerOpen={taskAssignDrawerOpen}
                setDrawerOpen={setTaskAssignDrawerOpen}
                selectedRow={selectedRow}
                setSelectedRow={setSelectedRow}
                mode={currentMode}
                staffOptions={staffOptionsforAssignment}
                setPage={setPage}
            />
        </div>
    );
};

export default HouseKeepingTaskListing;