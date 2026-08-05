import React, { useState, useMemo } from "react";
import { Drawer, Table, Dropdown, Tag, Button, Space } from "antd";
import dayjs from "dayjs";
import { Eye, Edit2, MoreVertical, Calendar } from "lucide-react";
import DailyOccupationDetailDrawer from "./DailyOccupactionDetailDrawer";
import { getDailyOccupactions } from "../../../../../../api/dailyOccupactionApi";
import { useApiQuery } from "../../../../../../hooks/useApiQuery";

const STATUS_MAP = {
    active: { color: "success", label: "Active" },
    cancelled: { color: "error", label: "Cancelled" },
    checked_out: { color: "processing", label: "Checked Out" },
    default: { color: "warning", label: "Pending" },
};

const DailyOccupactionsTableDrawer = ({
    drawerOpen,
    setDrawerOpen,
    selectedData,
    setSelectedData,
}) => {
    const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
    const [selectedRowKey, setSelectedRowKey] = useState(null);
    const [initialEditMode, setInitialEditMode] = useState(false);

    const { data, isLoading } = useApiQuery({
        fetchQueryName: "dailyOccupactions",
        fetchQueryFunction: getDailyOccupactions,
        params: {
            uuid: selectedData?.uuid,
        },
        options: {
            enabled: drawerOpen && !!selectedData?.uuid,
        },
    });

    // Always derive selected item from fresh API data
    const selectedRow = useMemo(() => {
        if (!selectedRowKey || !data?.dailyOccupancy) return null;
        return data.dailyOccupancy.find(
            (item) => (item.uuid || item.stayDate) === selectedRowKey
        );
    }, [data, selectedRowKey]);

    const handleClose = () => {
        setDetailDrawerOpen(false);
        setSelectedRowKey(null);
        setDrawerOpen(false);
        setSelectedData?.(null);
    };

    const handleOpenDetail = (record, editMode = false) => {
        setSelectedRowKey(record.uuid || record.stayDate);
        setInitialEditMode(editMode);
        setDetailDrawerOpen(true);
    };

    const columns = [
        {
            title: "Date",
            dataIndex: "stayDate",
            key: "stayDate",
            width: 130,
            render: (value) => (
                <div className="flex items-center gap-2">
                    {/* <Calendar size={14} className="text-slate-400" /> */}
                    <span className="font-semibold text-slate-700 dark:text-gray-200 text-xs sm:text-sm">
                        {value ? dayjs(value).format("DD-MM-YYYY") : "-"}
                    </span>
                </div>
            ),
        },
        {
            title: "Guests",
            key: "guests",
            width: 130,
            render: (_, record) => (
                <Space direction="vertical" size={2} className="text-xs">
                    <span className="text-slate-600 dark:text-gray-300">
                        Adults:{" "}
                        <strong className="text-slate-900 dark:text-white">
                            {record.adults ?? 0}
                        </strong>
                    </span>
                    <span className="text-slate-500 dark:text-gray-400">
                        Children:{" "}
                        <strong className="text-slate-800 dark:text-gray-200">
                            {record.childrenCount ?? 0}
                        </strong>
                    </span>
                </Space>
            ),
        },
        {
            title: "Extras",
            key: "extras",
            width: 170,
            render: (_, record) => {
                const hasExtras =
                    record.extraBedCount > 0 ||
                    record.extraPersonCount > 0 ||
                    record.babyCotCount > 0;

                if (!hasExtras) {
                    return <span className="text-xs text-slate-400 italic">None</span>;
                }

                return (
                    <div className="flex flex-wrap gap-1 text-[11px]">
                        {record.extraBedCount > 0 && (
                            <Tag className="m-0 rounded-md bg-slate-100 text-slate-700 border-none dark:bg-gray-800 dark:text-gray-300">
                                Bed: {record.extraBedCount}
                            </Tag>
                        )}
                        {record.extraPersonCount > 0 && (
                            <Tag className="m-0 rounded-md bg-slate-100 text-slate-700 border-none dark:bg-gray-800 dark:text-gray-300">
                                Person: {record.extraPersonCount}
                            </Tag>
                        )}
                        {record.babyCotCount > 0 && (
                            <Tag className="m-0 rounded-md bg-slate-100 text-slate-700 border-none dark:bg-gray-800 dark:text-gray-300">
                                Cot: {record.babyCotCount}
                            </Tag>
                        )}
                    </div>
                );
            },
        },
        {
            title: "Status",
            dataIndex: "occupancyStatus",
            key: "occupancyStatus",
            width: 110,
            render: (status) => {
                if (!status) return <span className="text-slate-400">-</span>;
                const config = STATUS_MAP[status.code] || STATUS_MAP.default;

                return (
                    <Tag
                        color={config.color}
                        className="rounded-full px-2.5 py-0.5 text-xs font-medium border-0"
                    >
                        {status.name || config.label}
                    </Tag>
                );
            },
        },
        {
            title: "Action",
            key: "action",
            width: 65,
            align: "center",
            render: (_, record) => (
                <Dropdown
                    trigger={["click"]}
                    placement="bottomRight"
                    menu={{
                        items: [
                            {
                                key: "view",
                                label: "View Details",
                                icon: <Eye size={15} />,
                                onClick: () => handleOpenDetail(record),
                            },
                            {
                                key: "edit",
                                label: "Edit Row",
                                icon: <Edit2 size={15} />,
                                onClick: () => handleOpenDetail(record, true),
                            },
                        ],
                    }}
                >
                    <Button
                        type="text"
                        size="small"
                        className="flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
                        icon={<MoreVertical size={16} />}
                    />
                </Dropdown>
            ),
        },
    ];

    return (
        <>
            <Drawer
                open={drawerOpen}
                onClose={handleClose}
                width={650}
                className="dark:bg-gray-900"
                headerStyle={{ borderBottom: "1px solid rgba(229, 231, 235, 0.5)" }}
                title={
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-bold text-slate-800 dark:text-white m-0">
                                Daily Occupancies
                            </h2>
                        </div>
                    </div>
                }
            >
                <div className="rounded-xl border border-slate-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
                    <Table
                        size="middle"
                        expandable={{
                            showExpandColumn: false,
                        }}
                        rowKey={(record) => record.uuid || record.stayDate}
                        columns={columns}
                        dataSource={data?.dailyOccupancy ?? []}
                        loading={isLoading}
                        pagination={false}
                        rowClassName={(_, index) =>
                            index % 2 === 0
                                ? "bg-white dark:bg-gray-800"
                                : "bg-slate-50/50 dark:bg-gray-800/50"
                        }
                    />
                </div>
            </Drawer>

            <DailyOccupationDetailDrawer
                open={detailDrawerOpen}
                data={selectedRow}
                reservationRoomUuid={selectedData?.uuid}
                initialEditMode={initialEditMode}
                onClose={() => {
                    setDetailDrawerOpen(false);
                    setSelectedRowKey(null);
                    setInitialEditMode(false);
                }}
            />
        </>
    );
};

export default DailyOccupactionsTableDrawer;