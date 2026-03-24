import { Button, Dropdown, Typography } from "antd";
import { EditOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function useGuestNotesColumns(onEdit, onView) {
  return [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Name",
      // Accessing nested property in guest object
      dataIndex: ["guest", "name"],
      key: "name",
    },
    // {
    //   title: "NRC No.",
    //   // Accessing nested property in guest object
    //   dataIndex: ["guest", "nrcNo"],
    //   key: "nrcNo",
    //   render: (nrcNo) => <Text>{nrcNo}</Text>,
    // },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      ellipsis: true, // Useful if the note is long
    },
    {
      title: "Actions",
      key: "actions",
      // width: 100,
      fixed: 'right',
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
          <Button icon={<MoreOutlined />} size="small" type="text" />
        </Dropdown>
      ),
    },
  ];
}