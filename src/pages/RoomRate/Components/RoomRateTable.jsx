import { Button, Dropdown, Modal, Space, Table, Tag } from "antd";
import { useState } from "react";
import {
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import usePermission from "../../../hooks/usePermission"; // <-- Permission hook
import { PERMISSIONS } from "../../../variables/permission";
import ColorStatusTag from './../../../component/ColorStatusTag/ColorStatusTag';
import RoomRateForm from "../Components/RoomRateForm/RoomRateForm";

const RoomRateTable = ({
  data,
  page,
  perPage,
  total,
  changePage,
  changePerPage,
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
    {
      title: "Rate Plan",
      dataIndex: ["ratePlan", "name"],
      key: "ratePlan",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Room Type",
      dataIndex: ["roomType", "name"],
      key: "roomType",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Price (MMK)",
      dataIndex: "price",
      key: "price",
      render: (text) => <div>{text} </div>,
    },
    {
      title: "Duration Hours",
      dataIndex: "durationHours",
      key: "durationHours",
      render: (text) => <div>{text? text : "-"}</div>,
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
            // permission: PERMISSIONS.ROOM_RATE_VIEW,
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
            // permission: PERMISSIONS.ROOM_RATE_EDIT,
            onClick: () => {
              setDrawerOpen(true);
              setMode("edit");
              setSelectedData(record);
            },
          },
        ];

        const items = actions
          .filter(
            (action) =>
              (!action.permission || hasPermission(action.permission)) && !action.hidden,
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
        rowKey="roomrate"
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

      <RoomRateForm
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

export default RoomRateTable;
