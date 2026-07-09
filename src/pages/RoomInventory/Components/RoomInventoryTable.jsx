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
import BooleanTag from "../../../component/BooleanTag/BooleanTag";
import PriceTag from "../../../component/PriceTag/PriceTag";
import { TableColumns } from "../../../component/TableColumns/TableColumns";

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

  const baseColumns = [
    {
      title: "ID",
      render: (_, record) => <div>{record?.id}</div>,
      width: 50,
    },
    {
      title: "Room Type",
      dataIndex: "name",
      key: "name",
      width: 200,
      align: "left",
    },
    {
      title: "Total Rooms",
      dataIndex: "totalRooms",
      key: "totalRooms",
    },
    {
      title: "Extra Bed",
      dataIndex: "extraBed",
      key: "extraBed",
      render: (text) => text || "-",
    },
    {
      title: "Max Occupancy",
      fixed:"end",
      align: "center",
      dataIndex: "maxOccupancy",
      key: "maxOccupancy",
    },
    // {
    //   title: "Base Price (MMK)",
    //   dataIndex: "basePrice",
    //   key: "basePrice",
    //   align: "end",
    //   render: (text) => <PriceTag value={text} />,
    // },
    // {
    //   title: "Stop Sell",
    //   dataIndex: "stopSell",
    //   key: "stopSell",
    //   render: (_, record) => {
    //     const isPastOrToday = dayjs(record.date).isSameOrBefore(dayjs(), "day");

    //     const switchComponent = (
    //       <Switch
    //         checked={record.stopSell === true}
    //         loading={updatingId === record.id}
    //         disabled={isPastOrToday || updatingId === record.id}
    //         onChange={(checked) => {
    //           setSelectedRecord(record);
    //           setSwitchValue(checked);
    //           setConfirmOpen(true);
    //         }}
    //       />
    //     );

    //     if (isPastOrToday) {
    //       return (
    //         <Tooltip title="Cannot modify past or today dates">
    //           {switchComponent}
    //         </Tooltip>
    //       );
    //     }

    //     return switchComponent;
    //   },
    // },
  ];

  const columns = TableColumns(baseColumns);

  const expandColumns = [
    { title: "ID", dataIndex: "id", key: "id", align: "center", width: 70 },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      align: "center",
      width: 150,
    },

    {
      title: "Available Rooms",
      dataIndex: "availableRooms",
      key: "availableRooms",
      width: 150,
      align: "center",
      render: (text) => <div>{text ? text : "-"}</div>,
    },
    {
      title: "Sold Rooms",
      dataIndex: "SoldRooms",
      key: "soldRooms",
      width: 150,
      align: "center",
      render: (text) => <div>{text ? text : "-"}</div>,
    },
    {
      title: "Stop Sell",
      dataIndex: "stopSell",
      key: "stopSell",
      width: 150,
      align: "center",
      render: (_, record) => {
        const isPastOrToday = dayjs(record.date).isSameOrBefore(dayjs(), "day");
        const isDisabled = isPastOrToday || updatingId === record.id;
        const switchComponent = (
          <Switch
            checked={record.stopSell === true}
            loading={updatingId === record.id}
            disabled={isDisabled}
            style={{
              opacity: isDisabled ? 0.2 : 1,
              backgroundColor: record.stopSell ? "#ff4d4f" : "#56ec0b",
            }}
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
      title: "Action",
      align:"center",
      width: 150,
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

  const expandedRowRender = (record) => {
    console.log(record, "record");
    return (
      <Table
        // className="custom-table-style"
        className="[&_.ant-table-cell]:!border [&_.ant-table-cell]:!border-blue-300 [&_.ant-table-thead>tr>th]:!bg-[#F0F5FF]"
        columns={expandColumns}
        dataSource={record?.calendars}
        rowKey="uuid"
        pagination={false}
        size="small"
        style={{ marginTop: "16px", marginBottom: "16px" }}
      />
    );
  };

  return (
    <div id="scrollId" className="w-full h-[63vh] ">
      <Table
        tableLayout="fixed"
        scroll={{ x: 1000 }}
        columns={columns}
        pagination={false}
        dataSource={data}
        rowKey="uuid"
        expandable={{ expandedRowRender, defaultExpandedRowKeys: ["0"] }}
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
        title={"Confirm Stop Selling ?"}
        okText="Confirm"
        cancelText="Cancel"
        confirmLoading={updateStopSelling.isLoading}
        onOk={handleConfirmStopSell}
        onCancel={() => {
          setConfirmOpen(false);
        }}
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
