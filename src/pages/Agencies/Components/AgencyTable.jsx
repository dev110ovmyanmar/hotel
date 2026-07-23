import { Dropdown, Space, Table, Tag, Button, Drawer } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  EditOutlined,
  EyeOutlined,
  FolderAddOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import AgencyForm from "./AgencyForm/AgencyForm";
import { PERMISSIONS } from "./../../../variables/permission";
import usePermission from "./../../../hooks/usePermission";
import ColorStatusTag from "./../../../component/ColorStatusTag/ColorStatusTag";
import { FaFileContract } from "react-icons/fa";
import ImageUpload from "../../../component/ImageUpload/ImageUpload";
import { useApiMutation } from "../../../hooks/useApiMutation";
import PriceTag from "../../../component/PriceTag/PriceTag";

const AgencyTable = ({
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
  const [imageDrawerOpen, setImageDrawerOpen] = useState(false);

  const { hasPermission } = usePermission();

  const navigate = useNavigate();

  const columns = [
    {
      title: "ID",
      render: (_, record) => <div>{record?.id}</div>,
      width: 70,
      // align: "center",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Contact Person",
      dataIndex: "contactPerson",
      key: "contactPerson",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <div>{text ? text : "-"}</div>,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (text) => <div>{text ? text : "-"}</div>,
    },
    {
      title: "Charge Value",
      dataIndex: "chargeValue",
      key: "chargeValue",
      align: "end",
      render: (_, record) => {
        const chargeValue = record?.chargeValue;
        const chargeTypeName = record?.chargeType?.code;

        if (chargeTypeName === "flat") {
          return <div>{chargeValue.toLocaleString()} MMK</div>;
        } else {
          return <div>{chargeValue} %</div>;
        }
      },
    },
    {
      title: "Status",
      dataIndex: ["status", "name"],
      key: "status",
      align: "center",
      render: (_, record) => <ColorStatusTag status={record?.status} />,
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
          },
          {
            key: "managefiles",
            label: "Manage Files",
            icon: <FolderAddOutlined style={{ fontSize: "12px" }} />,
            onClick: () => {
              setImageDrawerOpen(true);
              setSelectedData(record);
            },
          },
          {
            key: "contract",
            label: "Contract",
            icon: <FaFileContract style={{ fontSize: "12px" }} />,
            // permission: PERMISSIONS.PARTNER_EDIT,
            onClick: () => {
              navigate(`/booking-source/travel-agents/${record?.id}/agency-contract`, {
                state: { agencyRecord: record },
              });
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
        scroll={{ x: "max-content" }}
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

      <AgencyForm
        mode={mode}
        setMode={setMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        imageDrawerOpen={imageDrawerOpen}
        setImageDrawerOpen={setImageDrawerOpen}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        page={page}
      />
    </div>
  );
};

export default AgencyTable;
