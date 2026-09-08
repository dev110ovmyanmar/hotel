import { Dropdown, Space, Table } from "antd";
import { useState } from "react";
import StaffsForm from "./StaffsForms/StaffsForm";
import {
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import usePermission from "../../../hooks/usePermission";
import { PERMISSIONS } from "../../../variables/permission";
import StaffUploadForm from "./StaffsForms/StaffUploadForm";
import ColorStatusTag from "../../../component/ColorStatusTag/ColorStatusTag";

const StaffsTable = ({
  data,
  page,
  perPage,
  total,
  changePage,
  changePerPage,
  loading,
}) => {
  const { hasPermission } = usePermission();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [uploadDrawer, setUploadDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const columns = [
    {
      title: "ID",
      render: (_, record) => <div>{record?.id}</div>,
      width: 70,
    },
    { title: "Name", dataIndex: "name", key: "name" },

    { title: "Phone", dataIndex: "phone", key: "phone" ,render: (text) => text || "-"},
    {
      title: "Department",
      dataIndex: ["department", "name"],
      key: "department",
    },

    {
      title: "Joined Date",
      dataIndex: "joinedAt",
      key: "joinedAt",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <ColorStatusTag status={status} />,
    },
    {
      title: "Action",
      width: 80,
      fixed:"end",
      align:"center",
      render: (_, record) => {
        const smallStyle = { fontSize: "12px" };

        const actions = [
          {
            key: "view",
            label: "View",
            icon: <EyeOutlined style={{ fontSize: "12px" }} />,
            permission: PERMISSIONS.STAFF_VIEW,
            onClick: () => {
              setDrawerOpen(true);
              setMode("view");
              setSelectedData(record);
            },
          },
          {
            key: "edit",
            label: "Edit",
            icon: <EditOutlined style={{ fontSize: "12px" }} />,
            permission: PERMISSIONS.STAFF_EDIT,
            onClick: () => {
              setDrawerOpen(true);
              setMode("edit");
              setSelectedData(record);
            },
          },
          {
            key: "upload",
            label: "Image Upload",
            icon: <UploadOutlined style={{ fontSize: "12px" }} />,
            onClick: () => {
              if (!record.uuid) return;
              setSelectedRow(record);
              setUploadDrawer(true);
            },
          },
        ];

        const items = actions
          .filter(
            (action) => !action.permission || hasPermission(action.permission),
          )
          .map((action) => ({
            key: action.key,
            onClick: action.onClick,
            label: (
              <Space size={2} style={smallStyle}>
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
            <MoreOutlined style={{ fontSize: "16px" }} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div id="scrollId">
      <Table
        tableLayout="fixed"
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="uuid"
        pagination={{
          current: page,
          pageSize: perPage,
          total: total,
          onChange: (page, perPage) => {
            changePage(page);
            changePerPage(perPage);
          },
          showSizeChanger: true,
        }}
      />

      <StaffsForm
        page={page}
        mode={mode}
        setMode={setMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
      />

      <StaffUploadForm
        open={uploadDrawer}
        onClose={() => setUploadDrawer(false)}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
};

export default StaffsTable;
