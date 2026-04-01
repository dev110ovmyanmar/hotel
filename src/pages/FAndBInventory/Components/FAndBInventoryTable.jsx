import { Dropdown, Space, Table } from "antd";
import { useState } from "react";
import { MoreOutlined } from "@ant-design/icons";
import { EyeOutlined } from "@ant-design/icons";
import { EditOutlined } from "@ant-design/icons";
import { PERMISSIONS } from "../../../variables/permission";
import usePermission from "../../../hooks/usePermission";
import FAndBInventoryForm from "./FAndBInventoryForm/FAndBInventoryForm";
import ColorStatusTag from "../../../component/ColorStatusTag/ColorStatusTag";
import PriceTag from "../../../component/PriceTag/PriceTag";

const FAndBInventoryTable = ({
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
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
    },
    {
      title: "Supplier",
      dataIndex: ["supplier", "name"],
      key: "supplier",
    },
    {
      title: "Unit",
      dataIndex: ["unit", "name"],
      key: "unit",
    },
    {
      title: "Purchase Price (MMK)",
      dataIndex: "unitCost",
      key: "unitCost",
      render: (text) => <PriceTag value={text} />
    },
    {
      title: "Selling Price (MMK)",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (text) => <PriceTag value={text} />
    },
    {
      title: "Reorder Level",
      dataIndex: "reorderLevel",
      key: "reorderLevel",
    },
    {
      title: "Status",
      dataIndex: ["status", "name"],
      key: "status",
      render: (_, record) => <ColorStatusTag status={record?.status} />,
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
            permission: PERMISSIONS.FOOD_AND_BEVERAGE_INVENTORY_VIEW,
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
            permission: PERMISSIONS.FOOD_AND_BEVERAGE_INVENTORY_EDIT,
            onClick: () => {
              setDrawerOpen(true);
              setMode("edit");
              setSelectedData(record);
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

      <FAndBInventoryForm
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

export default FAndBInventoryTable;
