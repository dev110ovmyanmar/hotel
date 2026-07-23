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
      title: "Rate Plan",
      dataIndex: ["ratePlan", "name"],
      key: "ratePlan",
      align: "center",
      width: 150,
      onCell: (record) => ({
        rowSpan: record.ratePlanRowSpan,
        style: { verticalAlign: "middle" },
      }),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      align: "center",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      align: "center",
    },

    {
      title: "Extra Type",
      dataIndex: ["extraType", "name"],
      align: "center",
      key: "extraType",
      onCell: (record) => ({
        rowSpan: record.extraTypeRowSpan,
        style: { verticalAlign: "middle" },
      }),
      render: (text, record) => {
        if (
          record.extraType?.code === "extra_person" ||
          record.code === "extra_person"
        ) {
          const minAge = record.minAge;
          const maxAge = record.maxAge;

          if (minAge !== undefined && maxAge !== undefined) {
            const ageText =
              minAge === maxAge
                ? `(${minAge})`
                : `(${minAge} - ${maxAge}) years`;
            return `${text} ${ageText}`;
          }
        }

        return text;
      },
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
      align: "center",
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

  // Process data to calculate rowSpan for rate plans
  const processData = (data) => {
    if (!data) return [];
    const newData = data.map((item) => ({ ...item })); // Shallow clone to avoid mutating props

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

        // Dynamically set the span key, e.g., ratePlanRowSpan or ageTypeRowSpan
        const spanKey = `${keyPath[0]}RowSpan`;
        newData[i][spanKey] = count;

        for (let k = i + 1; k < i + count; k++) {
          newData[k][spanKey] = 0;
        }
        i += count;
      }
    };

    calculateSpan(["ratePlan", "name"]);
    calculateSpan(["ageType", "name"]);

    return newData;
  };

  const expandedRowRender = (record) => {
    const processedRates = processData(record?.rates || []);
    return (
      <Table
        className="expanded-table dark:[&_.ant-table-thead>tr>th]:!text-[#F3F4F6]"
        columns={nestedColumns}
        dataSource={processedRates}
        bordered
        pagination={processedRates?.length > 10 ? true : false}
        rowKey="id"
        size="small"
      />
    );
  };

  const columns = [
    {
      title: "ID",
      dataIndex: ["roomType", "id"],
      key: "id",
      width: 70,
    },
    {
      title: "Room Type",
      dataIndex: ["roomType", "name"],
      key: "roomType",
      align: "left",
    },
    // {
    //   title: "Base Price (MMK)",
    //   dataIndex: ["roomType", "basePrice"],
    //   key: "basePrice",
    //   render: (price) => price?.toLocaleString(),
    //   align: "end",
    // },
  ];

  return (
    <div id="scrollId" className="w-full h-[63vh]">
      <Table
        tableLayout="fixed"
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={data}
        pagination={false}
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
