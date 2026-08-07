import React from "react";
import dayjs from "dayjs";
import {
  HomeOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  EditOutlined,
  EyeOutlined,
  AlertOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import ColorStatusTag from "../../../component/ColorStatusTag/ColorStatusTag";
import { PERMISSIONS } from "../../../variables/permission";
import usePermission from "../../../hooks/usePermission";
import { MdCalendarViewDay } from "react-icons/md";

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

  const { hasPermission } = usePermission();
  const viewPermission = hasPermission(PERMISSIONS.HK_STATUS_VIEW);
  const editPermission = hasPermission(PERMISSIONS.HK_STATUS_EDIT);

  const firstItem = Array.isArray(data?.cleanStatus)
    ? data?.cleanStatus[0]
    : data?.cleanStatus;
  const statusCode = firstItem?.code || firstItem;
  const mappedCode = hkStatusMap[statusCode] || statusCode;

  const statusForTag = {
    code: mappedCode,
    name: firstItem?.name || statusCode,
  };

  const textClass = "!text-xs lg:!font-[11px] 2xl:!text-sm";

  // --- 2. UI Helpers ---
  const TightRow = ({
    icon: Icon,
    label,
    value,
    isPriority = false,
    isDate = false,
  }) => (
    // <div className={`grid grid-cols-[130px_10px_1fr] items-center py-1 border-b border-gray-50 last:border-0`}>
    <div className="grid grid-cols-[130px_10px_1fr] items-center py-1 border-b border-gray-50 dark:border-gray-800 last:border-0">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className={textClass} />}
        <span className={`${textClass}`}>{label}</span>
      </div>
      <span className={`ms-2 font-bold`}>:</span>
      <div className="flex items-center pl-2 ml-1 min-w-0">
        <span
          className={`${textClass} truncate ${isDate ? "font-mono" : "font-bold"}`}
        >
          {value || "---"}
        </span>
      </div>
    </div>
  );

  return (
    <div
      onClick={onView}
      className="group relative bg-white border border-gray-200 dark:border-gray-500 rounded p-3 shadow-sm dark:shadow-gray-400 hover:shadow-md hover:border-blue-400 transition-all cursor-pointer flex flex-col h-fit"
    >
      {/* Header: Room & Mapped Status Tag */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col">
          <span className="!text-[10px] lg:!text-[11px] 2xl:!text-[12px] font-bold text-gray-400 uppercase tracking-tight">
            Room No.
          </span>
          <h3 className="text-xl font-black leading-tight group-hover:text-blue-600 transition-colors">
            {data?.room?.roomNo || "---"}
          </h3>
        </div>
        {/* Using the mapped statusForTag object here */}
        <div className="flex flex-col items-end gap-1.5">
          <ColorStatusTag status={statusForTag} />
          {data?.priorityLevel?.code === "high" && (
            <div className="px-1.5 py-0.5 rounded-sm bg-red-50 text-red-600 text-[10px] font-black border border-red-100">
              High
            </div>
          )}
          {data?.priorityLevel?.code === "urgent" && (
            <div className="px-1.5 py-0.5 rounded-sm bg-red-50 text-red-600 text-[10px] font-black border border-red-100">
              Urgent
            </div>
          )}

          {(data?.priorityLevel?.code === "low" ||
            data?.priorityLevel?.code === "normal") && (
            <div className="px-1.5 py-0.5 rounded-sm bg-green-50 text-green-600 text-[10px] font-black border border-green-100">
              {data?.priorityLevel?.code === "low" ? "Low" : "Normal"}
            </div>
          )}
        </div>
      </div>

      {/* Core Details Grid */}
      <div className="flex-grow space-y-0.5 text-default">
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
        {/* <TightRow
                    icon={AlertOutlined}
                    label="Priority"
                    value={data?.priorityLevel?.name || "---"}
                    isPriority
                /> */}
        <TightRow
          icon={ClockCircleOutlined}
          label="Started"
          value={
            data?.startedAt
              ? dayjs(data.startedAt).format("YYYY-MM-DD HH:mm:ss")
              : "---"
          }
          isDate
        />
        <TightRow
          icon={ClockCircleOutlined}
          label="Completed"
          value={
            data?.completedAt
              ? dayjs(data.completedAt).format("YYYY-MM-DD HH:mm:ss")
              : "---"
          }
          isDate
        />
      </div>

      {/* Actions Footer */}
      <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-400 flex items-center justify-end gap-4">
        {viewPermission && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
            className="flex items-center gap-1 text-[10px] font-bold hover:text-blue-600 uppercase tracking-wider transition-colors cursor-pointer"
          >
            <EyeOutlined className="text-[11px]" /> View
          </button>
        )}
        {editPermission && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="flex items-center gap-1 text-[10px] font-bold hover:text-blue-600 uppercase tracking-wider transition-colors cursor-pointer"
          >
            <EditOutlined className="text-[11px]" /> Edit
          </button>
        )}
      </div>

      {/* Sidebar Accent Bar */}
      <div
        className={`absolute top-0 left-0 w-1 h-full transition-colors ${
          data?.priorityLevel?.code === "high" ||
          data?.priorityLevel?.code === "urgent"
            ? "bg-red-500"
            : "bg-blue-500"
        }`}
      />
    </div>
  );
};

export default HouseKeepingStatusCard;
