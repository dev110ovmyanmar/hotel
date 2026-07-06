import { Dropdown, Space, Table, Tag, Button } from "antd";
import { useState } from "react";
import { MoreOutlined } from "@ant-design/icons";
import MeanPlanForm from "./MealPlanForm/MealPlanForm";
import { EditOutlined } from "@ant-design/icons";
import { EyeOutlined } from "@ant-design/icons";
import Status from "./../../../component/Status/Status";
import ColorStatusTag from "./../../../component/ColorStatusTag/ColorStatusTag";
import { PERMISSIONS } from "../../../variables/permission";
import usePermission from "../../../hooks/usePermission";

const MeanPlanTable = ({
  data,
  page,
  perPage,
  total,
  changePage,
  changePerPage,
  loading,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("");
  const [selectedData, setSelectedData] = useState({});
  const { hasPermission } = usePermission();

  const columns = [
    {
      title: "ID",
      render: (_, record) => <div>{record?.id}</div>,
      width: 70,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => text || "-",
    },
    {
      title: "Status",
      dataIndex: ["status", "name"],
      key: "status",
      width:150,
      render: (_, record) => <ColorStatusTag status={record?.status} />,
    },
    {
      title: "Action",
      fixed: "end",
      align: "center",
      width:100,
      render: (_, record) => {
        const smallStyle = { fontSize: "12px" };

        const actions = [
          {
            key: "view",
            label: "View",
            icon: <EyeOutlined style={{ fontSize: "12px" }} />,
            permission: PERMISSIONS.MEAL_PLAN_VIEW,
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
            permission: PERMISSIONS.MEAL_PLAN_EDIT,
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

        if (items.length === 0) return null;

        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <MoreOutlined style={{ fontSize: "16px" }} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div id="scrollId" className="w-full h-[63vh] ">
      <Table
        tableLayout="fixed"
        scroll={{ x: 1000 }}
        columns={columns}
        loading={loading}
        dataSource={data}
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

      <MeanPlanForm
        mode={mode}
        setMode={setMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        page={page}
      />
    </div>
  );
};

export default MeanPlanTable;
