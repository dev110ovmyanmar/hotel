import React from "react";
import { Card, Row, Typography, Divider, Space } from "antd";
import { DollarCircleOutlined } from "@ant-design/icons";
import PriceTag from "../../../../component/PriceTag/PriceTag";

const { Text } = Typography;

const SummaryCard = ({ data }) => {
  
  const CustomTitle = (
    <Space>
      <div className="summary-icon-box">
        <DollarCircleOutlined style={{ color: "#52c41a", fontSize: "20px" }} />
      </div>
      <Text>Room Summary</Text>
    </Space>
  );

  return (
    <Card title={CustomTitle} className="summary-card line-height">
      <Row justify="space-between">
        <Text>Sub Total </Text>
        <div className="flex  justify-end gap-1">
          <PriceTag value={data?.subTotal} />
          <span>MMK</span>
        </div>
      </Row>
      <Row justify="space-between">
        <Text>Tax</Text>
        <div className="flex  justify-end gap-1">
          <PriceTag value={data?.taxTotal} />
          <span>MMK</span>
        </div>
      </Row>

      <Row justify="space-between">
        <Text>Incentive</Text>
        <div className="flex  justify-end gap-1 text-rose-500">
          - <PriceTag value={data?.incentiveTotal} />
          <span>MMK</span>
        </div>
      </Row>

      <Row justify="space-between">
        <Text>Discount</Text>
        <div className="flex  justify-end gap-1 text-rose-500">
          - <PriceTag value={data?.discountTotal} />
          <span>MMK</span>
        </div>
      </Row>

      <Divider className="custom-line" />
      <Row justify="space-between">
        <Text strong>Grand Total</Text>
        <div className="flex  justify-end gap-1 text-indigo-600 dark:text-indigo-400">
          <PriceTag value={data?.grandTotal} />
          <span>MMK</span>
        </div>
      </Row>
    </Card>
  );
};

export default SummaryCard;
