import { Dropdown, Space, Table, Tag, Button } from "antd";
import { useState } from "react";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { EyeOutlined } from "@ant-design/icons";
import { EditOutlined } from "@ant-design/icons";
import ServiceForm from "./ServiceForm/ServiceForm";
import { PERMISSIONS } from "../../../variables/permission";
import usePermission from "../../../hooks/usePermission";
import ColorStatusTag from "../../../component/ColorStatusTag/ColorStatusTag";
import PriceTag from "../../../component/PriceTag/PriceTag";
import ItemsForm from "./ServiceForm/ItemsForm";

const ServiceTable = ({
  data,
  page,
  setPage,
  perPage,
  total,
  changePage,
  changePerPage,
  loading,
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
      title: "Property",
      dataIndex: ["property", "name"],
      key: "property",
    },
    {
      title: "Billing Type",
      dataIndex: ["billingType", "name"],
      key: "billingType",
    },
    {
      title: "Service Type",
      dataIndex: ["serviceType", "name"],
      key: "serviceType",
    },
    {
      title: "Price (MMK)",
      dataIndex: "basePrice",
      key: "basePrice",
      render: (text) => <PriceTag value={text} />,
    },
    {
      title: "Status",
      dataIndex: ["status", "name"],
      key: "status",
      render: (_, record) => <ColorStatusTag status={record?.status} />,
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
            permission: PERMISSIONS.SERVICE_VIEW,
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
            permission: PERMISSIONS.SERVICE_EDIT,
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

  const expandColumns = [
    { title: "ID", dataIndex: "id", key: "id", align: "center" },
    {
      title: "Item Name",
      dataIndex: ["serviceInventoryItem", "name"],
      key: "name",
      align: "center",
    },
    {
      title: "Quantity",
      dataIndex: "quantityPerService",
      key: "quantityPerService",
      align: "center",
    },
    { title: "Unit", dataIndex: ["unit", "name"], key: "unit", align: "center" },
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
              setSelectedItem({ serviceUuid: record?.uuid });
              setMode("item-add");
              setItemDrawerOpen(true);
            }}
          >
            Inventory Item
          </Button>
        </div>

        {
          record?.serviceInventoryMappings <= 0 ? null :
            <Table
              // className="custom-table-style"
              className="[&_.ant-table-cell]:!border [&_.ant-table-cell]:!border-blue-300 [&_.ant-table-thead>tr>th]:!bg-[#F0F5FF]"
              columns={expandColumns}
              dataSource={record.serviceInventoryMappings || []}
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

      <ServiceForm
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

export default ServiceTable;
