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

  // Process data to calculate rowSpan for rate plans and rate category
  const processData = (data) => {
    if (!data) return [];
    const newData = data.map(item => ({ ...item })); // Shallow clone to avoid mutating props

    const calculateSpan = (keyPath) => {
      let i = 0;
      while (i < newData.length) {
        // Access nested properties like ['ratePlan', 'name']
        const getValue = (obj) => keyPath.reduce((acc, key) => acc?.[key], obj);

        let currentVal = getValue(newData[i]);
        let count = 1;

        for (let j = i + 1; j < newData.length; j++) {
          if (getValue(newData[j]) === currentVal) {
            count++;
          } else {
            break;
          }
        }

        // Dynamically set the span key, e.g., ratePlanRowSpan or rateCategoryRowSpan
        const spanKey = `${keyPath[0]}RowSpan`;
        newData[i][spanKey] = count;

        for (let k = i + 1; k < i + count; k++) {
          newData[k][spanKey] = 0;
        }
        i += count;
      }
    };

    calculateSpan(["ratePlan", "name"]);
    calculateSpan(["rateCategory", "name"]);

    return newData;
  };

  const expandColumns = [
    { title: "ID", dataIndex: "id", key: "id", align: "center" },
    {
      title: "Rate Plan",
      align: "center",
      dataIndex: ["ratePlan", "name"],
      key: "ratePlan",
      onCell: (record) => ({
        rowSpan: record.ratePlanRowSpan,
        style: { verticalAlign: "middle" },
      }),
    },
    {
      title: "Season Name",
      dataIndex: ["rateCategory", "name"],
      key: "rateCategory",
      align: "center",
      onCell: (record) => ({
        rowSpan: record.rateCategoryRowSpan,
        style: { verticalAlign: "middle" },
      }),
    },
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
      align: "center",
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
    const processedRates = processData(record?.rates || []);
    return (
      <Table
        // className="custom-table-style"
        className="[&_.ant-table-cell]:!border [&_.ant-table-cell]:!border-blue-300 [&_.ant-table-thead>tr>th]:!bg-[#F0F5FF]"
        columns={expandColumns}
        // dataSource={record?.rates}
        dataSource={processedRates}
        pagination={false}
        size="small"
        style={{ marginTop: "16px", marginBottom: "16px" }}
        bordered
        className="[&_.ant-table-cell]:!border [&_.ant-table-cell]:!border-blue-300 [&_.ant-table-thead>tr>th]:!bg-[#F0F5FF]"
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
