import { Button, Dropdown, Space } from "antd";
import { MoreOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";

export default function (onEdit, onView) {
  return [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: 150,
      render: (text) => (
        <code>{text}</code>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      width: 250,
      render: (text) => <span className="text-gray-600">{text || "-"}</span>,
    },
    // {
    //   title: "Actions",
    //   key: "actions",
    //   width: 120,
    //   render: (_, record) => (
    //     <Space size="small">
    //       <Button
    //         type="text"
    //         size="small"
    //         icon={<EyeOutlined />}
    //         onClick={() => onView(record)}
    //         title="View"
    //       />
    //       <Button
    //         type="text"
    //         size="small"
    //         icon={<EditOutlined />}
    //         onClick={() => onEdit(record)}
    //         title="Edit"
    //       />
    //     </Space>
    //   ),
    // },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      fixed: "end",
      align: "center",
      render: (_, record) => (
        <Dropdown
          menu={{
            onClick: ({ key }) => {
              if (key === "1") onView(record);
              if (key === "2") onEdit(record);
            },
            items: [
              { key: "1", label: "View", icon: <EyeOutlined /> },
              { key: "2", label: "Edit", icon: <EditOutlined /> },
            ],
          }}
          trigger={["click"]}
        >
          <Button type="text" icon={<MoreOutlined />} size="small" />
        </Dropdown>
      ),
    },
  ];
}
