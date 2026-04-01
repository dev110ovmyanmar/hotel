import { Dropdown, Button, Space } from "antd";
import { EditOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import ColorStatusTag from "../../../component/ColorStatusTag/ColorStatusTag";
import usePermission from "../../../hooks/usePermission";
import { PERMISSIONS } from "../../../variables/permission";

export default function useUnitColumns(onEdit, onView) {
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
      title: "Short Name",
      dataIndex: "shortName",
      key: "shortName",
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
      width: 80,
      fixed: "right",
      render: (_, record) => {
        // 1. Define available actions with permission keys
        const actions = [
          {
            key: "view",
            label: "View",
            icon: <EyeOutlined />,
            permission: PERMISSIONS.UNIT_VIEW, // Ensure this exists in your PERMISSIONS file
            onClick: () => onView(record),
          },
          {
            key: "edit",
            label: "Edit",
            icon: <EditOutlined />,
            permission: PERMISSIONS.UNIT_EDIT, // Ensure this exists in your PERMISSIONS file
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