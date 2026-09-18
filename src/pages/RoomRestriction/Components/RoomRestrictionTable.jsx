import { Dropdown, Modal, Space, Switch, Table, Tag, Tooltip } from "antd";
import { useState } from "react";
import {
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import { PERMISSIONS } from "../../../variables/permission";
import usePermission from "../../../hooks/usePermission";
import RoomRestrictionForm from "./RoomRestrictionForms/RoomRestrictionForm";
import PriceTag from "../../../component/PriceTag/PriceTag";
import dayjs from "dayjs";
import { updateStopSell } from "../../../api/roomrestriction";
import { useApiMutation } from "../../../hooks/useApiMutation";
import isSameOrBeforePlugin from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrBeforePlugin);

const RoomRestrictionTable = ({ data, page, setPage, loading }) => {
  const { hasPermission } = usePermission();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [selectedData, setSelectedData] = useState({});
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [switchValue, setSwitchValue] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const updateStopSelling = useApiMutation({
    mutationFn: updateStopSell,
    invalidateKeys: [["roomRestriction"]],
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
      title: "Rate Plan",
      dataIndex: ["ratePlan", "name"],
      key: "ratePlan",
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
      align: "center",
    },
    {
      title: "Max Stay",
      dataIndex: "maxStay",
      key: "maxStay",
      align: "center",
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
      align: "center",
      render: (_, record) => {
        const smallStyle = { fontSize: "12px" };

        const actions = [
          {
            key: "view",
            label: "View",
            icon: <EyeOutlined style={{ fontSize: "12px" }} />,
            permission: PERMISSIONS.ROOM_RESTRICTION_VIEW,
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
            permission: PERMISSIONS.ROOM_RESTRICTION_EDIT,
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
        className="expanded-table dark:[&_.ant-table-thead>tr>th]:!text-[#F3F4F6]"
        columns={expandColumns}
        dataSource={processedRates}
        pagination={false}
        size="small"
        bordered
        rowKey="uuid"
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
        loading={loading}
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

export default RoomRestrictionTable;
