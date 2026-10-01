import { Space, Table, Tooltip } from "antd";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import PriceTag from "../../../../../component/PriceTag/PriceTag";
import ColorStatusTag from "../../../../../component/ColorStatusTag/ColorStatusTag";
import usePermission from "../../../../../hooks/usePermission";
import { PERMISSIONS } from "../../../../../variables/permission";

const ServiceOrderTable = ({
  data,
  page,
  perPage,
  total,
  changePage,
  changePerPage,
  onView,
  onEdit,
  loading,
}) => {
  const { hasPermission } = usePermission();
  const canEditServiceOrder = hasPermission(PERMISSIONS.SERVICE_ORDER_EDIT);
  const canViewServiceOrder = hasPermission(PERMISSIONS.SERVICE_ORDER_VIEW);

  const tableDataSource = Array.isArray(data)
    ? data
    : data?.serviceOrders || [];

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Room No",
      dataIndex: ["reservationRoom", "room", "roomNo"],
      key: "roomNo",
      width: 150,
      render: (text) => <div>{text ? text : "-"}</div>,
    },
    {
      title: "Service Name",
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: "Service Package",
      dataIndex: ["servicePackage", "name"],
      key: "servicePackage",
      render: (text) => <div>{text ? text : "-"}</div>,
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "status",
      width: 150,
      render: (orderStatus) => <ColorStatusTag status={orderStatus} />,
    },
    {
      title: "Quantity",
      dataIndex: "serviceOrderItems",
      key: "quantity",
      width: 100,
      align: "end",
      render: (items = []) => (
        <span>
          {Array.isArray(items)
            ? items.reduce((total, { quantity = 0 }) => total + quantity, 0)
            : 0}
        </span>
      ),
    },
    {
      title: "Price",
      dataIndex: "grandTotal",
      key: "grandTotal",
      render: (value) => (
        <div className="flex justify-end items-center gap-1">
          <PriceTag value={value} />
          <span className=" font-medium">MMK</span>
        </div>
      ),
      width: 150,
      align: "right",
    },
    {
      title: "Action",
      key: "action",
      fixed: "end",
      render: (_, record) => {
        const statusCode = record?.orderStatus?.code;
        const isReadonlyStatus =
          statusCode === "completed" || statusCode === "cancelled";

        return (
          <Space size="middle">
            {
              canViewServiceOrder &&
              <Tooltip title="View Details">
                <EyeOutlined
                  className="cursor-pointer text-blue-500 hover:text-blue-700"
                  onClick={() => onView(record)}
                />
              </Tooltip>
            }

            {!isReadonlyStatus && canEditServiceOrder && (
              <Tooltip title="Edit">
                <EditOutlined
                  className="cursor-pointer text-amber-500 hover:text-amber-700"
                  onClick={() => onEdit(record)}
                />
              </Tooltip>
            )}
          </Space>
        );
      },
    }
  ];

  return (
    <div>
      <Table
        tableLayout="fixed"
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={tableDataSource}
        rowKey="uuid"
        loading={loading}
        pagination={{
          current: page,
          pageSize: perPage,
          total: total,
          onChange: (page, pageSize) => {
            changePage(page);
            changePerPage(pageSize);
          },
          showSizeChanger: true,
        }}
      />
    </div>
  );
};

export default ServiceOrderTable;
