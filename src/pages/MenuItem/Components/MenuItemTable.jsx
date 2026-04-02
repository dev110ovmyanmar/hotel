import { Dropdown, Space, Table, Tag } from "antd";
import { useState } from "react";
import { MoreOutlined } from "@ant-design/icons";
import { EyeOutlined } from "@ant-design/icons";
import { EditOutlined } from "@ant-design/icons";
import MenuItemForm from "./MenuItemForms/MenuItemForm";
import { PERMISSIONS } from "../../../variables/permission";
import usePermission from "../../../hooks/usePermission";

const MenuItemTable = ({
  data,
  page,
  setPage,
  perPage,
  total,
  changePage,
  changePerPage,
}) => {
  const { hasPermission } = usePermission();

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
      title: "Price (MMK)",
      dataIndex: "price",
      key: "price",
      render: (price) => price?.toLocaleString(),
    },
    {
      title: "Cost (MMK)",
      dataIndex: "cost",
      key: "cost",
      render: (price) => price?.toLocaleString(),
    },
    {
      title: "Is Taxable",
      dataIndex: "isTaxable",
      key: "isTaxable",
      render: (_, record) => (
        <Tag color={record.isTaxable ? "green" : "red"}>
          {record.isTaxable ? "TRUE" : "FALSE"}
        </Tag>
      ),
    },
    {
      title: "Menu category",
      dataIndex: ["menuCategory", "name"],
      key: "menuCategory",
    },
    {
      title: "Status",
      dataIndex: ["status", "name"],
      key: "status",
      align: "center",
      render: (_, record) => (
        <Tag color={record?.status?.name === "Active" ? "green" : "red"}>
          {record?.status?.name.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Action",
      render: (_, record) => {
        const smallStyle = { fontSize: "12px" };

        const actions = [
          {
            key: "view",
            label: "View",
            icon: <EyeOutlined style={{ fontSize: "12px" }} />,
            permission: PERMISSIONS.MENU_ITEM_VIEW,
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
            permission: PERMISSIONS.MENU_ITEM_EDIT,
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
        expandable={{
          expandedRowRender: (record) => (
            <div style={{ padding: "0px 45px" }}>
              {record.menuModifiers
                ?.filter((m) => m.selected)
                .map((modifier, index) => (
                  <div key={modifier.uuid}>
                    {index + 1}. {modifier.name}- {modifier.unitCost} MMK
                  </div>
                ))}
            </div>
          ),
          rowExpandable: (record) =>
            record.menuModifiers?.some((m) => m.selected),
        }}
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

      <MenuItemForm
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

export default MenuItemTable;
