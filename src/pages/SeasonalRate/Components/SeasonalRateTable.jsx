import { Dropdown, Space, Table, Tag, Modal, Divider } from "antd";
import { useState } from "react";
import {
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import usePermission from "../../../hooks/usePermission";
import SeasonalRateForm from "./SeasonalRateForms/SeasonalRateForm";
import { PERMISSIONS } from "../../../variables/permission";
import PriceTag from "../../../component/PriceTag/PriceTag";
import { TableColumns } from "../../../component/TableColumns/TableColumns";

const SeasonalRateTable = ({
  data,
  page,
  perPage,
  total,
  changePage,
  changePerPage,
  loading,
}) => {
  const { hasPermission } = usePermission();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [selectedData, setSelectedData] = useState(null);

  const [isWeekDaysModalOpen, setIsWeekDaysModalOpen] = useState(false);
  const [selectedWeekDayData, setSelectedWeekDayData] = useState(null);

  const showWeekDayModal = (record) => {
    setSelectedWeekDayData(record);
    setIsWeekDaysModalOpen(true);
  };

  const baseColumns = [
    {
      title: "ID",
      render: (_, record) => <div>{record?.id}</div>,
      width: 70,
    },
    {
      title: "Room Type",
      dataIndex: "name",
      key: "roomTypeName",
      align: "left",
    },
    // {
    //   title: "Total Rooms",
    //   dataIndex: "totalRooms",
    //   key: "totalRooms",
    //   width: "80",
    // },
    // {
    //   title: "Extra Bed",
    //   dataIndex: "extraBed",
    //   key: "extraBed",
    // },
    // {
    //   title: "Max Occupancy",
    //   dataIndex: "maxOccupancy",
    //   key: "maxOccupancy",
    // },
    // {
    //   title: "Price (MMK)",
    //   dataIndex: "basePrice",
    //   key: "basePrice",
    //   render: (text) => <PriceTag value={text} />,
    //   width: "80",
    //   align:"right",
    // },
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

    calculateSpan(["ratePlan", "name"]);
    calculateSpan(["rateCategory", "name"]);

    return newData;
  };

  const expandColumns = [
    { title: "ID", dataIndex: "id", key: "id", align: "center" },
    {
      title: "Rate Plan",
      align: "center",
      dataIndex: ["ratePlan", "name"],
      key: "ratePlan",
      onCell: (record) => ({
        rowSpan: record.ratePlanRowSpan,
        style: { verticalAlign: "middle" },
      }),
    },
    {
      title: "Season Name",
      dataIndex: ["rateCategory", "name"],
      key: "rateCategory",
      align: "center",
      onCell: (record) => ({
        rowSpan: record.rateCategoryRowSpan,
        style: { verticalAlign: "middle" },
      }),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (text) => <div>{String(text)}</div>,
      align: "center",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (text) => <div>{String(text)}</div>,
      align: "center",
    },
    {
      title: "Price (MMK)",
      dataIndex: "price",
      key: "price",
      align: "right",
      render: (text, record) => {
        // Only show the info icon if there are actually weekday prices set
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
            permission: PERMISSIONS.SEASONAL_RATE_VIEW,
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
            permission: PERMISSIONS.SEASONAL_RATE_EDIT,
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
    const processedRates = processData(record?.rates || []);
    return (
      <Table
        className="expanded-table dark:[&_.ant-table-thead>tr>th]:!text-[#F3F4F6]"
        columns={expandColumns}
        dataSource={processedRates}
        pagination={false}
        size="small"
        bordered
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
        expandable={{ expandedRowRender, defaultExpandedRowKeys: ["0"] }}
        loading={loading}
        pagination={false}
      />

      <SeasonalRateForm
        page={page}
        mode={mode}
        setMode={setMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
      />

      <Modal
        title="Price Overview"
        open={isWeekDaysModalOpen}
        onCancel={() => setIsWeekDaysModalOpen(false)}
        footer={null}
        width={350}
        centered
        styles={{ body: { paddingBottom: "24px" } }}
      >
        {selectedWeekDayData && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
                marginTop: "20px"
              }}
            >
              <span style={{ color: "#5b5959" }}>Base Price</span>
              <div
                style={{
                  display: "flex",
                  gap: "4px",
                  alignItems: "center",
                  fontWeight: 400,
                  fontSize: "14px",
                }}
              >
                <PriceTag value={selectedWeekDayData.price} />
                <span className="font-normal text-[#979797]">MMK</span>
              </div>
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
                  className="dark:!text-gray-200"
                >
                  Weekday Rates
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
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                        marginTop: "10px"
                      }}
                    >
                      <span style={{ color: "#595959" }}>{day.label}</span>
                      <div
                        style={{
                          display: "flex",
                          gap: "4px",
                          alignItems: "center",
                          fontWeight: 400,
                          fontSize: "14px",
                        }}
                      >
                        <PriceTag value={day.val} />
                        <span className="font-normal text-[#979797]">MMK</span>
                      </div>
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

export default SeasonalRateTable;
