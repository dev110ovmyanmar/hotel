import { Dropdown, Space, Table } from "antd";
import { useState } from "react";
import { MoreOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import usePermission from "../../../hooks/usePermission"; // <-- Permission hook
import { PERMISSIONS } from "../../../variables/permission";
import MenuModifierForm from "../Components/MenuModifierForm/MenuModifierForm";
import PriceTag from "../../../component/PriceTag/PriceTag";

const MenuModifierTable = ({
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
      title: "Selling Price (MMK)",
      dataIndex: "unitPrice",
      key: "unitPrice",
      align: "end",
      render: (text) => <PriceTag value={text} />,
    },
    {
      title: "Purchasing Price (MMK)",
      dataIndex: "unitCost",
      key: "unitCost",
      align: "end",
      render: (text) => <PriceTag value={text} />,
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

  return (
    <div id="scrollId">
      <Table
        tableLayout="fixed"
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={data}
        loading={loading}
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

      <MenuModifierForm
        page={page}
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

export default MenuModifierTable;
