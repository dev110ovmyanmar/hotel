import { Dropdown, Space, Table, Tag, Button } from "antd";
import { useState } from "react";
import { DeleteOutlined, MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { EyeOutlined } from "@ant-design/icons";
import { EditOutlined } from "@ant-design/icons";
import ServiceForm from "./ServiceForm/ServiceForm";
import { PERMISSIONS } from "../../../variables/permission";
import usePermission from "../../../hooks/usePermission";
import ColorStatusTag from "../../../component/ColorStatusTag/ColorStatusTag";
import PriceTag from "../../../component/PriceTag/PriceTag";
import ItemsForm from "./ServiceForm/ItemsForm";
import ServiceInventoryMappingDeleteModal from "../ServiceInventoryMappingDeleteModal";
import { deleteServiceInventoryMapping } from "../../../api/serviceInventoryMappingApi";
import { useApiMutation } from "../../../hooks/useApiMutation";

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
  const canCreateNested = hasPermission(
    PERMISSIONS.SERVICE_INVENTORY_ITEM_CREATE,
  );
  const rowExpandList = hasPermission(PERMISSIONS.SERVICE_INVENTORY_ITEM_LIST);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [itemDrawerOpen, setItemDrawerOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [selectedData, setSelectedData] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteServiceInventoryUuid,setDeleteServiceInventoryUuid] = useState();

  const deleteServiceInventoryMappings = useApiMutation({
    mutationFn: deleteServiceInventoryMapping,
    invalidateKeys: [
      ["services"],
    ],
  });

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
      title: "Service Type",
      dataIndex: ["serviceType", "name"],
      key: "serviceType",
    },
    {
      title: "Service Stages",
      dataIndex: ["serviceStages"],
      key: "serviceStages",
      render: (text) => <div>{text ? text : "_"}</div>,
    },
    {
      title: "Status",
      dataIndex: ["status", "name"],
      key: "status",
      align: "center",
      render: (_, record) => <ColorStatusTag status={record?.status} />,
    },
    {
      title: "Billing Type",
      dataIndex: ["billingType", "name"],
      key: "billingType",
      width: 120,
    },

    {
      title: "Price (MMK)",
      dataIndex: "basePrice",
      key: "basePrice",
      align: "end",
      render: (text, record) => {
        const price = record?.usesInventory ? 0 : text;
        return <PriceTag value={price} />;
      },
    },
    {
      title: "Action",
      fixed: "end",
      align: "center",
      width: 110,
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
    },
    {
      title: "Quantity",
      dataIndex: "quantityPerService",
      key: "quantityPerService",
      align: "center",
    },
    {
      title: "Unit",
      dataIndex: ["unit", "name"],
      key: "unit",
      align: "center",
    },
    {
      title: "Base Price (MMK)",
      dataIndex: ["serviceInventoryItem", "unitPrice"],
      key: "unitPrice",
      align: "end",
      render: (text) => <PriceTag value={text} />,
    },
    {
      title: "Action",
      align: "center",
      render: (_, record) => {
        console.log(record, "REcordInViewDelete")
        const smallStyle = { fontSize: "12px" };

        const actions = [
          {
            key: "view",
            label: "View",
            icon: <EyeOutlined style={{ fontSize: "12px" }} />,
            permission: PERMISSIONS.SERVICE_INVENTORY_ITEM_VIEW,
            onClick: () => {
              setItemDrawerOpen(true);
              setMode("item-view");
              setSelectedItem(record);
            },
          },
          {
            key: "edit",
            label: "Edit",
            icon: <EditOutlined style={{ fontSize: "12px" }} />,
            permission: PERMISSIONS.SERVICE_INVENTORY_ITEM_EDIT,
            onClick: () => {
              setItemDrawerOpen(true);
              setMode("item-edit");
              setSelectedItem(record);
            },
          },
          {
            key: "delete",
            label: <div className="!text-red-500">Delete</div>,
            icon: <DeleteOutlined style={{ color:"red", fontSize: "12px" }} />,
            permission: PERMISSIONS.SERVICE_INVENTORY_DELETE,
            onClick: () => {
              setDeleteServiceInventoryUuid(record?.uuid)
              setDeleteModalOpen(true)
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
    if (!canCreateNested && !rowExpandList) return null;

    return (
      <div className="nested-table-container">
        {canCreateNested && record?.usesInventory === true && (
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
        )}

        {record?.serviceInventoryMappings?.length > 0 && (
          <Table
            className="expanded-table dark:[&_.ant-table-thead>tr>th]:!text-[#F3F4F6]"
            columns={expandColumns}
            dataSource={record.serviceInventoryMappings}
            rowKey="uuid"
            pagination={record.serviceInventoryMappings.length > 10}
            size="small"
          />
        )}
      </div>
    );
  };

  const handleDeleteOk = () => {
    const payload = {
      uuid : deleteServiceInventoryUuid
    };
    return (
      deleteServiceInventoryMappings.mutate(payload,{
        onSuccess: () => {
          setDeleteModalOpen(false);
          setDeleteServiceInventoryUuid();
        }
      })
    )
  }

  return (
    <div id="scrollId" className="w-full h-[63vh] ">
      <Table
        tableLayout="fixed"
        scroll={{ x: 1000 }}
        columns={columns}
        expandable={{
          expandedRowRender,
          defaultExpandedRowKeys: ["0"],
          rowExpandable: (record) =>
            (rowExpandList && record?.serviceInventoryMappings?.length > 0) ||
            (canCreateNested && record?.usesInventory === true),
        }}
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

      <ServiceInventoryMappingDeleteModal
        open={deleteModalOpen}
        onOk={handleDeleteOk}
        onCancel={() => setDeleteModalOpen(false)}
        confirmLoading={deleteServiceInventoryMappings?.isPending}
      />
    </div>
  );
};

export default ServiceTable;
