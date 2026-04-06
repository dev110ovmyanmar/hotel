import { Tag, Dropdown, Button, Space } from "antd";
import { EditOutlined, EyeOutlined, FileOutlined, MoreOutlined } from "@ant-design/icons";
import usePermission from "../../../hooks/usePermission";
import { PERMISSIONS } from "../../../variables/permission";
import BooleanTag from "../../../component/BooleanTag/BooleanTag";

export default function useServiceInventoryColumns(onEdit, onView) {
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
      ellipsis: true,
      width: 140,
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
      render: (text) => text || "N/A",
      width: 110,
    },
    {
      title: "Purchase Price (MMK)",
      dataIndex: "unitCost",
      key: "unitCost",
      width: 120,
      render: (cost) => <span className="font-medium">{cost}</span>,
    },
    {
      title: "Selling Price (MMK)",
      dataIndex: "unitPrice",
      key: "unitPrice",
      // align: "right",
      width: 110,
      render: (price) => (
        <span className="font-medium">
          {price}
        </span>
      ),
    },
    {
      title: "Stock",
      dataIndex: "stockQuantity",
      key: "stockQuantity",
      width: 80,
      render: (qty, record) => <p>{qty}</p>,
    },
    {
      title: "Unit",
      dataIndex: ["unit", "shortName"], // Separate column for Unit
      key: "unit",
      width: 80,
      align: "center",
      render: (text) => <span className="text-gray-500">{text || "-"}</span>,
    },
    {
      title: "Laundry",
      dataIndex: "laundryStatus",
      key: "laundryStatus",
      align: "center",
      width: 90,
      render: (status) => (
        <BooleanTag
          value={status}
          trueText="Washable"
          falseText="N/A"
        />
      ),
    },
    {
      title: "Free",
      dataIndex: "isFree",
      key: "isFree",
      align: "center",
      width: 80,
      render: (free) => (
        <BooleanTag
          value={free}
          trueText="Gift"
          falseText="Sale"
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      fixed: "right",
      render: (_, record) => {
        const actions = [
          {
            key: "view",
            label: "View",
            icon: <EyeOutlined />,
            permission: PERMISSIONS.SERVICE_INVENTORY_VIEW,
            onClick: () => onView(record),
          },
          {
            key: "edit",
            label: "Edit",
            icon: <EditOutlined />,
            permission: PERMISSIONS.SERVICE_INVENTORY_EDIT,
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

        // 3. Only show dropdown if there are items available for this user
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
