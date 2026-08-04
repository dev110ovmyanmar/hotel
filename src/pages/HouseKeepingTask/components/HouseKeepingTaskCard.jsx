import React from "react";
import dayjs from "dayjs";
import {
    ToolOutlined,
    HomeOutlined,
    AppstoreOutlined,
    CalendarOutlined,
    PlayCircleOutlined,
    EditOutlined,
    InfoCircleOutlined,
    TeamOutlined,
    ClockCircleOutlined,
    EyeOutlined
} from "@ant-design/icons";
import ColorStatusTag from "../../../component/ColorStatusTag/ColorStatusTag";
import { PERMISSIONS } from "../../../variables/permission";
import usePermission from "../../../hooks/usePermission";

const HouseKeepingTaskCard = ({ data, onEdit, onView,
    // onViewTaskAssign
}) => {

    const { hasPermission } = usePermission();
    const viewPermission = hasPermission(PERMISSIONS.HK_TASK_VIEW);
    const editPermission = hasPermission(PERMISSIONS.HK_TASK_EDIT);
    // --- Business Logic & Mapping ---
    const hkStatusMap = {
        clean: "clean",
        dirty: "dirty",
        in_progress: "in_progress",
        inspected: "inspected",
        out_of_order: "out_of_order",
        out_of_service: "out_of_service",
    };

    const firstItem = Array.isArray(data?.housekeepingStatus) ? data?.housekeepingStatus[0] : data?.housekeepingStatus;
    const statusCode = firstItem?.code || firstItem;
    const mappedCode = hkStatusMap[statusCode] || statusCode;

    const statusForTag = {
        code: mappedCode,
        name: firstItem?.name || statusCode
    };

    const textClass =
        "!text-xs lg:!font-[11px] 2xl:!text-sm";

    // --- UI Helpers ---
    const TightRow = ({ icon: Icon, label, value, isDate = false }) => (
        // <div className="grid grid-cols-[130px_10px_1fr] items-center py-1 border-b border-gray-500 last:border-0">
        <div className="grid grid-cols-[130px_10px_1fr] items-center py-1 border-b border-gray-50 dark:border-gray-800 last:border-0">
            <div className="flex items-center gap-1.5">
                {Icon && <Icon className={textClass} />}
                <span className={`${textClass}`}>{label}</span>
            </div>
            <span className={`${textClass} font-bold ms-2`}>:</span>
            <div className="flex items-center pl-2 ml-1 min-w-0">
                <span className={`${textClass} truncate ${isDate ? 'font-mono' : 'font-bold'}`}>
                    {value || "---"}
                </span>
            </div>
        </div>
    );

    const formatTime = (date) => (date ? dayjs(date).format("YYYY-MM-DD HH:mm") : "Not Started");

    return (
        <div
            onClick={onView}
            className="group relative bg-white border border-gray-200 rounded p-3 shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer flex flex-col h-fit"
        >
            {/* 1. Header: Room ID & Main Status */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col">
                    <span className="!text-[10px] lg:!text-[11px] 2xl:!text-[12px] font-bold text-gray-400 uppercase tracking-tight">Room No.</span>
                    <h3 className="text-xl font-black leading-tight group-hover:text-blue-600 transition-colors">
                        {data?.room?.roomNo || "---"}
                    </h3>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                    <ColorStatusTag status={statusForTag} />
                    {data?.priorityLevel?.code === 'high' && (
                        <div className="px-1.5 py-0.5 rounded-sm bg-red-50 text-red-600 text-[10px] font-black border border-red-100">
                            High 
                        </div>
                    )}
                    {data?.priorityLevel?.code === 'urgent' && (
                        <div className="px-1.5 py-0.5 rounded-sm bg-red-50 text-red-600 text-[10px] font-black border border-red-100">
                            Urgent 
                        </div>
                    )}

                    {(data?.priorityLevel?.code === 'low' || data?.priorityLevel?.code === 'normal') && (
                        <div className="px-1.5 py-0.5 rounded-sm bg-green-50 text-green-600 text-[10px] font-black border border-green-100">
                            {data?.priorityLevel?.code === 'low' ? 'Low' : 'Normal'}
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Core Information (With Icons) */}
            <div className="flex-grow space-y-0.5">
                <TightRow icon={HomeOutlined} label="Room Type" value={data?.room?.roomType?.name} />
                <TightRow icon={AppstoreOutlined} label="Floor" value={`Level ${data?.room?.floor?.floorNo || "---"}`} />
                <TightRow icon={ToolOutlined} label="Task" value={data?.taskType?.name} />
                <TightRow icon={ClockCircleOutlined} label="Plan Start" value={formatTime(data?.plannedStartAt)} isDate />
                <TightRow icon={ClockCircleOutlined} label="Plan End" value={formatTime(data?.plannedEndAt)} isDate />
                <TightRow icon={ClockCircleOutlined} label="Started" value={data?.startedAt ? formatTime(data?.startedAt) : null} isDate />
                <TightRow icon={ClockCircleOutlined} label="Completed" value={data?.completedAt ? formatTime(data?.completedAt) : null} isDate />
            </div>

            {/* 3. Action Footer */}
            <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-end">
                <div className="flex gap-4">
                    {
                        viewPermission && <button
                            onClick={(e) => { e.stopPropagation(); onView(); }}
                            className="flex items-center gap-1 text-[10px] font-bold hover:text-blue-600 uppercase tracking-wider cursor-pointer"
                        >
                            <EyeOutlined className="text-[11px]" /> View
                        </button>
                    }
                    {
                        data?.housekeepingStatus?.code === 'completed' || data?.housekeepingStatus?.code === 'cancelled' ? null :
                            (
                                editPermission &&
                                <button
                                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                                    className="flex items-center gap-1 text-[10px] font-bold hover:text-blue-600 uppercase tracking-wider cursor-pointer"
                                >
                                    <EditOutlined className="text-[11px]" /> Edit
                                </button>
                            )
                    }
                </div>

                {/* <button
                    onClick={(e) => { e.stopPropagation(); onViewTaskAssign(); }}
                    className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 hover:bg-blue-50 text-blue-600 rounded text-[9px] font-bold uppercase border border-gray-100 hover:border-blue-200 transition-all"
                >
                    <TeamOutlined /> Assignments
                </button> */}
            </div>

            {/* Accent Side-Bar */}
            <div
                className={`absolute top-0 left-0 w-1 h-full transition-colors ${data?.priorityLevel?.code === 'high' || data?.priorityLevel?.code === 'urgent' ? 'bg-red-500' : 'bg-blue-500'
                    }`}
            />
        </div>
    );
};

export default HouseKeepingTaskCard;
