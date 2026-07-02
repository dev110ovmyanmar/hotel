import { Dropdown, Space, Table, Tag } from "antd";
import { useState } from "react";
import { MoreOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import usePermission from "../../../hooks/usePermission";
import { PERMISSIONS } from "../../../variables/permission";
import DepartmentsForm from "./DepartmentsForms/DepartmentsForm";
import ColorStatusTag from "../../../component/ColorStatusTag/ColorStatusTag";

const DepartmentsTable = ({
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

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 70 },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Code", dataIndex: "code", key: "code" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <ColorStatusTag status={status} />,
      width: 150,
    },
    {
      title: "Action",
      fixed: "end",
      align: "center",
      render: (_, record) => {
        const smallStyle = { fontSize: "12px" };

        const actions = [
          {
            key: "view",
            label: "View",
            icon: <EyeOutlined style={{ fontSize: "12px" }} />,
            permission: PERMISSIONS.DEPARTMENT_VIEW,
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
            permission: PERMISSIONS.DEPARTMENT_EDIT,
            onClick: () => {
              setDrawerOpen(true);
              setMode("edit");
              setSelectedData(record);
            },
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
        rowKey="uuid"
        loading={loading}
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

      <DepartmentsForm
        page={page}
        mode={mode}
        setMode={setMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
      />
    </div>
  );
};

export default DepartmentsTable;
