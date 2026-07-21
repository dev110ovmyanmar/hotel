import { Button, Dropdown, Typography } from "antd";
import { EditOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import ColorStatusTag from "../../../component/ColorStatusTag/ColorStatusTag";
import { PERMISSIONS } from "../../../variables/permission";
import usePermission from "../../../hooks/usePermission";

const { Text } = Typography;

const useMaintenanceRequestColumns = (onEdit, onView) => {
    const { hasPermission } = usePermission();
    const viewPermission = hasPermission(PERMISSIONS.MAINTENANCE_REQUEST_VIEW);
    const editPermission = hasPermission(PERMISSIONS.MAINTENANCE_REQUEST_EDIT);

    const maintenanceRequestStatusMap = {
        resolved: "resolved",
        verified: "verified",
        reported: "reported",
        assigned: "assigned",
        in_progress: "in_progress",
    };

    return [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 60,
        },
        {
            title: "Name",
            key: "name",
            render: (_, record) => record?.name || "-",
        },
        {
            title: "Room",
            key: "room",
            render: (_, record) => record?.room?.roomNo || "-",
        },
        {
            title: "Floor",
            key: "floor",
            // Path: record.room.floor.floorNo (or .name depending on preference)
            render: (_, record) => record?.room?.floor?.floorNo || "-",
        },
        // {
        //     title: "Priority",
        //     key: "priorityLevel",
        //     render: (_, record) => record?.priorityLevel?.name || "-",
        // },
        {
            title: "Priority",
            dataIndex: "priorityLevel",
            key: "priorityLevel",
            render: (priorityLevel) => {
                // Return null or a placeholder if data is missing
                if (!priorityLevel?.name) return "-";

                const isUrgent = priorityLevel.code === 'high' || priorityLevel.code === 'urgent';

                return isUrgent ? (
                    <div className="px-1.5 py-0.5 bg-red-50 text-red-600 border rounded-sm border-red-100 w-fit">
                        {priorityLevel.name}
                    </div>
                ) : (
                    <div className="px-1.5 py-0.5 border rounded-sm border-green-100 w-fit text-green-600">
                        {priorityLevel.name}
                    </div>
                );
            }
        },
        {
            title: "Issue Type",
            key: "issueType",
            render: (_, record) => record?.issueType?.name || "-",
        },
        {
            title: "Status",
            key: "maintenanceStatus",
            dataIndex: "maintenanceStatus",
            render: (maintenanceStatus) => {
                // 1. Get the first item from the array
                const firstItem = Array.isArray(maintenanceStatus) ? maintenanceStatus[0] : maintenanceStatus;

                // 2. Extract the code string (e.g., "dirty")
                const statusCode = firstItem?.code || firstItem;

                // 3. Map it to the "hk_" version
                const mappedCode = maintenanceRequestStatusMap[statusCode] || statusCode;

                // 4. Create an object that ColorStatusTag expects: { code: "hk_dirty", name: "Dirty" }
                const statusForTag = {
                    code: mappedCode,
                    name: firstItem?.name || statusCode
                };

                return <ColorStatusTag status={statusForTag} />;
            },
        },
        {
            title: "Reported By",
            key: "reportedFrom",
            width: 150,
            render: (_, record) => {
                const housekeepingTask = record?.housekeepingTask;
                const reportedFromName = record?.reportedFrom?.name;

                if (housekeepingTask) {
                    return (
                        <div className="flex flex-col leading-tight">
                            {/* Primary Info: Task ID */}
                            {reportedFromName ? (
                                <span>
                                    {reportedFromName}
                                </span>
                            ) : "-"}

                            {/* Secondary Info: Who reported it */}
                            <span className="text-blue-500 ">
                                {`(Request Task #${housekeepingTask.id})`}
                            </span>
                        </div>
                    );
                }

                // Fallback: plain maintenance request (no linked HK task)
                return (
                    <span>
                        {reportedFromName || "-"}
                    </span>
                );
            }
        },
        {
            title: "Actions",
            key: "actions",
            width: 100,
            fixed: 'right',
            align: "center",
            render: (_, record) => {
                const isEditDisabled = ["verified"].includes(record.maintenanceStatus?.code);

                const items = [
                    { key: "1", label: "View", icon: <EyeOutlined /> },
                    ...(isEditDisabled ? [] : [
                        { key: "2", label: "Edit", icon: <EditOutlined /> }
                    ]),
                ];

                return (
                    <Dropdown
                        menu={{
                            onClick: ({ key }) => {
                                if (key === "1") onView(record);
                                if (key === "2") onEdit(record);
                            },
                            items: [
                                viewPermission && { key: "1", label: "View", icon: <EyeOutlined /> },
                                editPermission && { key: "2", label: "Edit", icon: <EditOutlined /> },
                            ],
                        }}
                        trigger={["click"]}
                    >
                        <Button icon={<MoreOutlined />} size="small" type="text" />
                    </Dropdown>
                );
            },
        },
    ];
}

export default useMaintenanceRequestColumns;