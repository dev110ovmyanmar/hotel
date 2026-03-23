import { Button, Dropdown, Typography } from "antd";
import { EditOutlined, EyeOutlined, FileTextOutlined, MoreOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function useGuestColumns(onEdit, onView, onViewNotes) {
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
      title: "Other Name",
      dataIndex: "otherName",
      key: "otherName",
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
      title: "NRC No.",
      dataIndex: "nrcNo",
      key: "nrcNo",
      // render: (nrcNo) => <Text copyable={{ text: nrcNo }}>{nrcNo}</Text>,
    },
    {
      title: "DOB",
      dataIndex: "dob",
      key: "dob",
    },
    {
      title: "Nationality",
      dataIndex: "nationality",
      key: "nationality",
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Dropdown
          menu={{
            onClick: ({ key }) => {
              if (key === "1") onView(record);
              if (key === "2") onEdit(record);
              if (key === "3") onViewNotes(record);
            },
            items: [
              { key: "1", label: "View", icon: <EyeOutlined /> },
              { key: "2", label: "Edit", icon: <EditOutlined /> },
              { key: "3", label: "Guest Notes", icon: <FileTextOutlined /> },
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