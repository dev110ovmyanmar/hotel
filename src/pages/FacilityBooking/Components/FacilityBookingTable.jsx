import { Dropdown, Space, Table, Tag, Button, Drawer } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  EditOutlined,
  EyeOutlined,
  FolderAddOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { PERMISSIONS } from "./../../../variables/permission";
import usePermission from "./../../../hooks/usePermission";
import ColorStatusTag from "./../../../component/ColorStatusTag/ColorStatusTag";
import { FaFileContract } from "react-icons/fa";
import ImageUpload from "../../../component/ImageUpload/ImageUpload";
import { useApiMutation } from "../../../hooks/useApiMutation";
import PriceTag from "../../../component/PriceTag/PriceTag";
import FacilityBookingForm from "./FacilityBookingForm/FacilityBookingForm";
import dayjs from "dayjs";

const FacilityBookingTable = ({
  data,
  page,
  perPage,
  total,
  changePage,
  changePerPage,
  loading,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [selectedData, setSelectedData] = useState({});

  const { hasPermission } = usePermission();
  
  const columns = [
    {
      title: "ID",
      render: (_, record) => <div>{record?.id}</div>,
      width: 70,
    },
    {
      title: "Guest Name",
      dataIndex: "guestName",
      key: "guestName",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Guest Phone No",
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
      title: " Package Name",
      dataIndex: ["facilityPackage", "name"],
      // key: "totalPrice",
      // render: (text) => <div>{text ? text : "-"}</div>,
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

    // {
    //   title: "Expected Hours",
    //   dataIndex: "expectedHours",
    //   key: "expectedHours",
    //   render: (_, record) => {
    //     const startTime = dayjs(record.startTime, "HH:mm");
    //     const endTime = dayjs(record.endTime, "HH:mm");

    //     const totalSeconds = endTime.diff(startTime, "second");

    //     const hours = Math.floor(totalSeconds / 3600);
    //     const minutes = Math.floor((totalSeconds % 3600) / 60);
    //     const seconds = totalSeconds % 60;

    //     const text = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    //     return <div>{text}</div>;
    //   },
    // },
    {
      title: "Status",
      dataIndex: ["status", "name"],
      key: "status",
      width: 110,
      align:"center",
      render: (_, record) => <ColorStatusTag status={record?.status} />,
    },
    {
      title: "Action",
      fixed: "end",
      align: "center",
      width: 80,
      render: (_, record) => {
        const smallStyle = { fontSize: "12px" };

        const actions = [
          {
            key: "view",
            label: "View",
            icon: <EyeOutlined style={{ fontSize: "12px" }} />,
            permission: PERMISSIONS.FACILITY_BOOKING_VIEW,
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
            permission: PERMISSIONS.FACILITY_BOOKING_EDIT,
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
              <Space
                size={4}
                style={smallStyle}
                // onClick={action.onClick}
              >
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

      <FacilityBookingForm
        mode={mode}
        setMode={setMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        page={page}
      />
    </div>
  );
};

export default FacilityBookingTable;
