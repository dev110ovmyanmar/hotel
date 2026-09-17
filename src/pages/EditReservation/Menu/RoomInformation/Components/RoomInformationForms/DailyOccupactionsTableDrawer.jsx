import React, { useState, useMemo } from "react";
import { Drawer, Table, Button, Tooltip, Dropdown, Space } from "antd";
import { CopyOutlined, EditOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import DailyOccupationDetailDrawer from "./DailyOccupactionDetailDrawer";
import { getDailyOccupactions } from "../../../../../../api/dailyOccupactionApi";
import { useApiQuery } from "../../../../../../hooks/useApiQuery";
import PriceTag from "../../../../../../component/PriceTag/PriceTag";
import DailyFOCDrawer from "./FOCForm/DailyFOCDrawer";
import { Bs0Circle } from "react-icons/bs";

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
    const [fOCDrawerOpen, setFOCDrawerOpen] = useState(false);
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

    const roomType = data?.roomType || {};

    // Check Data is past or prensent
    const isDatePast = (date) => {
        const today = dayjs();
        return dayjs(date).isBefore(today, "day");
    };

    // Always derive selected item from fresh API data
    const selectedRow = useMemo(() => {
        if (!selectedRowKey || !data?.dailyOccupancies) return null;
        return data.dailyOccupancies.find(
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

    const handleOpenFOC = (record) => {
        setSelectedRowKey(record.uuid || record.stayDate);
        setFOCDrawerOpen(true);
    }

    const checkinDate = selectedData?.checkinDate;
    const checkoutDate = selectedData?.checkoutDate;

    const nights = selectedData?.totalNight;

    const stayText =
        checkinDate && checkoutDate
            ? `${dayjs(checkinDate).format("DD MMM YYYY")} - ${dayjs(checkoutDate).format("DD MMM YYYY")}${nights !== null ? ` (${nights} Night${nights !== 1 ? "s" : ""})` : ""}`
            : "-";

    const reservationCode = data?.reservationNo || "-";
    const guestName = data?.guestName;
    const roomLabel = data?.roomType?.name + (data?.roomNo ? ` (${data?.roomNo})` : "");

    const sourceType = data?.sourceType?.name;
    const sourceName = data?.source?.name;
    const chargeValue = data?.source?.chargeValue;

    const isSourceWithCharge = [
        "agency",
        "company",
        "referral_agent",
    ].includes(data?.sourceType?.code);

    const isFlat = data?.source?.chargeType?.code === "flat";
    const chargeType = isFlat ? "MMK" : "%";


    const columns = [
        {
            title: "Stay Date",
            dataIndex: "stayDate",
            key: "stayDate",
            width: 90,
            render: (value) => (
                <span>
                    {value ? dayjs(value).format("YYYY-MM-DD") : "-"}
                </span>
            ),
        },
        {
            title: "Occupancy",
            key: "occupancy",
            align: "left",
            width: 80,
            render: (_, record) => {
                const adults = record.adults ?? 0;
                const children = record.childrenCount ?? 0;
                return (
                    <div className="text-slate-700 dark:text-gray-200 text-sm font-medium leading-tight">
                        <div>Adults: {adults}</div>
                        <div>Children: {children}</div>
                    </div>
                );
            },
        },
        {
            title: "Extra",
            key: "extra",
            align: "left",
            width: 100,
            render: (_, record) => {
                const bed = record.extraBedCount ?? 0;
                const person = record.extraPersonCount ?? 0;
                const cot = record.babyCotCount ?? 0;
                return (
                    <div className="text-slate-700 dark:text-gray-200 text-sm font-medium leading-tight">
                        <div>Extra Bed: {bed}</div>
                        <div>Extra Person: {person}</div>
                        <div>Baby Cot: {cot}</div>
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
                        <PriceTag value={total} />
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
            onCell: () => ({ style: { verticalAlign: "center", paddingTop: 15 } }),
            render: (_, record) => {
                return (
                    <Dropdown
                        menu={{
                            onClick: ({ key }) => {
                                if (key === "1") handleOpenDetail(record, false);
                                if (key === "2") handleOpenDetail(record, true);
                                if (key === "3") handleOpenFOC(record);


                            },
                            items: [
                                { key: "1", label: "View", icon: <EyeOutlined /> },
                                !isDatePast(record.stayDate) && { key: "2", label: "Edit", icon: <EditOutlined /> },
                                { key: "3", label: "FOC", icon: <Bs0Circle /> },
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
                                <InfoLine label="Reservation No" value={reservationCode || "-"} />
                                <InfoLine label="Guest" value={guestName || "-"} />
                                <InfoLine label="Room" value={roomLabel || "-"} />
                                <InfoLine label="Stay" value={stayText || "-"} />
                                <InfoLine
                                    label="Source"
                                    value={
                                        sourceType ? (
                                            <>
                                                {sourceType}
                                                {isSourceWithCharge && (
                                                    <>
                                                        <span className="text-indigo-600">
                                                          {" "}( {sourceName} - 
                                                        </span>{" "}
                                                        
                                                        <span className="text-indigo-600">
                                                            {isFlat ? (
                                                                <PriceTag value={chargeValue} />
                                                            ) : (
                                                                chargeValue
                                                            )}{" "}
                                                            {chargeType} )
                                                        </span>
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            "-"
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Daily Stay List */}
                    <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-3">
                            Daily Stay List
                        </h3>

                        {
                            data?.roomStatus?.code == "booked" ?
                                <div className="rounded-lg border border-dashed border-slate-300 dark:border-gray-600 bg-slate-50 dark:bg-gray-800/40 px-5 py-8 text-center">
                                    <div className="text-sm text-slate-400 dark:text-gray-500">
                                        Daily occupancy has not been generated yet.
                                        It will be available after confirmation.
                                    </div>
                                </div> :
                                data?.roomStatus?.code == "cancelled" ?
                                    <div className="rounded-lg border border-dashed border-slate-300 dark:border-gray-600 bg-slate-50 dark:bg-gray-800/40 px-5 py-8 text-center">
                                        <div className="text-sm text-slate-400 dark:text-gray-500">
                                            Daily occupancy is unavailable because this reservation was cancelled.
                                        </div>
                                    </div> :
                                    <div className="rounded-lg border border-slate-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
                                        <Table
                                            size="small"
                                            expandable={{
                                                showExpandColumn: false,
                                            }}
                                            rowKey={(record) => record.uuid || record.stayDate}
                                            columns={columns}
                                            dataSource={data?.dailyOccupancies ?? []}
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
                        }
                    </div>
                </div>
            </Drawer>

            <DailyOccupationDetailDrawer
                open={detailDrawerOpen}
                data={selectedRow}
                roomType={roomType}
                reservationRoomUuid={selectedData?.uuid}
                initialEditMode={initialEditMode}
                isPastDate={selectedRow ? isDatePast(selectedRow.stayDate) : false}
                onClose={() => {
                    setDetailDrawerOpen(false);
                    setSelectedRowKey(null);
                    setInitialEditMode(false);
                }}
            />

            <DailyFOCDrawer
                open={fOCDrawerOpen}
                children={selectedRow?.children ?? []}
                extras={selectedRow?.extras ?? []}
                mealPlan={selectedRow?.mealPlan ?? {}}
                mealPricingMode={selectedRow?.mealPricingMode}
                occupancyUuid={selectedRow?.uuid}
                selectedRow={selectedRow}
                onClose={() => {
                    setFOCDrawerOpen(false);
                    setSelectedRowKey(null);
                }}
            />


        </>
    );
};

export default DailyOccupactionsTableDrawer;