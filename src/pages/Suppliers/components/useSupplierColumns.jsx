import { Button, Dropdown, Typography, Space } from "antd";
import { EditOutlined, EyeOutlined, FileTextOutlined, MoreOutlined } from "@ant-design/icons";
import ColorStatusTag from "../../../component/ColorStatusTag/ColorStatusTag";
import { PERMISSIONS } from "../../../variables/permission";
import usePermission from "../../../hooks/usePermission";

const { Text } = Typography;

export default function useSupplierColumns(onEdit, onView) {
    const { hasPermission } = usePermission();
    return [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 60,
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Code",
            dataIndex: "code",
            key: "code",
        },
        {
            title: "Contact Person",
            dataIndex: "contactPerson",
            key: "contactPerson",
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => <ColorStatusTag status={status} />,
        },
        {
            title: "Actions",
            key: "actions",
            fixed: "right",
            render: (_, record) => {
                // 1. Define available actions with permission keys
                const actions = [
                    {
                        key: "view",
                        label: "View",
                        icon: <EyeOutlined />,
                        permission: PERMISSIONS.SUPPLIER_VIEW, // Ensure this exists in your PERMISSIONS file
                        onClick: () => onView(record),
                    },
                    {
                        key: "edit",
                        label: "Edit",
                        icon: <EditOutlined />,
                        permission: PERMISSIONS.SUPPLIER_EDIT, // Ensure this exists in your PERMISSIONS file
                        onClick: () => onEdit(record),
                    },
                ];

                // 2. Filter and map actions based on user permissions
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

                // 3. Don't render the action button if the user has no permissions
                if (items.length === 0) return null;

                return (
                    <Dropdown menu={{ items }} trigger={["click"]}>
                        <Button
                            icon={<MoreOutlined />}
                            size="small"
                            type="text"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </Dropdown>
                );
            },
        },
    ];
}