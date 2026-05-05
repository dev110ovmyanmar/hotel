import { Dropdown, Space, Table, Tag } from "antd";
import { useState } from "react";
import {
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
// import { PERMISSIONS } from "../../../variables/permission";
import usePermission from "../../../hooks/usePermission";
import RoomRestrictionForm from "./RoomRestrictionForms/RoomRestrictionForm";
import PriceTag from "../../../component/PriceTag/PriceTag";

const RoomRestrictionTable = ({ data, page, setPage }) => {
  //   const { hasPermission } = usePermission();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [selectedData, setSelectedData] = useState({});
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

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
    },
  ];

  // Process data to calculate rowSpan for rate plans
  const processData = (data) => {
    const newData = [...data];

    let i = 0;
    while (i < newData.length) {
      let current = newData[i];
      let count = 1;

      for (let j = i + 1; j < newData.length; j++) {
        if (newData[j]?.ratePlan?.name === current?.ratePlan?.name) {
          count++;
        } else {
          break;
        }
      }

      newData[i].rowSpan = count;

      for (let k = i + 1; k < i + count; k++) {
        newData[k].rowSpan = 0;
      }

      i += count;
    }

    return newData;
  };

  const expandColumns = [
    { title: "ID", dataIndex: "id", key: "id", align: "center" },
    {
      title: "Rate Plan", dataIndex: ["ratePlan", "name"], key: "ratePlan", align: "center",
      onCell: (record) => ({
        rowSpan: record.rowSpan,
        style: { verticalAlign: "middle" },
      }),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => <div>{String(text)}</div>,
      align: "center",
    },
    {
      title: "Min Stay",
      dataIndex: "minStay",
      key: "minStay",
      align: "center"
    },
    {
      title: "Max Stay",
      dataIndex: "maxStay",
      key: "maxStay",
      align: "center"
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
            // permission: PERMISSIONS.ROOM_RESTRICTION_VIEW,
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
            // permission: PERMISSIONS.ROOM_RESTRICTION_EDIT,
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
    const processedRates = processData(record?.calendars || []);
    return (
      <Table
        // className="custom-table-style"
        className="[&_.ant-table-cell]:!border [&_.ant-table-cell]:!border-blue-300 [&_.ant-table-thead>tr>th]:!bg-[#F0F5FF]"
        columns={expandColumns}
        // dataSource={record?.calendars}
        dataSource={processedRates}
        pagination={false}
        size="small"
        style={{ marginTop: "16px", marginBottom: "16px" }}
        bordered
      />
    );
  };

  return (
    <div id="scrollId" className="w-full h-[63vh]">
      <Table
        tableLayout="fixed"
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.roomType?.id}
        pagination={false}
        expandable={{ expandedRowRender, defaultExpandedRowKeys: ["0"] }}
      />

      <RoomRestrictionForm
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

export default RoomRestrictionTable;
