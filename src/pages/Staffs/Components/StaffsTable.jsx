import { Dropdown, Space, Table } from "antd";
import { useState } from "react";
import StaffsForm from "./StaffsForms/StaffsForm";
import { MoreOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import usePermission from "../../../hooks/usePermission";
import { PERMISSIONS } from "../../../variables/permission";

const StaffsTable = ({
  data,
  page,
  perPage,
  total,
  changePage,
  changePerPage,
  loading
}) => {
  const { hasPermission } = usePermission();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [selectedData, setSelectedData] = useState(null);

  const columns = [
    {
      title: "ID",
      render: (_, record) => <div>{record?.id}</div>,
      width: 70,
    },
    { title: "Name", dataIndex: "name", key: "name" },

    { title: "Phone", dataIndex: "phone", key: "phone" },
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
      title: "Action",
      width: 80,
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
    </div>
  );
};

export default StaffsTable;
