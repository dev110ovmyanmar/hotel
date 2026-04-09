import { Button, Dropdown, Typography } from "antd";
import { EditOutlined, EyeOutlined, FileTextOutlined, MoreOutlined } from "@ant-design/icons";
import ColorStatusTag from "../../../component/ColorStatusTag/ColorStatusTag";

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
      title: "Phone No",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "NRC No",
      dataIndex: "nrcNo",
      key: "nrcNo",
    },
    {
      title: "Passport",
      dataIndex: "passport",
      key: "passport",
    }
    ,
    {
      title: "Nationality",
      dataIndex: "nationality",
      key: "nationality",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => <ColorStatusTag status={record?.status} />,
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