import { Button, Dropdown, Modal, Space, Table, Tag } from "antd";
import { useState } from "react";
import {
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import usePermission from "../../../hooks/usePermission"; // <-- Permission hook
import { PERMISSIONS } from "../../../variables/permission";
import RoomRateForm from "../Components/RoomRateForm/RoomRateForm";
import PriceTag from "../../../component/PriceTag/PriceTag";

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
      title: "Room Type",
      dataIndex: ["roomType", "name"],
      key: "roomType",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Price (MMK)",
      dataIndex: "price",
      key: "price",
      render: (text) => <PriceTag value={text} />
    },
    {
      title: "Duration Hours",
      dataIndex: "durationHours",
      key: "durationHours",
      align: "center",
      render: (text) => <div>{text ? text : "-"}</div>,
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
      {/* <Table
        tableLayout="fixed"
        scroll={{ x: 1000 }}j
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
        classNames="!mb-50"
      /> */}
      <div className="flex-1 overflow-auto">
        <Table
          tableLayout="fixed"
          scroll={{ x: 1000, y: "calc(100vh - 360px)" }} // 👈 key fix
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
      </div>

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
