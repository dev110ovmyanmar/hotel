import { Tag, Dropdown, Button } from "antd";
import { EditOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";

export default function useCategoryColumns(onEdit, onView) {
  return [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status?.name == "Active" ? "green" : "red"}>
          {status?.name || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              { key: "1", label: "View", icon: <EyeOutlined />, onClick: () => onView(record) },
              { key: "2", label: "Edit", icon: <EditOutlined />, onClick: () => onEdit(record) },
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