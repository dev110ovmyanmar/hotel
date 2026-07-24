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
import ColorStatusTag from "../../../component/ColorStatusTag/ColorStatusTag";

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

  const canCreate = hasPermission(PERMISSIONS.MENU_MODIFIER_CREATE);

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
      title: "Menu category",
      dataIndex: ["menuCategory", "name"],
      key: "menuCategory",
    },
    {
      title: "Is Taxable",
      dataIndex: "isTaxable",
      key: "isTaxable",
      width: 100,
      render: (_, record) => (
        <div
          className={
            record.isTaxable === true ? "text-[#389E0D]" : "text-[#CF1322]"
          }
        >
          {record.isTaxable === true ? "True" : "False"}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 100,
      render: (status) => <ColorStatusTag status={status} />,
    },

    {
      title: "Purchasing  Price (MMK)",
      dataIndex: "cost",
      key: "cost",
      align: "end",
      render: (price) => <PriceTag value={price} />,
    },
    {
      title: "Selling Price (MMK)",
      dataIndex: "price",
      key: "price",
      align: "end",
      render: (price) => <PriceTag value={price} />,
    },
    {
      title: "Action",
      fixed: "end",
      align: "center",
      width: 100,
      render: (_, record) => {
        const smallStyle = { fontSize: "12px" };

        const actions = [
          {
            key: "view",
            label: "View",
            icon: <EyeOutlined style={{ fontSize: "12px" }} />,
            permission: PERMISSIONS.MENU_MODIFIER_VIEW,
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
            permission: PERMISSIONS.MENU_MODIFIER_EDIT,
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
    { title: "ID", dataIndex: "id", key: "id", align: "center" },
    {
      title: "F&B Inventory Name",
      dataIndex: ["fnbInventoryItem", "name"],
      key: "name",
      align: "center",
    },
    {
      title: "Quantity",
      dataIndex: "quantityPerItem",
      key: "quantityPerItem",
      align: "center",
    },
    {
      title: "Unit",
      dataIndex: ["unit", "name"],
      key: "unit",
      align: "center",
    },
    {
      title: "Action",
      align: "center",
      render: (_, record) => {
        const smallStyle = { fontSize: "12px" };

        const actions = [
          {
            key: "edit",
            label: "Edit",
            icon: <EditOutlined style={{ fontSize: "12px" }} />,
            permission: PERMISSIONS.MENU_MODIFIER_EDIT,
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
          {canCreate && (
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
          )}
        </div>

        {record?.menuInventoryMappings?.length <= 0 ? null : (
          <Table
            className="expanded-table dark:[&_.ant-table-thead>tr>th]:!text-[#F3F4F6]"
            columns={expandColumns}
            dataSource={record.menuInventoryMappings || []}
            rowKey="uuid"
            pagination={
              record.menuInventoryMappings?.length > 10 ? true : false
            }
            size="small"
          />
        )}
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
