import { Space, Table, Tooltip } from "antd";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import PriceTag from "../../../../../component/PriceTag/PriceTag";
import ColorStatusTag from "../../../../../component/ColorStatusTag/ColorStatusTag";

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

  const columns = [
    {
      title: "Consumption Type",
      dataIndex: ["consumptionType", "name"],
      key: "consumptionType",
    },
    {
      title: "Order Type",
      dataIndex: ["orderType", "name"],
      key: "orderType",
    },
    {
      title: "Restaurant Table",
      dataIndex: ["restaurantTable", "tableNo"],
      key: "restaurantTable",
    },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      width: 150,
      render: (orderStatus) => <ColorStatusTag status={orderStatus} />,
    },
    {
      title: "Action",
      key: "action",
      fixed: "end",
      render: (_, record) => {
        console.log(record,"RecordInAction")
        const statusCode = record?.orderStatus?.code;
        // const isReadonlyStatus =
        //   statusCode === "completed" || statusCode === "cancelled";
        //   console.log(onView(record),"ONViewAction")

        return (
          <Space size="middle">
            <Tooltip title="View Details">
              <EyeOutlined
                className="cursor-pointer text-blue-500 hover:text-blue-700"
                onClick={() => onView(record)}
              />
            </Tooltip>

            {/* {!isReadonlyStatus && ( */}
              <Tooltip title="Edit">
                <EditOutlined
                  className="cursor-pointer text-amber-500 hover:text-amber-700"
                  onClick={() => onEdit(record)}
                />
              </Tooltip>
            {/* )} */}
          </Space>
        );
      },
    },
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
