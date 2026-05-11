import { GiMushroomHouse } from "react-icons/gi";
import { Dropdown, Space, Table } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import usePermission from "../../../hooks/usePermission";
import { PERMISSIONS } from "../../../variables/permission";
import { TableColumns } from "../../../component/TableColumns/TableColumns";
import PriceTag from "../../../component/PriceTag/PriceTag";
import RoomRateForm from "../../RoomRate/Components/RoomRateForm/RoomRateForm";

const RatePlanTable = ({
  data,
  page,
  perPage,
  total,
  changePage,
  changePerPage,
  loading,
  setDrawerOpen,
  setMode,
  setSelectedData,
}) => {
  const { hasPermission } = usePermission();

  const [roomRateDrawerOpen, setRoomRateDrawerOpen] = useState(false);
  const [roomRateMode, setRoomRateMode] = useState(null);
  const [selectedRoomRateData, setSelectedRoomRateData] = useState(null);
  const [selectedRatePlanForRoomRate, setSelectedRatePlanForRoomRate] = useState(null);
  const [selectedRoomTypeUuid, setSelectedRoomTypeUuid] = useState(null);

  const navigate = useNavigate();

  const baseColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Policy",
      dataIndex: ["policy", "name"],
      key: "policy",
    },
    {
      title: "Meal Plan",
      dataIndex: ["mealPlan", "name"],
      key: "mealPlan",
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
            permission: PERMISSIONS.RATE_PLAN_VIEW,
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
            permission: PERMISSIONS.RATE_PLAN_EDIT,
            onClick: () => {
              setDrawerOpen(true);
              setMode("edit");
              setSelectedData(record);
            },
          },
          // {
          //   key: "roomRate",
          //   label: "Room Rate",
          //   icon: <GiMushroomHouse style={{ fontSize: "12px" }} />,
          //   // permission: PERMISSIONS.RATE_PLAN_EDIT,
          //   onClick: () => {
          //     navigate(
          //       `/rates-availability/rate-plans/${record?.id}/room-rate`,
          //       { state: { ratePlan: record } }
          //     )
          //   },
          // },
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


  const columns = TableColumns(baseColumns);

  // Process data to calculate rowSpan for rate plans and rate category
  const processData = (data) => {
    if (!data) return [];
    const newData = data.map(item => ({ ...item })); // Shallow clone to avoid mutating props

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

        // Dynamically set the span key, e.g., ratePlanRowSpan or rateCategoryRowSpan
        const spanKey = `${keyPath[0]}RowSpan`;
        newData[i][spanKey] = count;

        for (let k = i + 1; k < i + count; k++) {
          newData[k][spanKey] = 0;
        }
        i += count;
      }
    };

    calculateSpan(["name"]);

    return newData;
  };


  const handleEditRoomRate = (ratePlan, roomType) => {
    setSelectedRatePlanForRoomRate(ratePlan);
    setSelectedRoomTypeUuid(roomType.uuid);
    setSelectedRoomRateData(roomType);
    setRoomRateMode("edit");
    setRoomRateDrawerOpen(true);
  };


  const handleViewRoomRate = (ratePlan, roomType) => {
    setSelectedRatePlanForRoomRate(ratePlan);
    setSelectedRoomTypeUuid(roomType.uuid);
    setSelectedRoomRateData(roomType);
    setRoomRateMode("view");
    setRoomRateDrawerOpen(true);
  };


  const expandColumns = (ratePlanRecord) => [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      align: "center"
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
      render: (_, roomTypeRecord) => {
        const smallStyle = { fontSize: "12px" };

        const actions = [
          {
            key: "view",
            label: "View",
            icon: <EyeOutlined style={{ fontSize: "12px" }} />,
            // permission: PERMISSIONS.ROOM_RATE_VIEW,
            onClick: () => handleViewRoomRate(ratePlanRecord, roomTypeRecord),
          },
          {
            key: "edit",
            label: "Edit",
            icon: <EditOutlined style={{ fontSize: "12px" }} />,
            onClick: () => handleEditRoomRate(ratePlanRecord, roomTypeRecord),
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

  const expandedRowRender = (record) => {
    const processedRates = processData(record?.roomRateMappings || []);
    return (
      <Table
        className="[&_.ant-table-cell]:!border [&_.ant-table-cell]:!border-blue-300 [&_.ant-table-thead>tr>th]:!bg-[#F0F5FF]"
        columns={expandColumns(record)}
        dataSource={processedRates}
        rowKey="uuid"
        pagination={false}
        size="small"
        style={{ marginTop: "16px", marginBottom: "16px" }}
        bordered
      />
    );
  };

  return (
    <div id="scrollId">
      <Table
        tableLayout="fixed"
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={data}
        rowKey="uuid"
        loading={loading}
        expandable={{ expandedRowRender, defaultExpandedRowKeys: ["0"] }}
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
        mode={roomRateMode}
        setMode={setRoomRateMode}
        drawerOpen={roomRateDrawerOpen}
        setDrawerOpen={setRoomRateDrawerOpen}
        selectedData={selectedRoomRateData}
        setSelectedData={setSelectedRoomRateData}
        ratePlan={selectedRatePlanForRoomRate}
        // roomRateUuid={selectedRoomTypeUuid}
        roomRateUuid={selectedRoomTypeUuid}
        page={page}
        setPage={() => { }}
      />
    </div>
  );
};

export default RatePlanTable;
