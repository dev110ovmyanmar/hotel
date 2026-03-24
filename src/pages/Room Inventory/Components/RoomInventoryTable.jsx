 
 import { Dropdown, Space, Table, Tag, Button, Switch, Modal } from "antd";
import { useState } from "react";
import { MoreOutlined } from "@ant-design/icons";
import { EyeOutlined } from "@ant-design/icons";
import { EditOutlined } from "@ant-design/icons";
import { PERMISSIONS } from "../../../variables/permission";
import usePermission from "../../../hooks/usePermission";
import RoomInventoryForm from "./RoomInventoryForm/RoomInventoryForm";

const RoomInventoryTable = ({
  data,
  page,
  setPage,
  perPage,
  total,
  changePage,
  changePerPage,
}) => {
  const { hasPermission } = usePermission();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [selectedData, setSelectedData] = useState({});

  const columns = [
    {
      title: "ID",
      render: (_, record) => <div>{record?.id}</div>,
      width: "10%"
    },
    {
      title: "Name",
      dataIndex: ["roomType", "name"],
      key: "name",
    },
    {
      title: "Available Rooms",
      dataIndex: "availableRooms",
      key: "availableRooms",
    },
    {
      title: "Sold Rooms",
      dataIndex: "soldRooms",
      key: "soldRooms",
    },
    // {
    //   title: "Stop Sell",
    //   dataIndex: "stopSell",
    //   key: "stopSell",
    //   render: (_, record) => (
    //     <Tag color={record.stopSell ? "green" : "red"}>
    //       {record.stopSell ? "TRUE" : "FALSE"}
    //     </Tag>
    //   ),
    // },
    {
  title: "Stop Sell",
  dataIndex: "stopSell",
  key: "stopSell",
  render: (_, record) => (
    <Switch
      checked={record.stopSell} // current status
      onChange={(checked) => {
        Modal.confirm({
          title: `Are you sure you want to set Stop Sell to ${checked ? "TRUE" : "FALSE"}?`,
          okText: "Yes",
          cancelText: "No",
          onOk: () => {
            // Update the record state here
            record.stopSell = checked;

            // Optional: Call API to save change
            // updateStopSell(record.id, checked)
          },
          onCancel: () => {
            // If canceled, revert the switch back
            // This is needed because Switch already changed its visual state
            record.stopSell = !checked;
          },
        });
      }}
    />
  ),
},
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
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
            permission: PERMISSIONS.SERVICE_VIEW,
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
            permission: PERMISSIONS.SERVICE_EDIT,
            onClick: () => {
              setDrawerOpen(true);
              setMode("edit");
              setSelectedData(record);
            },
          },
        ];

        // Filter actions by permission
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

      <RoomInventoryForm
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

export default RoomInventoryTable;
