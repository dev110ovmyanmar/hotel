import { Button, Tag, Dropdown } from "antd";
import { Typography } from "antd";
import { MoreOutlined } from "@ant-design/icons";
// import { ACTION_BG } from "./Permissionconstants";
import { getAction, getModule } from "./Permissionhelpers";

const { Text } = Typography;

export default function usePermissionColumns(onEdit, onView) {
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
      title: "Permission Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Module",
      dataIndex: "module",
      key: "module",
      render: (module) => (
        <Tag className="capitalize">
          {module}
        </Tag>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Dropdown
          menu={{
            onClick: ({ key }) => {
              if (key === "1") onView(record);
              if (key === "2") onEdit(record);
            },
            items: [
              { key: "1", label: "View" },
              { key: "2", label: "Edit" },
            ],
          }}
          trigger={["click"]}
        >
          <Button icon={<MoreOutlined />} size="small" />
        </Dropdown>
      ),
    },
  ];
}