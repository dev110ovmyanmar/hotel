import { Dropdown, Space, Table, Switch, Modal } from "antd";
import { useState } from "react";
import { MoreOutlined } from "@ant-design/icons";
import { EyeOutlined } from "@ant-design/icons";
import { EditOutlined } from "@ant-design/icons";
import { PERMISSIONS } from "../../../variables/permission";
import usePermission from "../../../hooks/usePermission";
import RoomInventoryForm from "./RoomInventoryForm/RoomInventoryForm";
import { updateStopSell } from "../../../api/availabilityCalendarApi";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { Tooltip } from "antd";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrBefore);

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

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [switchValue, setSwitchValue] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const updateStopSelling = useApiMutation({
    mutationFn: updateStopSell,
    invalidateKeys: [["availabilty-calendars"]],
  });

  const handleConfirmStopSell = () => {
    const params = {
      uuid: selectedRecord?.uuid,
      stopSell: switchValue,
    };

    updateStopSelling.mutate(params, {
      onSuccess: () => {
        setConfirmOpen(false);
        Toast.success("Stop Selling Updated Successfully!");
      },
    });
  };

  const columns = [
    {
      title: "ID",
      render: (_, record) => <div>{record?.id}</div>,
      width: "10%",
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
    // {
    //   title: "Stop Sell",
    //   dataIndex: "stopSell",
    //   key: "stopSell",
    //   render: (_, record) => (
    //     <Switch
    //       checked={record.stopSell === true}
    //       onChange={(checked) => {
    //         setSelectedRecord(record);
    //         setSwitchValue(checked);
    //         setConfirmOpen(true);
    //       }}
    //     />
    //   ),
    // },
    {
  title: "Stop Sell",
  dataIndex: "stopSell",
  key: "stopSell",
  render: (_, record) => {
    const isPastOrToday = dayjs(record.date).isSameOrBefore(dayjs(), "day");

    const switchComponent = (
      <Switch
        checked={record.stopSell === true}
        loading={updatingId === record.id}
        disabled={isPastOrToday || updatingId === record.id}
        onChange={(checked) => {
          setSelectedRecord(record);
          setSwitchValue(checked);
          setConfirmOpen(true);
        }}
      />
    );

    if (isPastOrToday) {
      return (
        <Tooltip title="Cannot modify past or today dates">
          {switchComponent}
        </Tooltip>
      );
    }

    return switchComponent;
  },
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

      <Modal
        open={confirmOpen}
        title={"Confirm Stop Selling"}
        okText="Confirm"
        cancelText="Cancel"
        confirmLoading={updateStopSelling.isLoading}
        onOk={handleConfirmStopSell}
        onCancel={() => {setConfirmOpen(false)}}
      >
        <p>
          Are you sure you want to stop selling{" "}
          <strong>{selectedRecord?.roomType?.name}</strong> for{" "}
          <strong>{selectedRecord?.date}</strong>?
        </p>
      </Modal>
    </div>
  );
};

export default RoomInventoryTable;
