import React from "react";
import { Card, Row, Typography, Divider, Space } from "antd";
import { DollarCircleOutlined } from "@ant-design/icons";
import PriceTag from "../../../../component/PriceTag/PriceTag";

const { Text, Title } = Typography;

const SummaryCard = ({ data }) => {
  const reservation = data?.summary;
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
        <Text>Total Charge</Text>
        <div className="flex  justify-end gap-1">
          <PriceTag value={reservation?.subTotal} />
          <span>MMK</span>
        </div>
      </Row>

      <Row justify="space-between">
        <Text>Tax</Text>
        <div className="flex  justify-end gap-1">
          <PriceTag value={reservation?.taxTotal} />
          <span>MMK</span>
        </div>
      </Row>

      <Divider className="custom-line" />

      <Row justify="space-between">
        <Text>Total Amount</Text>
        <div className="flex  justify-end gap-1">
          <PriceTag value={reservation?.grandTotal} />
          <span>MMK</span>
        </div>
      </Row>

      {/* <Row justify="space-between">
        <Text>Payment</Text>
        <Text>- 300,000 MMK</Text>
      </Row>

      <Divider className="custom-line" />

      <Row justify="space-between">
        <Text strong>Balance</Text>
        <Text>42,500 MMK</Text>
      </Row>

      <Divider className="custom-line" />

      <Row justify="space-between">
        <Text>Total Credit</Text>
        <Text>0 MMK</Text>
      </Row> */}
    </Card>
  );
};

export default SummaryCard;
