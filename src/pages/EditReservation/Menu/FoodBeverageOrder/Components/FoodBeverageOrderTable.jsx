import { Space, Table, Tooltip } from "antd";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import PriceTag from "../../../../../component/PriceTag/PriceTag";
import ColorStatusTag from "../../../../../component/ColorStatusTag/ColorStatusTag";
import usePermission from "../../../../../hooks/usePermission";
import { PERMISSIONS } from "../../../../../variables/permission";

const FoodBeverageOrderTable = ({
  data,
  page,
  perPage,
  total,
  changePage,
  changePerPage,
  onView,
  onEdit,
}) => {
  const tableDataSource = Array.isArray(data)
    ? data
    : data;

  const { hasPermission } = usePermission();
  const canEditFnbOrder = hasPermission(PERMISSIONS.FNB_ORDER_EDIT);
  const canViewFnbOrder = hasPermission(PERMISSIONS.FNB_ORDER_VIEW);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 90
    },
    {
      title: "Room No",
      key: "reservationRoom",
      render: (record) => {
        return (
          <div className="flex-col items-center gap-1">
            {record?.reservationRoom ? record?.reservationRoom.room.roomNo : "-"}

          </div>
        )
      }
    },
    {
      title: "Consumption Type",
      dataIndex: ["consumptionType", "name"],
      key: "consumptionType",
    },
    {
      title: "Order Type",
      key: "orderType",
      render: (record, text) => {
        return (
          <div className="flex-col items-center gap-1">
            <div>{record?.orderType.name}</div>
            {record?.orderType.code === "dine_in" &&
              <div>Table No - {record?.restaurantTable ? `(${record?.restaurantTable?.tableNo})` : null}</div>
            }
          </div>
        )
      }
    },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      width: 150,
      render: (orderStatus) => <ColorStatusTag status={orderStatus} />,
    },
    {
      title: "Price",
      dataIndex: "grandTotal",
      key: "grandTotal",
      width: 150,
      render: (text) => (
        <div className="flex justify-end items-center gap-1">
          <PriceTag value={text} />
          <span className=" font-medium">MMK</span>
        </div>
      )
    },
    {
      title: "Check No",
      dataIndex: "refNo",
      key: "refNo",
      render: (text) => <div className={text ? "" : "!text-center"}>{text ? text : "-"}</div>,
    },
    ...(
      canEditFnbOrder || canViewFnbOrder
        ?
        [
          {
            title: "Action",
            key: "action",
            fixed: "end",
            render: (_, record) => {
              const statusCode = record?.orderStatus?.code;
              const isReadonlyStatus =
                statusCode === "completed" || statusCode === "cancelled";
              console.log(canViewFnbOrder,"canViewFnbOrder")
              return (
                <Space size="middle">
                  {
                    canViewFnbOrder &&
                    <Tooltip title="View Details">
                      <EyeOutlined
                        className="cursor-pointer text-blue-500 hover:text-blue-700"
                        onClick={() => onView(record)}
                      />
                    </Tooltip>
                  }

                  {!isReadonlyStatus && canEditFnbOrder && (
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
        ]
        :
        []
    )

  ];

  return (
    <div>
      <Table
        tableLayout="fixed"
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={tableDataSource}
        rowKey="uuid"
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

export default FoodBeverageOrderTable;
