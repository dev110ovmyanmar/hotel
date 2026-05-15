import { Dropdown, Button, Space } from "antd";
import { EditOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import ColorStatusTag from "../../../component/ColorStatusTag/ColorStatusTag";
import usePermission from "../../../hooks/usePermission";
import { PERMISSIONS } from "../../../variables/permission";

export default function useCategoryColumns(onEdit, onView) {
  const { hasPermission } = usePermission();

  return [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (department) => department?.name,
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
      fixed: "right",  // Added fixed right for consistency with your other table
      align:"center",
      render: (_, record) => {
        // 1. Define all possible actions with their required permissions
        const actions = [
          {
            key: "view",
            label: "View",
            icon: <EyeOutlined />,
            permission: PERMISSIONS.CATEGORY_VIEW, // Make sure this key exists in your PERMISSIONS file
            onClick: () => onView(record),
          },
          {
            key: "edit",
            label: "Edit",
            icon: <EditOutlined />,
            permission: PERMISSIONS.CATEGORY_EDIT, // Make sure this key exists in your PERMISSIONS file
            onClick: () => onEdit(record),
          },
        ];

        // 2. Filter based on permissions and map to Ant Design Menu items
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

        // 3. Return nothing if the user has no permissions for any action
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
