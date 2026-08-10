import { Button, Dropdown, Space } from "antd";
import { EditOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import ColorStatusTag from "../../../component/ColorStatusTag/ColorStatusTag";
import usePermission from "../../../hooks/usePermission";
import { PERMISSIONS } from "../../../variables/permission";

export default function useRestaurantTableColumns(onEdit, onView) {
    const { hasPermission } = usePermission();

    return [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 70,
        },
        {
            title: "Table No",
            dataIndex: "tableNo",
            key: "tableNo",
        },
        {
            title: "Capacity",
            dataIndex: "capacity",
            key: "capacity",
            render: (capacity) => `${capacity} Seats`,
        },
        {
            title: "Status",
            dataIndex: "tableStatus",
            key: "tableStatus",
            render: (_, record) => <ColorStatusTag status={record?.tableStatus} />,
        },
        {
            title: "Actions",
            key: "actions",
            width: 100,
            fixed: 'right',
            align:"center",
            render: (_, record) => {
                // 1. Define actions with their specific permission keys
                const actions = [
                    {
                        key: "view",
                        label: "View",
                        icon: <EyeOutlined />,
                        permission: PERMISSIONS.RESTAURANT_TABLE_VIEW,
                        onClick: () => onView(record),
                    },
                    {
                        key: "edit",
                        label: "Edit",
                        icon: <EditOutlined />,
                        permission: PERMISSIONS.RESTAURANT_TABLE_EDIT,
                        onClick: () => onEdit(record),
                    },
                ];

                // 2. Filter based on permissions
                const items = actions
                    .filter((action) => !action.permission || hasPermission(action.permission))
                    .map((action) => ({
                        key: action.key,
                        label: (
                            <Space size={8} onClick={action.onClick}>
                                {action.icon}
                                <span>{action.label}</span>
                            </Space>
                        ),
                    }));

                // 3. Return null if the user has no permissions for any action
                if (items.length === 0) return null;

                return (
                    <Dropdown
                        menu={{ items }}
                        trigger={["click"]}
                        placement="bottomRight"
                    >
                        <Button
                            icon={<MoreOutlined />}
                            size="small"
                            type="text"
                            className="flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()} // Prevents table row click events
                        />
                    </Dropdown>
                );
            },
        },
    ];
}