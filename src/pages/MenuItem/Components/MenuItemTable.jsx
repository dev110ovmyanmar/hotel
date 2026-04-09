import { Button, Dropdown, Space, Table, Tag } from "antd";
import { useState } from "react";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { EyeOutlined } from "@ant-design/icons";
import { EditOutlined } from "@ant-design/icons";
import MenuItemForm from "./MenuItemForms/MenuItemForm";
import { PERMISSIONS } from "../../../variables/permission";
import usePermission from "../../../hooks/usePermission";
import ItemsForm from "./MenuItemForms/ItemsForm";
import PriceTag from "../../../component/PriceTag/PriceTag";

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
  const [itemDrawerOpen, setItemDrawerOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [selectedData, setSelectedData] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);

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
      render: (price) => <PriceTag value={price}/>
    },
    {
      title: "Cost (MMK)",
      dataIndex: "cost",
      key: "cost",
      render: (price) => <PriceTag value={price} />
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

  const expandColumns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "F&B Inventory Name", dataIndex: ["fnbInventoryItem", "name"], key: "name" },
    { title: "Quantity", dataIndex: "quantityPerItem", key: "quantityPerItem" },
    { title: "Unit", dataIndex: ["unit", "name"], key: "unit" },
    {
      title: "Action",
      render: (_, record) => {
        const smallStyle = { fontSize: "12px" };

        const actions = [
          {
            key: "edit",
            label: "Edit",
            icon: <EditOutlined style={{ fontSize: "12px" }} />,
            // permission: PERMISSIONS.SERVICE_EDIT,
            onClick: () => {
              setItemDrawerOpen(true);
              setMode("item-edit");
              setSelectedItem(record);
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

        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <MoreOutlined style={{ fontSize: "16px" }} />
          </Dropdown>
        );
      },
    },
  ];

  const expandedRowRender = (record) => {
    return (
      <div className="nested-table-container">
        <div className="flex justify-between items-center mb-3">
          <Button
            className="py-4! rounded-[5px]!"
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedItem({ menuUuid: record?.uuid });
              setMode("item-add");
              setItemDrawerOpen(true);
            }}
          >
            F&B Inventory Item
          </Button>
        </div>


        {
          record?.menuInventoryMappings?.length <= 0 ? null :
            <Table
              className="nested-table"
              columns={expandColumns}
              dataSource={record.menuInventoryMappings || []}
              rowKey="uuid"
              pagination={false}
              size="small"
            />
        }

      </div>
    );
  };

  return (
    <div id="scrollId" className="w-full h-[63vh] ">
      <Table
        tableLayout="fixed"
        scroll={{ x: 1000 }}
        columns={columns}
        expandable={{ expandedRowRender, defaultExpandedRowKeys: ["0"] }}
        dataSource={data}
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

      <ItemsForm
        mode={mode}
        setMode={setMode}
        setSelectedItem={setSelectedItem}
        selectedItem={selectedItem}
        drawerOpen={itemDrawerOpen}
        setDrawerOpen={setItemDrawerOpen}
      />
    </div>
  );
};

export default MenuItemTable;
