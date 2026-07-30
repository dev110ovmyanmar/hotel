import React from "react";
import { Row, Col, Typography, Space, Card, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ColorStatusTag from "../../../../component/ColorStatusTag/ColorStatusTag";

const { Text } = Typography;

const ServiceOrder = ({ data , serviceOrderStatus}) => {
  const CustomTitle = (
    <Space>
      <div className="service-order-icon-box">
        <PlusOutlined style={{ color: "#1278ec", fontSize: "18px" }} />
      </div>
      <Text>Service Order</Text>
    </Space>
  );

  const columns = [
    {
      title: "Service ",
      dataIndex: ["service", "name"],
      key: "service",
    },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => {
        return (
          status ? <ColorStatusTag status={status} /> : "-"
        );
      },
    },
    {
      title: "Guest",
      dataIndex: ["reservationRoom", "guest", "name"],
      key: "guest",
    },
  ];
  console.log(data,"DataInServiceOrder")
  return (
    <>
      {
        data?.length !== 0 && serviceOrderStatus && (
          <Card title={CustomTitle} className="service-order-card line-height">
            <Table
              columns={columns}
              dataSource={data}
              size="small"
              pagination={false}
            />
          </Card>
        )
      }
    </>
  );
};

export default ServiceOrder;
