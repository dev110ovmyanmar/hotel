import React from "react";
import { Card, Row, Typography, Divider, Space } from "antd";
import { DollarCircleOutlined } from "@ant-design/icons";
import PriceTag from "../../../../component/PriceTag/PriceTag";

const { Text } = Typography;

const FolioSummaryCard = ({ data }) => {

  const CustomTitle = (
    <Space>
      <div className="folio-summary-icon-box">
        <DollarCircleOutlined style={{ color: "#1ab3c4", fontSize: "20px" }} />
      </div>
      <Text>Folio Summary</Text>
    </Space>
  );

  return (
    <Card title={CustomTitle} className="folio-summary-card line-height">
      <Row justify="space-between">
        <Text>Total Charge</Text>
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

      <Divider className="custom-line" />

      <Row justify="space-between">
        <Text>Total Amount</Text>
        <div className="flex  justify-end gap-1">
          <PriceTag value={data?.grandTotal} />
          <span>MMK</span>
        </div>
      </Row>

      {
        data?.paidAmount === 0 ?
          <Row justify="space-between">
            <Text>Deposit</Text>
            <div className="flex  justify-end gap-1">
              <PriceTag value={data?.depositAmount} />
              <span>MMK</span>
            </div>
          </Row> : null
      }


      <Row justify="space-between">
        <Text>Payment</Text>
        <div className="flex  justify-end gap-1">
          <PriceTag value={data?.paidAmount} />
          <span>MMK</span>
        </div>
      </Row>

      <Divider className="custom-line" />

      <Row justify="space-between">
        <Text strong>Balance</Text>
        <div className="flex  justify-end gap-1">
          <PriceTag value={data?.balanceAmount} />
          <span>MMK</span>
        </div>
      </Row>
    </Card>
  );
};

export default FolioSummaryCard;
