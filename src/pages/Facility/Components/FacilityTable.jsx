import { Dropdown, Space, Table, Tag } from "antd";
import { useState } from "react";
import { DatabaseOutlined, MoreOutlined } from "@ant-design/icons";
import { EyeOutlined } from "@ant-design/icons";
import { EditOutlined } from "@ant-design/icons";
import FacilityForm from "./FacilityForm/FacilityForm";
import { PERMISSIONS } from "../../../variables/permission";
import usePermission from "../../../hooks/usePermission";
import { useNavigate } from "react-router-dom";
import ColorStatusTag from "../../../component/ColorStatusTag/ColorStatusTag";

const FacilityTable = ({
  data,
  page,
  setPage,
  perPage,
  total,
  changePage,
  changePerPage,
  loading
}) => {
  const { hasPermission } = usePermission();
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [selectedData, setSelectedData] = useState({});

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
    },
    {
      title: "Facility Type",
      dataIndex: ["facilityType", "name"],
      key: "facilityType",
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
    },
    {
      title: "Status",
      dataIndex: ["status", "name"],
      key: "status",
      render: (_, record) => <ColorStatusTag status={record?.status} />,
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
            permission: PERMISSIONS.FACILITY_VIEW,
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
            permission: PERMISSIONS.FACILITY_EDIT,
            onClick: () => {
              setDrawerOpen(true);
              setMode("edit");
              setSelectedData(record);
            },
          },
          {
            key: "facility-packages",
            label: "Facility Packages",
            icon: <DatabaseOutlined style={{ fontSize: "12px" }} />,
            permission: PERMISSIONS.FACILITY_PACKAGE_LIST,
            onClick: () => {
              navigate(
                `/facility-management/facilities/${record?.id}/packages`,
                {
                  state: {
                    uuid: record?.uuid,
                    name: record?.name
                  },
                },
              );
            },
          },
        ];

        // Filter actions by permission
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

        if (items.length === 0) {
          return null;
        }

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

      <FacilityForm
        page={page}
        setPage={setPage}
        mode={mode}
        setMode={setMode}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
      />
    </div>
  );
};

export default FacilityTable;
