import React from "react";
import { Row, Col, Typography, Space, Card, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Text } = Typography;

const ServiceOrder = ({data}) => {
  const CustomTitle = (
    <Space>
      <div className="service-order-icon-box">
        <PlusOutlined style={{ color: "#eba00c", fontSize: "18px" }} />
      </div>
      <Text>Service Order</Text>
    </Space>
  );

  const columns = [
    {
      title: "Service Package",
      dataIndex: ["servicePackage", "name"],
      key: "servicePackage",
    },
    // {
    //   title: "No",
    //   dataIndex: "no",
    //   key: "no",
    //   align: "center",
    // },
    {
      title: "Order Status",
      dataIndex: ["orderStatus", "name"],
      key: "orderStatus",
      align: "center",
    },
    {
      title: "Guest",
      dataIndex: ["reservationRoom","guest", "name"],
      key: "guest",
    },
  ];

  return (
    <>
      <Card title={CustomTitle} className="service-card line-height">
        <Table
          columns={columns}
          dataSource={data}
          size="small"
          pagination={false}
        />
      </Card>
    </>
  );
};

export default ServiceOrder;
