import { Dropdown, Space, Table, Tag } from "antd";
import { useState } from "react";
import { MoreOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import usePermission from "../../../hooks/usePermission";
import SeasonalRateForm from "./SeasonalRateForms/SeasonalRateForm";
import { PERMISSIONS } from "../../../variables/permission";
import PriceTag from "../../../component/PriceTag/PriceTag";
import { TableColumns } from "../../../component/TableColumns/TableColumns";

const SeasonalRateTable = ({
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

  const baseColumns = [
    {
      title: "ID",
      render: (_, record) => <div>{record?.id}</div>,
      width: 70,
    },
    {
      title: "Room Type",
      dataIndex: "name",
      key: "roomTypeName",
      align: "left",
    },
    // {
    //   title: "Total Rooms",
    //   dataIndex: "totalRooms",
    //   key: "totalRooms",
    //   width: "80",
    // },
    // {
    //   title: "Extra Bed",
    //   dataIndex: "extraBed",
    //   key: "extraBed",
    // },
    // {
    //   title: "Max Occupancy",
    //   dataIndex: "maxOccupancy",
    //   key: "maxOccupancy",
    // },
    // {
    //   title: "Price (MMK)",
    //   dataIndex: "basePrice",
    //   key: "basePrice",
    //   render: (text) => <PriceTag value={text} />,
    //   width: "80",
    //   align:"right",
    // },
  ];

  const columns = TableColumns(baseColumns);

  const expandColumns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Rate Plan", dataIndex: ["ratePlan", "name"], key: "ratePlan" },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (text) => <div>{String(text)}</div>,
      align: "center",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (text) => <div>{String(text)}</div>,
      align: "center",
    },
    {
      title: "Price (MMK)",
      dataIndex: "price",
      key: "price",
      render: (text) => <PriceTag value={text} />,
      align: "right",
    },
    {
      title: "Action",
      render: (_, record) => {
        const smallStyle = { fontSize: "12px" };

        const actions = [
          {
            key: "view",
            label: "View",
            icon: <EyeOutlined style={{ fontSize: "12px" }} />,
            permission: PERMISSIONS.SEASONAL_RATE_VIEW,
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
            permission: PERMISSIONS.SEASONAL_RATE_EDIT,
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

  const expandedRowRender = (record) => {
    console.log(record, "record");
    return (
      <Table
        className="custom-table-style"
        columns={expandColumns}
        dataSource={record?.rates}
        pagination={false}
        size="small"
        style={{ marginTop: "16px", marginBottom: "16px" }}
      />
    );
  };

  return (
    <div id="scrollId">
      <Table
        tableLayout="fixed"
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={data}
        rowKey="uuid"
        expandable={{ expandedRowRender, defaultExpandedRowKeys: ["0"] }}
        loading={loading}
        pagination={false}
      />

      <SeasonalRateForm
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

export default SeasonalRateTable;
