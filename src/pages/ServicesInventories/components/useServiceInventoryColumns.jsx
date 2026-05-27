import { Tag, Dropdown, Button, Space } from "antd";
import { EditOutlined, EyeOutlined, FileOutlined, MoreOutlined } from "@ant-design/icons";
import usePermission from "../../../hooks/usePermission";
import { PERMISSIONS } from "../../../variables/permission";
import BooleanTag from "../../../component/BooleanTag/BooleanTag";
import PriceTag from "../../../component/PriceTag/PriceTag";

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
      render: (text) => text || "-",
    },
    {
      title: "Laundry",
      dataIndex: "laundryStatus",
      key: "laundryStatus",
      align: "center",
      width: 90,
      render: (status) =>
        <div className={status === true ? "text-[#389E0D]" : "text-[#CF1322]"}>
          {status === true ? "True" : "False"}
        </div>
    },
    {
      title: "Free",
      dataIndex: "isFree",
      key: "isFree",
      align: "center",
      width: 80,
      render: (free) => (
        <div className={free === true ? "text-[#389E0D]" : "text-[#CF1322]"}>
          {free === true ? "True" : "False"}
        </div>
      ),
    },
    {
      title: "Purchase Price (MMK)",
      dataIndex: "unitCost",
      key: "unitCost",
      width: 120,
      render: (cost) => <PriceTag value={cost} />
    },
    {
      title: "Selling Price (MMK)",
      dataIndex: "unitPrice",
      key: "unitPrice",
      // align: "right",
      width: 110,
      render: (price) => (
        <PriceTag value={price} />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      fixed: "right",
      align: "center",
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
