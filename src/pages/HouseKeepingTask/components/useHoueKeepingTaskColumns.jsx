import { Button, Dropdown, Typography } from "antd";
import { EditOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import ColorStatusTag from "../../../component/ColorStatusTag/ColorStatusTag";

const { Text } = Typography;

const useHouseKeepingTaskColumns = (onEdit, onView,
    // onAssign
) => {
    const hkStatusMap = {
        completed: "completed",
        pending: "pending",
        in_progress: "in_progress",
        cancelled: "cancelled",
    };
    return [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 60,
        },
        {
            title: "Room Number",
            key: "roomNo",
            // Accessing roomNo from the nested room object
            render: (_, record) => record?.room?.roomNo || "-",
        },
        {
            title: "Room Type",
            key: "roomType",
            // Path: record.room.roomType.name
            render: (_, record) => record?.room?.roomType?.name || "-",
        },
        {
            title: "Floor",
            key: "floor",
            // Path: record.room.floor.floorNo (or .name depending on preference)
            render: (_, record) => record?.room?.floor?.floorNo || "-",
        },
        {
            title: "House Keeping Status",
            dataIndex: "housekeepingStatus",
            key: "housekeepingStatus",
            render: (housekeepingStatus) => {
                // 1. Get the first item from the array
                const firstItem = Array.isArray(housekeepingStatus) ? housekeepingStatus[0] : housekeepingStatus;

                // 2. Extract the code string (e.g., "dirty")
                const statusCode = firstItem?.code || firstItem;

                // 3. Map it to the "hk_" version
                const mappedCode = hkStatusMap[statusCode] || statusCode;

                // 4. Create an object that ColorStatusTag expects: { code: "hk_dirty", name: "Dirty" }
                const statusForTag = {
                    code: mappedCode,
                    name: firstItem?.name || statusCode
                };

                return <ColorStatusTag status={statusForTag} />;
            },
        },
        {
            title: "Task Type",
            dataIndex: "taskType",
            key: "taskType",
            render: (taskType) => taskType?.name || "-",
        },
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
        }
        ,
        {
            title: "Actions",
            key: "actions",
            width: 100,
            fixed: 'right',
            render: (_, record) => (
                <Dropdown
                    menu={{
                        onClick: ({ key }) => {
                            if (key === "1") onView(record);
                            if (key === "2") onEdit(record);
                            // if (key === "3") onAssign(record);
                        },
                        items: [
                            { key: "1", label: "View", icon: <EyeOutlined /> },
                            { key: "2", label: "Edit", icon: <EditOutlined /> },
                            // { key: "3", label: "View Task Assign", icon: <EyeOutlined /> },
                        ],
                    }}
                    trigger={["click"]}
                >
                    <Button icon={<MoreOutlined />} size="small" type="text" />
                </Dropdown>
            ),
        },
    ];
}

export default useHouseKeepingTaskColumns;