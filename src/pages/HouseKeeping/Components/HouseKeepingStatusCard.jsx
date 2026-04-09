import React from "react";
import dayjs from "dayjs";
import {
    HomeOutlined,
    AppstoreOutlined,
    CalendarOutlined,
    EditOutlined,
    EyeOutlined,
    AlertOutlined,
    ClockCircleOutlined
} from "@ant-design/icons";
import ColorStatusTag from "../../../component/ColorStatusTag/ColorStatusTag";

const HouseKeepingStatusCard = ({ data, onEdit, onView }) => {
    // --- 1. Business Logic & Mapping ---
    const hkStatusMap = {
        clean: "clean",
        dirty: "dirty",
        in_progress: "in_progress",
        inspected: "inspected",
        out_of_order: "out_of_order",
        out_of_service: "out_of_service",
    };

    const firstItem = Array.isArray(data?.cleanStatus) ? data?.cleanStatus[0] : data?.cleanStatus;
    const statusCode = firstItem?.code || firstItem;
    const mappedCode = hkStatusMap[statusCode] || statusCode;

    const statusForTag = {
        code: mappedCode,
        name: firstItem?.name || statusCode
    };

    // --- 2. UI Helpers ---
    const TightRow = ({ icon: Icon, label, value, isPriority = false, isDate = false }) => (
        <div className="grid grid-cols-[90px_10px_1fr] items-center py-1 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-1.5">
                {Icon && <Icon className="text-[10px]" />}
                <span className="text-[11px] font-bold">{label}</span>
            </div>
            <span className="text-[11px] font-bold">:</span>
            <div className="flex items-center pl-2 border-l border-gray-100 ml-1 min-w-0">
                {/* <span className={`text-[11px] truncate leading-none font-bold ${isPriority && data?.priorityLevel?.name === 'High' ||
                    isPriority && data?.priorityLevel?.name === 'Urgent' ? 'text-red-500' : 'text-gray-800'
                    }`}>
                    {value || "-"}
                </span> */}
                {/* <span className={`text-[11px] truncate leading-none font-bold`}>
                    {value || "-"}
                </span> */}
                <span className={`text-[11px] truncate ${isDate ? 'font-mono text-gray-500' : 'font-bold'}`}>
                    {value || "---"}
                </span>
            </div>
        </div>
    );

    return (
        <div
            onClick={onView}
            className="group relative bg-white border border-gray-200 rounded p-3 shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer flex flex-col h-full"
        >
            {/* Header: Room & Mapped Status Tag */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Room Number</span>
                    <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                        {data?.room?.roomNo || "---"}
                    </h3>
                </div>
                {/* Using the mapped statusForTag object here */}
                <ColorStatusTag status={statusForTag} />
            </div>

            {/* Core Details Grid */}
            <div className="flex-grow space-y-0.5">
                <TightRow
                    icon={HomeOutlined}
                    label="Floor"
                    value={`Level ${data?.room?.floor?.floorNo || "-"}`}
                />
                <TightRow
                    icon={AppstoreOutlined}
                    label="Room Type"
                    value={data?.room?.roomType?.name}
                />
                <TightRow
                    icon={AlertOutlined}
                    label="Priority"
                    value={data?.priorityLevel?.name || "---"}
                    isPriority
                />
                <TightRow
                    icon={ClockCircleOutlined}
                    label="Started"
                    value={data?.startedAt ? dayjs(data.startedAt).format("YYYY-MM-DD HH:mm:ss") : "---"}
                    isDate
                />
                <TightRow
                    icon={ClockCircleOutlined}
                    label="Completed"
                    value={data?.completedAt ? dayjs(data.completedAt).format("YYYY-MM-DD HH:mm:ss") : "---"}
                    isDate
                />
            </div>

            {/* Actions Footer */}
            <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-end gap-4">
                <button
                    onClick={(e) => { e.stopPropagation(); onView(); }}
                    className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-blue-600 uppercase tracking-wider transition-colors"
                >
                    <EyeOutlined className="text-[11px]" /> View
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-blue-600 uppercase tracking-wider transition-colors"
                >
                    <EditOutlined className="text-[11px]" /> Edit
                </button>
            </div>

            {/* Sidebar Accent Bar */}
            <div
                className={`absolute top-0 left-0 w-1 h-full transition-all duration-300 ${data?.priorityLevel?.code === 'high' || data?.priorityLevel?.code === 'urgent'
                    ? 'bg-red-500 opacity-100'
                    : 'bg-blue-500 opacity-0 group-hover:opacity-100'
                    }`}
            />
        </div>
    );
};

export default HouseKeepingStatusCard;
