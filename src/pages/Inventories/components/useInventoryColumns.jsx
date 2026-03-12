import { Tag, Dropdown, Button } from "antd";
import { EditOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";

export default function useInventoryColumns(onEdit, onView) {
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
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
      render: (text) => text || "N/A",
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      align: "right",
      render: (price) => (
        <span className="font-medium">
          {/* {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price || 0)} */}
          {price}
        </span>
      ),
    },
    {
      title: "Unit Cost",
      dataIndex: "unitCost",
      key: "unitCost",
      align: "right",
      render: (cost) => (
        <span className="font-medium">
          {/* {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price || 0)} */}
          {cost}
        </span>
      ),
    },
    {
      title: "Stock",
      dataIndex: "stockQuantity",
      key: "stockQuantity",
      align: "right", // Changed to right-aligned for easier comparison
      render: (qty, record) => (
        <p>
          {qty}
        </p>
      ),
    },
    {
      title: "Unit",
      dataIndex: ["unit", "shortName"], // Separate column for Unit
      key: "unit",
      align: "center",
      render: (text) => <span className="text-gray-500">{text || "-"}</span>
    },
    {
      title: "Laundry",
      dataIndex: "laundryStatus",
      key: "laundryStatus",
      align: "center",
      render: (status) => (
        <Tag color={status ? "blue" : "default"}>
          {status ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: "Free",
      dataIndex: "isFree",
      key: "isFree",
      align: "center",
      render: (free) => (
        <Tag color={free ? "blue" : "default"}>
          {free ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      fixed: "right",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              { key: "1", label: "View Details", icon: <EyeOutlined />, onClick: () => onView(record) },
              { key: "2", label: "Edit Item", icon: <EditOutlined />, onClick: () => onEdit(record) },
            ],
          }}
          trigger={["click"]}
        >
          <Button 
            icon={<MoreOutlined />} 
            size="small" 
            type="text" 
            onClick={(e) => e.stopPropagation()} 
          />
        </Dropdown>
      ),
    },
  ];
}