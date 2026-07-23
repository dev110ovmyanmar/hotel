import { GiMushroomHouse } from "react-icons/gi";
import { Dropdown, Space, Table, Modal, Divider } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import usePermission from "../../../hooks/usePermission";
import { PERMISSIONS } from "../../../variables/permission";
import { TableColumns } from "../../../component/TableColumns/TableColumns";
import RoomRateForm from "../../RoomRate/Components/RoomRateForm/RoomRateForm";
import { textGrayInDarkStyle, textWhiteInDarkStyle } from "../../../utils";

export const PriceTag = ({ value, currency }) => {
  // 1. Convert to a number just in case it's passed as a string
  const numericPrice = typeof value === "string" ? parseFloat(value) : value;

  // 2. Fallback safety if the value is missing or invalid
  if (
    isNaN(numericPrice) ||
    numericPrice === null ||
    numericPrice === undefined
  ) {
    return <span>0 {currency}</span>;
  }

  // 3. Format the number with standard thousands separators (e.g., 15,000)
  const formattedPrice = new Intl.NumberFormat("en-US").format(numericPrice);

  return (
    <span>
      {formattedPrice} {currency}
    </span>
  );
};

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
  const [selectedRatePlanForRoomRate, setSelectedRatePlanForRoomRate] =
    useState(null);
  const [selectedRoomTypeUuid, setSelectedRoomTypeUuid] = useState(null);

  const [isWeekDaysModalOpen, setIsWeekDaysModalOpen] = useState(false);
  const [selectedWeekDayData, setSelectedWeekDayData] = useState(null);

  const showWeekDayModal = (record) => {
    setSelectedWeekDayData(record);
    setIsWeekDaysModalOpen(true);
  };

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
      align: "left",
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
      align: "left",
    },
    {
      title: "Is Default",
      dataIndex: "isDefault",
      key: "isDefault",
      render: (isDefault) => (
        <div
          className={isDefault === true ? "text-[#389E0D]" : "text-[#CF1322]"}
        >
          {isDefault === true ? "True" : "False"}
        </div>
      ),
    },
    {
      title: "Action",
      fixed: "end",
      align: "center",
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
      align: "center",
    },
    {
      title: "Room Type",
      dataIndex: ["roomType", "name"],
      key: "roomType",
      render: (text) => <div>{text}</div>,
      align: "center",
    },
    {
      title: "Price (MMK)",
      dataIndex: "price",
      key: "price",
      // render: (text) => <PriceTag value={text} />,
      render: (text, record) => {
        const hasWeekdays =
          record.weekdays &&
          Object.values(record.weekdays).some((v) => v !== null);
        return (
          <div className="flex gap-2 items-center justify-end">
            <PriceTag value={text} />
            {hasWeekdays && (
              <a
                onClick={() => showWeekDayModal(record)}
                className="text-blue-500 hover:text-blue-700"
              >
                <ExclamationCircleOutlined />
              </a>
            )}
          </div>
        );
      },
      align: "right",
    },
    // {
    //   title: "Duration Hours",
    //   dataIndex: "durationHours",
    //   key: "durationHours",
    //   align: "center",
    //   render: (text) => <div>{text ? text : "-"}</div>,
    // },
    {
      title: "Action",
      align: "center",
      render: (_, roomTypeRecord) => {
        const smallStyle = { fontSize: "12px" };

        const actions = [
          {
            key: "view",
            label: "View",
            icon: <EyeOutlined style={{ fontSize: "12px" }} />,
            permission: PERMISSIONS.RATE_PLAN_VIEW,
            onClick: () => handleViewRoomRate(ratePlanRecord, roomTypeRecord),
          },
          {
            key: "edit",
            label: "Edit",
            icon: <EditOutlined style={{ fontSize: "12px" }} />,
            permission: PERMISSIONS.RATE_PLAN_EDIT,
            onClick: () => handleEditRoomRate(ratePlanRecord, roomTypeRecord),
          },
        ];

        const items = actions
          .filter(
            (action) =>
              (!action.permission || hasPermission(action.permission)) &&
              !action.hidden,
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
        className="expanded-table dark:[&_.ant-table-thead>tr>th]:!text-[#F3F4F6]"
        columns={expandColumns(record)}
        dataSource={processedRates}
        rowKey="uuid"
        pagination={processedRates?.length > 10 ? true : false}
        size="small"
        bordered
        style={{ marginTop: "16px", marginBottom: "16px" }}
      />
    );
  };

  // Helper to get formatted weekday list for the Modal
  const getWeekdayList = (weekdays) => {
    if (!weekdays) return [];
    return [
      { label: "Monday", val: weekdays.mon },
      { label: "Tuesday", val: weekdays.tue },
      { label: "Wednesday", val: weekdays.wed },
      { label: "Thursday", val: weekdays.thu },
      { label: "Friday", val: weekdays.fri },
      { label: "Saturday", val: weekdays.sat },
      { label: "Sunday", val: weekdays.sun },
    ].filter((day) => day.val !== null); // Only keep days that have a price
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
        setPage={() => {}}
      />

      <Modal
        title="Price Overview"
        open={isWeekDaysModalOpen}
        onCancel={() => setIsWeekDaysModalOpen(false)}
        footer={null}
        width={320}
        centered
        styles={{ body: { paddingBottom: "24px" } }}
      >
        {selectedWeekDayData && (
          <div>
            {/* Base Price Section */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <span style={{ color: "#8c8c8c" }}>Base Price</span>
              <span style={{ fontWeight: 600, fontSize: "16px" }}>
                <PriceTag value={selectedWeekDayData.price} currency="MMK" />
              </span>
            </div>

            {getWeekdayList(selectedWeekDayData.weekdays).length > 0 && (
              <>
                <Divider style={{ margin: "12px 0" }} />
                <p
                  style={{
                    fontWeight: 600,
                    marginBottom: "12px",
                    color: "#262626",
                  }}
                  className={textWhiteInDarkStyle}
                >
                  Weekday Prices
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {getWeekdayList(selectedWeekDayData.weekdays).map((day) => (
                    <div
                      key={day.label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "13px",
                      }}
                    >
                      <span
                        style={{ color: "#595959" }}
                        className={textGrayInDarkStyle}
                      >
                        {day.label}
                      </span>
                      <span style={{ fontWeight: 500 }}>
                        <PriceTag value={day.val} currency="MMK" />
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RatePlanTable;
