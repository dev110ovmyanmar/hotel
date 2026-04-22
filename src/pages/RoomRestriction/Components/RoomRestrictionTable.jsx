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

    {
      title: "Price (MMK)",
      dataIndex: ["roomType", "basePrice"],
      key: "basePrice",
      render: (text) => <PriceTag value={text} />,
      align: "right",
    },

    // {
    //   title: "Closed To Arrival ",
    //   dataIndex: "closedToArrival",
    //   key: "closedToArrival",
    //   render: (_, record) => (
    //     <Tag color={record.closedToArrival ? "green" : "red"}>
    //       {record.closedToArrival ? "TRUE" : "FALSE"}
    //     </Tag>
    //   ),
    // },
    // {
    //   title: "Closed To Departure ",
    //   dataIndex: "closedToDeparture",
    //   key: "closedToDeparture",
    //   render: (_, record) => (
    //     <Tag color={record.closedToDeparture ? "green" : "red"}>
    //       {record.closedToDeparture ? "TRUE" : "FALSE"}
    //
  ];

  const expandColumns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Rate Plan", dataIndex: ["ratePlan", "name"], key: "ratePlan" },
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
    },
    {
      title: "Max Stay",
      dataIndex: "maxStay",
      key: "maxStay",
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
    console.log(record, "record");
    return (
      <Table
        className="custom-table-style"
        columns={expandColumns}
        dataSource={record?.calendars}
        pagination={false}
        size="small"
        style={{ marginTop: "16px", marginBottom: "16px" }}
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
