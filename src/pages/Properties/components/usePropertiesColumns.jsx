import { Button, Tag, Dropdown } from "antd";
import { Typography } from "antd";
import { EditOutlined, EyeOutlined, FolderAddOutlined, MoreOutlined } from "@ant-design/icons";


export default function usePropertiesColumns(onEdit, onView, onUpload) {
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
      render: (text) => <p>{text}</p>
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Type",
      dataIndex: ["type", "name"],
      key: "type",
    },
    {
      title: "Country",
      dataIndex: ["country", "name"],
      key: "country",
    },
    {
      title: "City",
      dataIndex: ["city", "name"],
      key: "city",
    },
    {
      title: "Currency",
      dataIndex: ["currency", "code"],
      key: "currency",
    },
    {
      title: "Actions",
      key: "actions",
      fixed:"end",
      align:"center",
      render: (_, record) => {
        return (
          <Dropdown
            menu={{
              onClick: ({ key }) => {
                if (key === "1") onView(record);
                if (key === "2") onEdit(record);
                if (key === "3") onUpload(record);
              },
              items: [
                { key: "1", label: "View", icon: <EyeOutlined /> },
                { key: "2", label: "Edit", icon: <EditOutlined /> },
                { key: "3", label: "Manage Files", icon: <FolderAddOutlined /> }
              ],
            }}
            trigger={["click"]}
          >
            <Button icon={<MoreOutlined />} size="small" type="text" />
          </Dropdown>
        )
      },
    },
  ];
}