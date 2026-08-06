import React, { useState, useMemo } from "react";
import { Drawer, Table, Button, Tooltip, Dropdown, Space } from "antd";
import { CopyOutlined, EditOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import DailyOccupationDetailDrawer from "./DailyOccupactionDetailDrawer";
import { getDailyOccupactions } from "../../../../../../api/dailyOccupactionApi";
import { useApiQuery } from "../../../../../../hooks/useApiQuery";

import PriceTag from "../../../../../../component/PriceTag/PriceTag";

// Monospace-style info row
const InfoLine = ({ label, value }) => (
    <div className="flex gap-2 font-mono text-sm leading-relaxed">
        <span className="text-slate-500 dark:text-gray-400 w-28 shrink-0">{label}</span>
        <span className="text-slate-400 dark:text-gray-500 shrink-0">:</span>
        <span className="text-slate-800 dark:text-gray-100 font-medium">{value || "-"}</span>
    </div>
);

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

    // Check Data is past or prensent
    const isDatePast = (date) => {
        const today = dayjs();
        return dayjs(date).isBefore(today, "day");
    };

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
        setInitialEditMode(false);
        setDrawerOpen(false);
        setSelectedData?.(null);
    };

    const handleOpenDetail = (record, editMode = false) => {
        setSelectedRowKey(record.uuid || record.stayDate);
        setInitialEditMode(editMode);
        setDetailDrawerOpen(true);
    };

    const checkinDate = selectedData?.checkinDate;
    const checkoutDate = selectedData?.checkoutDate;

    const nights = selectedData?.totalNight;

    const stayText =
        checkinDate && checkoutDate
            ? `${dayjs(checkinDate).format("DD-MMM-YYYY")} to ${dayjs(checkoutDate).format("DD-MMM-YYYY")}${nights !== null ? ` (${nights} Night${nights !== 1 ? "s" : ""})` : ""}`
            : "-";

    const reservationCode = data?.reservationNo || "-";
    const guestName = data?.guestName;
    const roomLabel = data?.roomType + " (" + data?.roomNo + ")";


    const columns = [
        {
            title: "Stay Date",
            dataIndex: "stayDate",
            key: "stayDate",
            width: 90,
            render: (value) => (
                <span>
                    {value ? dayjs(value).format("DD-MM-YYYY") : "-"}
                </span>
            ),
        },
        {
            title: "Occupancy",
            key: "occupancy",
            align: "center",
            width: 80,
            render: (_, record) => {
                const adults = record.adults ?? 0;
                const children = record.childrenCount ?? 0;
                return (
                    <div className="text-slate-700 dark:text-gray-200 text-sm font-medium leading-tight">
                        <div>Adult: {adults}</div>
                        <div>Child: {children}</div>
                    </div>
                );
            },
        },
        {
            title: "Extra",
            key: "extra",
            align: "center",
            width: 100,
            render: (_, record) => {
                const bed = record.extraBedCount ?? 0;
                const person = record.extraPersonCount ?? 0;
                const cot = record.babyCotCount ?? 0;
                return (
                    <div className="text-slate-700 dark:text-gray-200 text-sm font-medium leading-tight">
                        <div>Bed: {bed}</div>
                        <div>Person: {person}</div>
                        <div>Cot: {cot}</div>
                    </div>
                );
            },
        },
        {
            title: "Meal",
            key: "meal",
            align: "center",
            width: 60,
            render: (_, record) => {
                return (
                    <span>
                        {record.mealPlan?.code == null ? "Room Only" : record.mealPlan?.code}
                    </span>
                );
            },
        },
        {
            title: "Total (MMK)",
            key: "grandTotal",
            align: "center",
            width: 50,
            render: (_, record) => {
                const total = Number(record?.dailyCharge?.grandTotal) || 0;
                return (
                    <span className="text-slate-700 dark:text-gray-200 text-sm font-medium">
                        {total.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                    </span>
                )
            }
        }
        ,
        {
            title: "Action",
            key: "action",
            width: 100,
            align: "center",
            onCell: () => ({ style: { verticalAlign: "top", paddingTop: 8 } }),
            render: (_, record) => {
                return (
                    <Dropdown
                        menu={{
                            onClick: ({ key }) => {
                                if (key === "1") handleOpenDetail(record, false);
                                if (key === "2") handleOpenDetail(record, true);
                            },
                            items: [
                                { key: "1", label: "View", icon: <EyeOutlined /> },
                                !isDatePast(record.stayDate) && { key: "2", label: "Edit", icon: <EditOutlined /> },
                            ],
                        }}
                        trigger={["click"]}
                    >
                        <MoreOutlined style={{ fontSize: "16px", cursor: "pointer" }} />
                    </Dropdown>
                );
            },
        },
    ];

    return (
        <>
            <Drawer
                open={drawerOpen}
                onClose={handleClose}
                width={700}
                className="dark:bg-gray-900"
                headerStyle={{ borderBottom: "1px solid rgba(229, 231, 235, 0.5)" }}
                title={
                    <h2 className="text-base font-bold text-slate-800 dark:text-white m-0">
                        Daily Occupancy
                    </h2>
                }
            >
                <div className="space-y-6">
                    {/* Reservation Info Card */}
                    <div>
                        <div className="relative rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800/60 px-5 py-4">
                            <div className="space-y-0.5">
                                <InfoLine label="Reservation No" value={reservationCode} />
                                <InfoLine label="Guest" value={guestName} />
                                <InfoLine label="Room" value={roomLabel} />
                                <InfoLine label="Stay" value={stayText} />
                            </div>
                        </div>
                    </div>

                    {/* Daily Stay List */}
                    <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-3">
                            Daily Stay List
                        </h3>
                        <div className="rounded-lg border border-slate-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
                            <Table
                                size="small"
                                expandable={{
                                    showExpandColumn: false,
                                }}
                                rowKey={(record) => record.uuid || record.stayDate}
                                columns={columns}
                                dataSource={data?.dailyOccupancy ?? []}
                                loading={isLoading}
                                pagination={false}
                                scroll={{ x: 600 }}
                                rowClassName={(_, index) =>
                                    index % 2 === 0
                                        ? "bg-white dark:bg-gray-800"
                                        : "bg-slate-50/60 dark:bg-gray-800/50"
                                }
                            />
                        </div>
                    </div>
                </div>
            </Drawer>

            <DailyOccupationDetailDrawer
                open={detailDrawerOpen}
                data={selectedRow}
                reservationRoomUuid={selectedData?.uuid}
                initialEditMode={initialEditMode}
                isPastDate={selectedRow ? isDatePast(selectedRow.stayDate) : false}
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