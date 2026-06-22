import React from "react";
import { Row, Col, Typography, Space, Card, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Text } = Typography;

const ServiceAddOn = ({ data }) => {
  const CustomTitle = (
    <Space>
      <div className="service-icon-box">
        <PlusOutlined style={{ color: "#28e1c8", fontSize: "18px" }} />
      </div>
      <Text>Service Add On</Text>
    </Space>
  );

  const columns = [
    {
      title: "Service",
      dataIndex: ["service", "name"],
      key: "service",
    },
    {
      title: "Add On Status",
      dataIndex: ["addonStatus", "name"],
      key: "addonStatus",
      align: "center",
    },
    {
      title: "Guest",
      dataIndex: ["reservationRoom", "guest", "name"],
      key: "guest",
    },
  ];

  return (
    <>
      {data && (
        <Card title={CustomTitle} className="service-card line-height">
          <Table
            columns={columns}
            dataSource={data?.filter(
              item => item?.addonStatus?.code !== "completed"
            )}
            size="small"
            pagination={false}
          />
        </Card>
      )}
    </>
  );
};

export default ServiceAddOn;
