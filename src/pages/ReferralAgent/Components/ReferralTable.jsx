import { Dropdown, Space, Table, Tag, Button } from "antd";
import { useState } from "react";
import { EditOutlined, EyeOutlined, FolderAddOutlined, MoreOutlined } from "@ant-design/icons";
import ReferralForm from './ReferralForm/ReferralForm';
import ColorStatusTag from './../../../component/ColorStatusTag/ColorStatusTag';
import { PERMISSIONS } from './../../../variables/permission';
import usePermission from './../../../hooks/usePermission';
import PriceTag from "../../../component/PriceTag/PriceTag";


const ReferralTable = ({
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

  const columns = [
    {
      title: "ID",
      render: (_, record) => <div>{record?.id}</div>,
      width: 70,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
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
      render: (_, record) => {
        const chargeValue = record?.chargeValue;
        const chargeTypeName = record?.chargeType?.code;

        if (chargeTypeName === "flat") {
          return <div className="flex items-center justify-end gap-1"><PriceTag value={chargeValue} /><span>MMK</span></div>
        } else {
          return <div>{chargeValue} %</div>
        }
      },
      align: "end"
    },
    {
      title: "Status",
      dataIndex: ["status", "name"],
      key: "status",
       align: "center",
      render: (_, record) => <ColorStatusTag status={record?.status} />
    },
    {
      title: "Action",
      fixed:"end",
      align:"center",
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
            key: "manageFiles",
            label: "Manage Files",
            icon: <FolderAddOutlined style={{ fontSize: "12px" }} />,
            permission: PERMISSIONS.PARTNER_EDIT,
            onClick: () => {
              setImageDrawerOpen(true);
              setSelectedData(record);
            },
          }
        ];

        const items = actions
          .filter(
            (action) =>
              (!action.permission || hasPermission(action.permission)) && !action.hidden,
          )
          .map((action) => ({
            key: action.key,
            onClick: action.onClick,
            label: (
              <Space size={4} style={smallStyle}>
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
        loading={loading}
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

      <ReferralForm
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

export default ReferralTable;
