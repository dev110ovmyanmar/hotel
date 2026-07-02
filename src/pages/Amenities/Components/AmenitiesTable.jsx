import { Dropdown, Space, Table, Tag, Button } from "antd";
import { useState } from "react";
import { AiTwotoneEye } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { EditOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import AmenitiesForm from "./AmenitiesForm/AmenitiesForm";
import BooleanTag from "../../../component/BooleanTag/BooleanTag";
import { PERMISSIONS } from "../../../variables/permission";
import usePermission from "../../../hooks/usePermission";

const AmenitiesTable = ({
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
  const { hasPermission } = usePermission();

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
      title: "Is Free",
      dataIndex: "isFree",
      key: "isFree",
      render: (text) =>
        <div className={text === true ? "text-[#389E0D]" : "text-[#CF1322]"}>
          {text === true ? "Yes" : "No"}
        </div>
    },
    {
      title: "Visibility",
      dataIndex: "visibility",
      key: "visibility",
      render: (text) =>
        <div className={text === true ? "text-[#389E0D]" : "text-[#CF1322]"}>
          {text === true ? "Yes" : "No"}
        </div>
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (text) =>
        <div>{text}</div>

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
            permission: PERMISSIONS.AMENITY_VIEW,
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
            permission: PERMISSIONS.AMENITY_EDIT,
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

      <AmenitiesForm
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

export default AmenitiesTable;
