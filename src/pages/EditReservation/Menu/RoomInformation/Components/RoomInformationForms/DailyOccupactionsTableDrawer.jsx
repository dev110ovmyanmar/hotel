import React, { useState, useMemo } from "react";
import { Drawer, Table, Button, Tooltip, Dropdown, Space } from "antd";
import { CopyOutlined, EditOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import DailyOccupationDetailDrawer from "./DailyOccupactionDetailDrawer";
import { getDailyOccupactions } from "../../../../../../api/dailyOccupactionApi";
import { useApiQuery } from "../../../../../../hooks/useApiQuery";

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

    const dates = data?.dailyOccupancy?.map((item) => item.stayDate);

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

    // Build stay summary text from the API data or selectedData
    const checkinDate = selectedData?.checkinDate;
    const checkoutDate = selectedData?.checkoutDate;
    const nights =
        checkinDate && checkoutDate
            ? dayjs(checkoutDate).diff(dayjs(checkinDate), "day")
            : null;

    const totalNights =
        checkinDate && checkoutDate
            ? dayjs(checkoutDate).startOf("day").diff(
                dayjs(checkinDate).startOf("day"),
                "day"
            )
            : 0;
    const testNights = totalNights - 1;
    console.log("TotalNights : ", testNights);
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
                <span className="font-semibold text-slate-700 dark:text-gray-200 text-xs whitespace-nowrap">
                    {value ? dayjs(value).format("DD-MM-YYYY") : "-"}
                </span>
            ),
        },
        {
            title: "Adults",
            dataIndex: "adults",
            key: "adults",
            align: "center",
            width: 65,
            render: (val) => (
                <span className="text-slate-700 dark:text-gray-200 text-sm font-medium">
                    {val ?? 0}
                </span>
            ),
        },
        {
            title: "Children",
            dataIndex: "childrenCount",
            key: "childrenCount",
            align: "center",
            width: 75,
            render: (val) => (
                <span className="text-slate-700 dark:text-gray-200 text-sm font-medium">
                    {val ?? 0}
                </span>
            ),
        },
        {
            title: "Extra Bed",
            dataIndex: "extraBedCount",
            key: "extraBedCount",
            align: "center",
            width: 80,
            render: (val) => (
                <span className="text-slate-700 dark:text-gray-200 text-sm font-medium">
                    {val ?? 0}
                </span>
            ),
        },
        {
            title: "Extra Person",
            dataIndex: "extraPersonCount",
            key: "extraPersonCount",
            align: "center",
            width: 95,
            render: (val) => (
                <span className="text-slate-700 dark:text-gray-200 text-sm font-medium">
                    {val ?? 0}
                </span>
            ),
        },
        {
            title: "Baby Cot",
            dataIndex: "babyCotCount",
            key: "babyCotCount",
            align: "center",
            width: 75,
            render: (val) => (
                <span className="text-slate-700 dark:text-gray-200 text-sm font-medium">
                    {val ?? 0}
                </span>
            ),
        },
        {
            title: "Meal",
            key: "meal",
            align: "center",
            width: 60,
            render: (_, record) => {
                return (
                    <span className="text-slate-700 dark:text-gray-200 text-sm font-semibold cursor-default">
                        {record.mealPlan?.name || "-"}
                    </span>
                );
            },
        },
        {
            title: "Total Charge (MMK)",
            key: "grandTotal",
            align: "center",
            width: 50,
            render: (_, record) => {
                return (
                    <span className="text-slate-700 dark:text-gray-200 text-sm font-medium">
                        {record?.dailyCharge?.grandTotal || "0"}
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
                const smallStyle = { fontSize: "12px" };

                const isPast = isDatePast(record.stayDate);

                const actions = [
                    {
                        key: "view",
                        label: "View",
                        icon: <EyeOutlined style={{ fontSize: "12px" }} />,
                        onClick: () => handleOpenDetail(record, false),
                    },
                    ...(!isPast
                        ? [
                            {
                                key: "edit",
                                label: "Edit",
                                icon: <EditOutlined style={{ fontSize: "12px" }} />,
                                onClick: () => handleOpenDetail(record, true),
                            },
                        ]
                        : []),
                ];

                const items = actions.map((action) => ({
                    key: action.key,
                    disabled: action.disabled,
                    label: (
                        <Space size={4} style={smallStyle} onClick={action.disabled ? undefined : action.onClick}>
                            {action.icon}
                            <span style={{ fontSize: "14px" }}>{action.label}</span>
                        </Space>
                    ),
                }));

                return (
                    <Dropdown menu={{ items }} trigger={["click"]}>
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
                                <InfoLine label="Reservation" value={reservationCode} />
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