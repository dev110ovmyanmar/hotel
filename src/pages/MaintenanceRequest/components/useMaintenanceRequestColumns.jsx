import { Button, Dropdown, Typography } from "antd";
import { EditOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import ColorStatusTag from "../../../component/ColorStatusTag/ColorStatusTag";

const { Text } = Typography;

const useMaintenanceRequestColumns = (onEdit, onView) => {

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
        {
            title: "Reported By",
            key: "reportedFrom",
            render: (_, record) => record?.reportedFrom?.name || "-",
        },
        {
            title: "Priority",
            key: "priorityLevel",
            render: (_, record) => record?.priorityLevel?.name || "-",
        },
        {
            title: "Issue Type",
            key: "issueType",
            render: (_, record) => record?.issueType?.name || "-",
        },
        {
            title: "Status",
            key: "maintenance_status",
            render: (_, record) => record?.maintenanceStatus?.name || "-",
        },
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
                        },
                        items: [
                            { key: "1", label: "View", icon: <EyeOutlined /> },
                            { key: "2", label: "Edit", icon: <EditOutlined /> },
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

export default useMaintenanceRequestColumns;