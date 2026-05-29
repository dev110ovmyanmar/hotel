import { Dropdown, Space, Table, Tag, Button, Drawer } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditOutlined, EyeOutlined, FolderAddOutlined, MoreOutlined } from "@ant-design/icons";
import { PERMISSIONS } from './../../../variables/permission';
import usePermission from './../../../hooks/usePermission';
import ColorStatusTag from './../../../component/ColorStatusTag/ColorStatusTag';
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
  loading
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [selectedData, setSelectedData] = useState({});
  const [imageDrawerOpen, setImageDrawerOpen] = useState(false);

  const { hasPermission } = usePermission();

  const navigate = useNavigate();

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
      title: "Guest Phone",
      dataIndex: "guestPhone",
      key: "guestPhone",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Event Name",
      dataIndex: "eventName",
      key: "eventName",
      render: (text) => <div>{text}</div>,
    },
    // {
    //   title: "Total Price",
    //   dataIndex: "totalPrice",
    //   key: "totalPrice",
    //   render: (text) => <div>{text ? text : "-"}</div>,
    // },
    {
      title: "Event Date",
      dataIndex: "eventDate",
      key: "eventDate",
      render: (text) => <div>{text? dayjs(text,"YYYY-MM-DD").format("DD-MM-YYYY") : "-"}</div>,
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      render: (text) => (
        <div>{text ? dayjs(text, "HH:mm:ss").format("HH:mm") : "-"}</div>
      ),
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
      render: (text) => (
        <div>{text ? dayjs(text, "HH:mm:ss").format("HH:mm") : "-"}</div>
      ),
    },
    {
      title: "Expected Hours",
      dataIndex: "expectedHours",
      key: "expectedHours",
      render: (_, record) => {
        const startTime = dayjs(record.startTime, "HH:mm");
        const endTime = dayjs(record.endTime, "HH:mm");

        const totalSeconds = endTime.diff(startTime, "second");

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const text = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
        return <div>{text}</div>;

      },
    },
    {
      title: "Expected Pax",
      dataIndex: "expectedPax",
      key: "expectedPax",
      render: (text) => <div>{text ? text : "-"}</div>,
    },
    {
      title: "Status",
      dataIndex: ["status", "name"],
      key: "status",
      render: (_, record) => <ColorStatusTag status={record?.status} />,
    },
    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
      render: (text) => <div>{text ? text : "-"}</div>,
    },
    {
      title: "Action",
      fixed: "end",
      render: (_, record) => {
        const smallStyle = { fontSize: "12px" };

        const actions = [
          {
            key: "view",
            label: "View",
            icon: <EyeOutlined style={{ fontSize: "12px" }} />,
            permission: PERMISSIONS.PARTNER_VIEW,
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
            permission: PERMISSIONS.PARTNER_EDIT,
            onClick: () => {
              setDrawerOpen(true);
              setMode("edit");
              setSelectedData(record);
            },
          }
        ];

        const items = actions.filter(
          action => (!action.permission || hasPermission(action.permission)) && !action.hidden
        ).map(action => ({
          key: action.key,
          onClick: action.onClick,
          label: (
            <Space size={4} style={smallStyle}
            // onClick={action.onClick}
            >
              {action.icon}
              <span style={{ fontSize: "14px" }}>{action.label}</span>
            </Space>
          )
        }))

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
