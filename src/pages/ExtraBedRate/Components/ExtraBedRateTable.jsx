import { Dropdown, Space, Table } from "antd";
import { useState } from "react";
import { MoreOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import { PERMISSIONS } from "../../../variables/permission";
import usePermission from "../../../hooks/usePermission";
import ExtraBedRateForm from "./ExtraBedRateForms/ExtraBedRateForm";

const ExtraBedRateTable = ({ data, page, setPage }) => {
  const { hasPermission } = usePermission();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [selectedData, setSelectedData] = useState({});
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const nestedColumns = [
    {
      title: "ID",
      render: (_, record) => <div>{record?.id}</div>,
      width: 70,
      align: "center",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: "Age Type",
      dataIndex: ["ageType", "name"],
      key: "ageType",
    },
    {
      title: "Rate Plan",
      dataIndex: ["ratePlan", "name"],
      key: "ratePlan",
      width: 150
    },
    {
      title: "Price (MMK)",
      dataIndex: "price",
      key: "price",
      align: "right",
      width: 100,
      render: (price) => price?.toLocaleString(),
    },
    {
      title: "Action",
      render: (_, record) => {
        const actions = [
          {
            key: "view",
            label: "View",
            icon: <EyeOutlined style={{ fontSize: "12px" }} />,
            permission: PERMISSIONS.EXTRA_BED_RATE_VIEW,
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
            permission: PERMISSIONS.EXTRA_BED_RATE_EDIT,
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
              <Space size={4} onClick={action.onClick}>
                {action.icon}
                <span>{action.label}</span>
              </Space>
            ),
          }));

        if (items.length === 0) return null;

        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <MoreOutlined style={{ fontSize: "16px", cursor: "pointer" }} />
          </Dropdown>
        );
      },
    },
  ];

  const expandedRowRender = (record) => (
    <Table
      className="custom-table-style"
      columns={nestedColumns}
      dataSource={record.rates || []}
      pagination={false}
      rowKey="id"
      size="small"
      style={{ marginTop: "16px", marginBottom: "16px" }}
    />
  );

  const columns = [
    {
      title: "ID",
      dataIndex: ["roomType", "id"],
      key: "id",
    },
    {
      title: "Room Type",
      dataIndex: ["roomType", "name"],
      key: "roomType",
    },
    {
      title: "Base Price (MMK)",
      dataIndex: ["roomType", "basePrice"],
      key: "basePrice",
      render: (price) => price?.toLocaleString(),
      align: "end",
    },
  ];

  return (
    <div id="scrollId" className="w-full h-[63vh]">
      <Table
        tableLayout="fixed"
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.roomType?.id}
        expandable={{
          expandedRowKeys,


          onExpand: (expanded, record) => {
            const key = record.roomType?.id;

            setExpandedRowKeys((prev) =>
              expanded ? [...prev, key] : prev.filter((k) => k !== key),
            );
          },
          expandedRowRender,
          rowExpandable: (record) => record.rates && record.rates.length > 0,
        }}
      />

      <ExtraBedRateForm
        page={page}
        setPage={setPage}
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

export default ExtraBedRateTable;
