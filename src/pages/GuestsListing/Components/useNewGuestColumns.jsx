import { Button, Dropdown, Space, Typography } from "antd";
import {
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
  MoreOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import ColorStatusTag from "../../../component/ColorStatusTag/ColorStatusTag";
import { Link } from "react-router-dom";
import usePermission from "../../../hooks/usePermission";
import { PERMISSIONS } from "../../../variables/permission";

const { Text } = Typography;

export default function useGuestColumns(
  onEdit,
  onView,
  onViewNotes,
  onFileUpload,
  handleNameClick,
  // hasPermission
) {
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
      render: (name, record) => {
        const titlePrefix = record.title ? `${record.title} ` : "";

        return (
          <Typography.Link
            onClick={(e) => {
              e.preventDefault();
              handleNameClick(record);
            }}
            style={{ fontWeight: 500 }}
          >
            {`${titlePrefix}${name}`}
          </Typography.Link>
        );
      },
    },
    {
      title: "Phone No.",
      dataIndex: "phone",
      key: "phone",
      render: (text) => text || "-",
    },
    {
      title: "NRC No.",
      dataIndex: "nrcNo",
      key: "nrcNo",
      render: (text) => text || "-",
    },
    {
      title: "Passport",
      dataIndex: "passport",
      key: "passport",
      render: (text) => text || "-",
    },
    {
      title: "Nationality",
      dataIndex: "nationality",
      key: "nationality",
      render: (text) => text || "-",
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
      fixed: "right",
      align: "center",
      render: (_, record) => {
        const smallStyle = { fontSize: "12px" };

        const actions = [
          {
            key: "view",
            label: "View",
            icon: <EyeOutlined style={{ fontSize: "12px" }} />,
            permission: PERMISSIONS.GUEST_VIEW,
            onClick: () => onView(record),
          },
          {
            key: "edit",
            label: "Edit",
            icon: <EditOutlined style={{ fontSize: "12px" }} />,
            permission: PERMISSIONS.GUEST_EDIT,
            onClick: () => onEdit(record),
          },
          {
            key: "guest-notes",
            label: "Guest Notes",
            icon: <FileTextOutlined style={{ fontSize: "12px" }} />,
            permission: PERMISSIONS.GUEST_NOTE_VIEW,
            onClick: () => onViewNotes(record),
          },
          {
            key: "manage-files",
            label: "Manage Files",
            icon: <UploadOutlined style={{ fontSize: "12px" }} />,
            permission: PERMISSIONS.GUEST_FILE_MANAGE,
            onClick: () => onFileUpload(record),
          },
        ];

        const items = actions
          .filter(
            (action) => !action.permission || hasPermission(action.permission),
          )
          .map((action) => ({
            key: action.key,
            label: (
              <Space size={4} style={smallStyle} onClick={action.onClick}>
                {action.icon}
                <span style={{ fontSize: "14px" }}>{action.label}</span>
              </Space>
            ),
          }));

        if (items.length === 0) {
          return null;
        }

        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Button
              icon={<MoreOutlined style={{ fontSize: "16px" }} />}
              type="text"
              size="small"
            />
          </Dropdown>
        );
      },
    },
  ];
}
