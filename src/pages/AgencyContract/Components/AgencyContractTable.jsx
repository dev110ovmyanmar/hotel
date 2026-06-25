import { Dropdown, Space, Table, } from "antd";
import { useState } from "react";
import {
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  FolderAddOutlined,
} from "@ant-design/icons";
import usePermission from "../../../hooks/usePermission"; // <-- Permission hook
import { PERMISSIONS } from "../../../variables/permission";
import AgencyContractForm from "../Components/AgencyContractForm/AgencyContractForm";
import dayjs from "dayjs";
import ImageUpload from "../../../component/ImageUpload/ImageUpload";

const AgencyContractTable = ({
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
  const [imageDrawerOpen, setImageDrawerOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [selectedData, setSelectedData] = useState(null);

  const columns = [
    {
      title: "ID",
      render: (_, record) => <div>{record?.id}</div>,
      width: 70,
    },
    {
      title: "Name",
      dataIndex: ["agency", "name"],
      key: "name",
      render: (text) => <div>{text ? text : "-"}</div>,
    },
    {
      title: "Charge Type",
      dataIndex: ["chargeType", "name"],
      key: "chargeType",
      render: (_, record) => {
        const chargeTypeName = record?.chargeType.code;
        const chargeValue = record?.chargeValue;

        if (chargeTypeName === "flat") {
          return <div>{chargeValue} MMK</div>
        } else {
          return <div>{chargeValue} %</div>
        }
      },
      align: "center"
    },
    {
      title: "Contract Start Date",
      dataIndex: "contractStart",
      key: "contractStart",
      render: (_, record) => <div>{record?.contractStart}</div>
    },
    {
      title: "Contract End Date",
      dataIndex: "contractEnd",
      key: "contractEnd ",
      render: (_, record) => <div>{record?.contractEnd}</div>
    },
    {
      title: "Action",
      fixed:"end",
      render: (_, record) => {
        const smallStyle = { fontSize: "12px" };

        const actions = [
          {
            key: "view",
            label: "View",
            icon: <EyeOutlined style={{ fontSize: "12px" }} />,
            // permission: PERMISSIONS.ROOM_RATE_VIEW,
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
            // permission: PERMISSIONS.ROOM_RATE_EDIT,
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
            // permission: PERMISSIONS.ROOM_RATE_EDIT,
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
    <div id="scrollId">
      <Table
        tableLayout="fixed"
        scroll={{ x: 1000 }}
        loading={loading}
        columns={columns}
        dataSource={data}
        rowKey="roomrate"
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

      <AgencyContractForm
        page={page}
        mode={mode}
        setMode={setMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        imageDrawerOpen={imageDrawerOpen}
        setImageDrawerOpen={setImageDrawerOpen}
        selectedData={selectedData}
        setSelectedData={setSelectedData}

      />

    </div>
  );
};

export default AgencyContractTable;
