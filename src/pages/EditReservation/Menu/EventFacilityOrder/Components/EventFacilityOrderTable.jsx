import { Dropdown, Space, Table, Button, Tooltip } from "antd";
import { useState, useEffect } from "react";
import {
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  PlusOutlined,
  InboxOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import EventFacilityOrderForm from "./EventFacilityOrderForms/EventFacilityOrderForm";
import dayjs from "dayjs";
import ColorStatusTag from "../../../../../component/ColorStatusTag/ColorStatusTag";
import { PERMISSIONS } from "../../../../../variables/permission";
import usePermission from "../../../../../hooks/usePermission";

const EventFacilityOrderTable = ({
  data,
  page,
  perPage,
  total,
  changePage,
  changePerPage,
  loading,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedData, setSelectedData] = useState(null);

  // useEffect(() => {
  //   const savedEvents = JSON.parse(localStorage.getItem("events")) || [];
  //   setDataSource(savedEvents);
  // }, []);

  // const refreshData = () => {
  //   const savedEvents = JSON.parse(localStorage.getItem("events")) || [];
  //   setDataSource(savedEvents);
  // };

  // const columns = [
  //   { title: "Order ID", dataIndex: "id", key: "id" },
  //   { title: "Event Name", dataIndex: "name", key: "name" },
  //   { title: "Guest Name", dataIndex: "name", key: "name" },
  //   {
  //     title: "Start Date Time",
  //     key: "startDateTime",
  //     render: (_, record) => {
  //       const date = record.startDate
  //         ? dayjs(record.startDate).format("DD/MM/YYYY")
  //         : "-";
  //       const time = record.startTime
  //         ? dayjs(record.startTime).format("h:mm A")
  //         : "";
  //       return (
  //         <div>
  //           <div className="font-medium">{date}</div>
  //           <div className="text-xs text-gray-500">{time}</div>
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     title: "End Date Time",
  //     key: "endDateTime",
  //     render: (_, record) => {
  //       const date = record.endDate
  //         ? dayjs(record.endDate).format("DD/MM/YYYY")
  //         : "-";
  //       const time = record.endTime
  //         ? dayjs(record.endTime).format("h:mm A")
  //         : "";
  //       return (
  //         <div>
  //           <div className="font-medium">{date}</div>
  //           <div className="text-xs text-gray-500">{time}</div>
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     title: "Status",
  //     dataIndex: "status",
  //     key: "status",
  //   },
  //   {
  //     title: "Guest Name",
  //     dataIndex: "guestName",
  //     key: "guestName",
  //   },

  //   {
  //     title: "Action",
  //     fixed:"end",
  //     align: "center",
  //     render: (_, record) => (
  //       <Space size="middle">
  //         <Tooltip title="View Details">
  //           <EyeOutlined
  //             onClick={() => {
  //               setSelectedData(record);
  //               setMode("view");
  //               setDrawerOpen(true);
  //             }}
  //           />
  //         </Tooltip>

  //         <Tooltip title="Edit">
  //           <EditOutlined
  //             onClick={() => {
  //               setSelectedData(record);
  //               setMode("edit");
  //               setDrawerOpen(true);
  //             }}
  //           />
  //         </Tooltip>
  //       </Space>
  //     ),
  //   },
  // ];
  const { hasPermission } = usePermission();

  const columns = [
    {
      title: "ID",
      render: (_, record) => <div>{record?.id}</div>,
      width: 70,
      align: "center",
    },
    {
      title: "Guest Name",
      dataIndex: "guestName",
      key: "guestName",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Guest Phone No.",
      dataIndex: "guestPhone",
      key: "guestPhone",
      width: 150,
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Event Name",
      dataIndex: "eventName",
      key: "eventName",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Package Name",
      dataIndex: ["facilityPackage", "name"],
      key: "facilityPackage",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Event Date",
      dataIndex: "eventDate",
      key: "eventDate",
      width: 120,
      render: (text) => (
        <div>{text ? dayjs(text, "YYYY-MM-DD").format("DD-MM-YYYY") : "-"}</div>
      ),
    },
    {
      title: "Event Time",
      key: "eventAndTime",
      align: "center",
      width: 120,
      render: (_, record) => {
        const startTime = record.startTime
          ? dayjs(record.startTime, "HH:mm:ss").format("HH:mm")
          : "-";

        const endTime = record.endTime
          ? dayjs(record.endTime, "HH:mm:ss").format("HH:mm")
          : "-";

        return (
          <div>
            {startTime} - {endTime}
          </div>
        );
      },
    },
   
    {
      title: "Status",
      dataIndex: ["status", "name"],
      key: "status",
      width: 100,
      render: (_, record) => <ColorStatusTag status={record?.status} />,
    },
    {
      title: "Action",
      fixed: "end",
      width: 80,
      render: (_, record) => {
        const smallStyle = { fontSize: "12px" };

        const actions = [
          {
            key: "view",
            label: "View",
            icon: <EyeOutlined style={{ fontSize: "12px" }} />,
            // permission: PERMISSIONS.PARTNER_VIEW,
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
            // permission: PERMISSIONS.PARTNER_EDIT,
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
              (!action.permission || hasPermission(action.permission)) &&
              !action.hidden,
          )
          .map((action) => ({
            key: action.key,
            onClick: action.onClick,
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
    <div>
      <Table
        tableLayout="fixed"
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={data}
        rowKey="uuid"
        loading={loading}
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

      <EventFacilityOrderForm
        mode={mode}
        setMode={setMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedData={selectedData}
        // onSuccess={refreshData}
      />
    </div>
  );
};

export default EventFacilityOrderTable;
