import React, { useState, useEffect } from "react";
import { Radio, Select, Input, Row, Col, Button, Space, Badge, Spin, Pagination } from "antd";
import {
    TableOutlined,
    AppstoreOutlined,
    FilterOutlined,
    ClearOutlined
} from "@ant-design/icons";
import useApiQuery from "../../hooks/useApiQuery";
import ListHeader from "../../component/ListHeader/ListHeader";
import { getHouseKeeping, roomMeta } from "../../api/houesKeepingStatusApi";
import HouseKeepingStatusTable from "./Components/HouseKeepingStatusTable";
import HouseKeepingStatusForm from "./Components/HouseKeepingStatusForm";
import HouseKeepingStatusCard from "./Components/HouseKeepingStatusCard";
import { LIMITS } from "../../variables/constants";

const { Option } = Select;

const HouseKeepingStatusListing = () => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [currentMode, setCurrentMode] = useState("add");
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [viewMode, setViewMode] = useState("table");

    // API Query with combined params
    const { data, isLoading } = useApiQuery({
        fetchQueryName: "houseKeeping-statuses",
        fetchQueryFunction: getHouseKeeping,
        params: {
            pagination: {
                page: page,
                perPage: perPage
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
    }, [keyword,
        //  filters
        , perPage]);


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
        <div className="inline-block">
            <Radio.Group
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                buttonStyle="solid"
                /* flex-nowrap ensures the buttons stay side-by-side */
                className="flex flex-nowrap"
            >
                <Radio.Button
                    value="table"
                    /* whitespace-nowrap prevents the icon/text from splitting */
                    className="sticky top-0 z-10 whitespace-nowrap"
                >
                    <span className="inline-flex items-center gap-2">
                        <TableOutlined />
                        <span>Table</span>
                    </span>
                </Radio.Button>

                <Radio.Button
                    value="card"
                    className="sticky top-0 z-10 whitespace-nowrap"
                >
                    <span className="inline-flex items-center gap-2">
                        <AppstoreOutlined />
                        <span>Grid</span>
                    </span>
                </Radio.Button>
            </Radio.Group>
        </div>

    );

    return (
        <div>
            {/* Top Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-5 mb-5">
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
                // <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                //     {houseKeepingStatuses.map((item) => (
                //         <HouseKeepingStatusCard
                //             key={item.uuid}
                //             data={item}
                //             onEdit={() => handleAction(item, "edit")}
                //             onView={() => handleAction(item, "view")}
                //         />
                //     ))}
                // </div>
                <Spin spinning={isLoading}>
                    <div className="px-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[400px]">
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
                        <div className="mt-8 flex justify-center sm:justify-end bg-white p-4 rounded border border-gray-200 shadow-sm">
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