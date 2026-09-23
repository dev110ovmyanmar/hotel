import React, { useState } from "react";
import { Card, Space, Table, Typography } from "antd";
import { IoCardOutline } from "react-icons/io5";
import FolioPaymentDetailModal from "../BookingDetailModals/FolioPaymentDetailModal";
import ColorStatusTag from "../../../../component/ColorStatusTag/ColorStatusTag";
import PriceTag from "../../../../component/PriceTag/PriceTag";

const { Text } = Typography;

const columns = [
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
    width: 70,
  },
  {
    title: "Date",
    dataIndex: "paymentDate",
    key: "paymentDate",
  },
  {
    title: "Method",
    dataIndex: ["paymentMethod", "name"],
    key: "paymentMethod",
  },
  {
    title: "Payment Type",
    dataIndex: ["paymentType", "name"],
    key: "paymentType",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    align: "right",
    render: (value) => {
      return (
        <div className="inline-flex items-center gap-1">
          <PriceTag value={value} />
          <span>MMK</span>
        </div>
      );
    },
  },
  {
    title: "Status",
    dataIndex: ["paymentStatus"],
    key: "status",
    render: (status, record) => {
      return <ColorStatusTag status={status} />;
    },
  },
];

const PaymentSummaryTable = ({ data }) => {
  // Localized Modal state configuration handlers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDataUuid, setSelectedDataUuid] = useState(null);

  const CustomTitle = (
    <Space>
      <div className="payment-icon-box">
        <IoCardOutline style={{ color: "#a6b019", fontSize: "18px" }} />
      </div>
      <Text>Payment Summary</Text>
    </Space>
  );

  return (
    <>
      {data?.length !== 0 && (
        <Card title={CustomTitle} className="payment-card">
          <Table
            columns={columns}
            dataSource={data}
            rowKey="uuid"
            size="small"
            pagination={false}
          />

          <FolioPaymentDetailModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedDataUuid(null);
            }}
            selectedDataUuid={selectedDataUuid}
          />
        </Card>
      )}
    </>
  );
};

export default PaymentSummaryTable;
