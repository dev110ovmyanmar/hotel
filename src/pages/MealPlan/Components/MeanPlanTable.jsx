import { Dropdown, Space, Table, Tag, Button } from "antd";
import { Children, useState } from "react";
import { MoreOutlined } from "@ant-design/icons";
import MeanPlanForm from "./MealPlanForm/MealPlanForm";
import { EditOutlined } from "@ant-design/icons";
import { EyeOutlined } from "@ant-design/icons";
import Status from "./../../../component/Status/Status";
import ColorStatusTag from "./../../../component/ColorStatusTag/ColorStatusTag";
import { PERMISSIONS } from "../../../variables/permission";
import usePermission from "../../../hooks/usePermission";
import PriceTag, { priceFormatter } from "../../../component/PriceTag/PriceTag";

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
      title: "Includes",
      key: "includes",
      render: (_, record) => {
        const meals = [];

        if (record.includesBreakfast) meals.push("Breakfast");
        if (record.includesLunch) meals.push("Lunch");
        if (record.includesDinner) meals.push("Dinner");

        return meals.length ? meals.join(", ") : "-";
      },
    },
    {
      title: "Code",
      key: "code",
      width: 100,
      render: (_, record) => {
        return (
          <div>
            <span>
              {record?.code}
            </span>
          </div>
        )
      }
    },
    {
      title: "Pricing Rules",
      width: 350,
      render: (record) => {
        return (
          <>
            <div className="flex justify-between">
              <span>Adult:</span>
              <span> [{`${priceFormatter(record?.adultPrice)}`}] MMK</span>
            </div>
            <div className="flex justify-between">
              <span>Child:</span>
              <span>[{`${priceFormatter(record?.childPrice)}`}] MMK</span>
            </div>
            <div className="flex justify-between">
              <span>Child Free Age Below :</span>
              <span>[{`${priceFormatter(record?.childFreeAgeBelow)}`}]
                {record?.childFreeAgeBelow <= 1 ? " Year" : " Years"}
              </span>
            </div>
          </>
        )
      }
    },
    {
      title: "Status",
      dataIndex: ["status", "name"],
      key: "status",
      align: "center",
      width: 150,
      render: (_, record) => <ColorStatusTag status={record?.status} />,
    },
    {
      title: "Action",
      fixed: "end",
      align: "center",
      width: 100,
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
