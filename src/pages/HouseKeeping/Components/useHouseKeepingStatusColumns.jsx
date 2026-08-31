import { Button, Dropdown, Typography } from "antd";
import { EditOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import ColorStatusTag from "../../../component/ColorStatusTag/ColorStatusTag";
import { PERMISSIONS } from "../../../variables/permission";
import usePermission from "../../../hooks/usePermission";

const { Text } = Typography;

const useHouseKeepingStatusColumns = (onEdit, onView) => {

    const { hasPermission } = usePermission();
    const viewPermission = hasPermission(PERMISSIONS.HK_STATUS_VIEW);
    const editPermission = hasPermission(PERMISSIONS.HK_STATUS_EDIT);

    return [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 60,
        },
        {
            title: "Room No",
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
            title: "Clean Status",
            dataIndex: "cleanStatus",
            key: "cleanStatus",
            render: (cleanStatus) => {
                const statusForTag = {
                    code: cleanStatus?.code,
                    name: cleanStatus?.name
                };

                return <ColorStatusTag status={statusForTag} />;
            },
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
            align: "center",
            render: (_, record) => (
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
            ),
        },
    ];
}

export default useHouseKeepingStatusColumns;