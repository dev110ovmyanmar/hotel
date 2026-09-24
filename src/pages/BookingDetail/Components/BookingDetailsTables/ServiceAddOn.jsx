import React from "react";
import { Typography, Space, Card, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ColorStatusTag from "../../../../component/ColorStatusTag/ColorStatusTag";

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
      dataIndex: "addonStatus",
      key: "addonStatus",
      render: (status) => {
        return (
          status ? <ColorStatusTag status={status} /> : "-"
        );
      },
    },
  ];

  return (
    <>
      {data?.length !== 0 && (
        <Card title={CustomTitle} className="service-card line-height">
          <Table
            columns={columns}
            dataSource={data}
            size="small"
            pagination={false}
          />
        </Card>
      )}
    </>
  );
};

export default ServiceAddOn;
