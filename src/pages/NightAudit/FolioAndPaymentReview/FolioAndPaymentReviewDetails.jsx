import React from "react";
import {
  Drawer,
  Card,
  Table,
  Tag,
  Spin,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { folioReviewPayment } from "../../../api/nightAuditApi";
import useApiQuery from "../../../hooks/useApiQuery";
import PriceTag from "../../../component/PriceTag/PriceTag";
import { textColorDarkMode, textWhiteInDarkStyle } from "../../../utils";
import FinancialStatusTag from "../../../component/FinancialStatusTag/FinancialStatusTag";

const FolioAndPaymentReviewDetails = ({ open, onClose, data }) => {
  const { data: folioData, isLoading: folioLoading } = useApiQuery({
    fetchQueryName: "folio-review",
    fetchQueryFunction: folioReviewPayment,
    params: {
      folio: {
        uuid: data?.folioUuid,
      },
    },
    enabled: !!data?.folioUuid && open,
  });

  const folio = folioData?.data || folioData || data || {};
  const payments = folio?.payments || folio?.paymentDetails || [];

  const textWhiteDark = `flex justify-between items-center text-slate-600 ${textWhiteInDarkStyle}`;

  const paymentColumns = [
    {
      title: "Id",
      width: 45,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Date & Time",
      dataIndex: "dateTime",
      key: "dateTime",
      width: 135,
      render: (value, record) =>
        value || record.paymentDate || record.createdAt || "-",
    },
    {
      title: "Method",
      dataIndex: "method",
      key: "method",
      width: 90,
      render: (value, record) => value || record.paymentMethod || "-",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      width: 110,
      render: (value) => (
        <div className="flex justify-end items-center gap-1">
          <PriceTag value={value} />
          <span className="font-medium">MMK</span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: 90,
      render: (value) => {
        const isCompleted = value === "Completed";

        return (
          <Tag
            style={{
              backgroundColor: isCompleted ? "#F6FFED" : "#f5f5f5",
              borderColor: isCompleted ? "#B7EB8F" : "#d9d9d9",
              color: isCompleted ? "#389E0D" : "#595959",
              borderRadius: "4px",
            }}
          >
            {value || "Completed"}
          </Tag>
        );
      },
    },
  ];

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-gray-100">
          <span>Folio & Payment Details</span>
        </div>
      }
      placement="right"
      size={650}
      open={open}
      onClose={onClose}
      closeIcon={<CloseOutlined />}
    >
      {folioLoading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-gray-700">
              <div>
                <h2 className="text-lg font-semibold text-slate-600 dark:text-blue-400">
                  {folio?.folioNo || "N/A"}
                </h2>
              </div>
              <div className="text-right">
                <FinancialStatusTag status={folio?.financialStatus} />
              </div>
            </div>

            {/* Guest & Reservation Info */}
            <div className="grid grid-cols-2 gap-3 py-3 text-xs border-b border-slate-100 dark:border-gray-700">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <span>
                  Reservation No: <strong>{folio?.reservationNo || "-"}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <span>
                  Guest Name: <strong>{data?.guestName || "-"}</strong>
                </span>
              </div>
            </div>

            {/* Financial Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-3">
              <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/40 p-2.5 border border-indigo-100 dark:border-indigo-900/40">
                <p className="text-[11px] font-medium text-indigo-600 dark:text-indigo-300">Grand Total</p>
                <div className="text-xs font-bold text-indigo-900 dark:text-indigo-100 mt-1">
                  <div className="flex gap-1">
                    <PriceTag value={folio?.grandTotal} />
                    <span>MMK</span>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-2.5 border border-emerald-100 dark:border-emerald-900/30">
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400">Paid Amount</p>
                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mt-1">
                  <div className="flex gap-1">
                    <PriceTag value={folio?.paidAmount} />
                    <span>MMK</span>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-rose-50 dark:bg-rose-950/30 p-2.5 border border-rose-100 dark:border-rose-900/30">
                <p className="text-[11px] text-rose-500 dark:text-rose-400">Balance</p>
                <div className="text-xs font-bold text-rose-600 dark:text-rose-300 mt-1">
                  <div className="flex gap-1">
                    <PriceTag value={folio?.balanceAmount} />
                    <span>MMK</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/50 mt-3 p-3 divide-x divide-slate-200 dark:divide-slate-800">
              <div className="pr-3">
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Total Payments</p>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {folio?.totalPayments}
                </p>
              </div>

              <div className="pl-3">
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Financial Status</p>
                <div className="text-xs text-slate-900 dark:text-slate-100 mt-1">
                  <FinancialStatusTag status={folio?.financialStatus} />
                </div>
              </div>
            </div>
          </div>

          {/* PAYMENTS TABLE CARD - Only shown when payments exist */}
          {payments.length > 0 && (
            <Card
              size="small"
              title={
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    Payments
                  </span>
                </div>
              }
              className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              <Table
                size="small"
                rowKey={(record, index) => record.uuid ?? record.id ?? index}
                columns={paymentColumns}
                dataSource={payments}
                pagination={false}
                scroll={{ x: 450 }}
              />
            </Card>
          )}

          {/* FOLIO BREAKDOWN SUMMARY */}
          <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-gray-700/50 border-b border-slate-100 dark:border-gray-700">
              <h3 className={`font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2 ${textColorDarkMode}`}>
                Folio Summary
              </h3>
            </div>
            <div className="p-4 space-y-2 text-sm">
              <div className="space-y-2">
                <div className={textWhiteDark}>
                  <span className="text-slate-500 dark:text-slate-400">Sub Total</span>
                  <div className="flex gap-1">
                    <PriceTag value={data?.subTotal} />
                    <span>MMK</span>
                  </div>
                </div>
                <div className={textWhiteDark}>
                  <span className="text-slate-500 dark:text-slate-400">Tax</span>
                  <div className="flex gap-1">
                    <PriceTag value={data?.taxTotal} />
                    <span>MMK</span>
                  </div>
                </div>
                <div className={textWhiteDark}>
                  <span className="text-slate-500 dark:text-slate-400">Service Charge</span>
                  <div className="flex gap-1">
                    <PriceTag value={data?.serviceChargeTotal} />
                    <span>MMK</span>
                  </div>
                </div>
                <div className={textWhiteDark}>
                  <span className="text-slate-500 dark:text-slate-400">Incentive</span>
                  <span className="text-rose-500">
                    <div className="flex gap-1">
                      - <PriceTag value={data?.incentiveTotal} />
                      <span>MMK</span>
                    </div>
                  </span>
                </div>
                <div className={textWhiteDark}>
                  <span className="text-slate-500 dark:text-slate-400">Discount</span>
                  <span className="text-rose-500">
                    <div className="flex gap-1">
                      - <PriceTag value={data?.discountTotal} />
                      <span>MMK</span>
                    </div>
                  </span>
                </div>
                <div className={textWhiteDark}>
                  <span className="text-slate-500 dark:text-slate-400">Complimentary</span>
                  <span className="text-rose-500">
                    <div className="flex gap-1">
                      - <PriceTag value={data?.complimentaryTotal} />
                      <span>MMK</span>
                    </div>
                  </span>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-200 dark:border-gray-700 my-2" />

              <div className="rounded-lg p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
                <div className={`flex justify-between items-center font-bold ${textWhiteDark}`}>
                  <span className="text-slate-700 dark:text-gray-200">Grand Total</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                    <div className="flex gap-1">
                      <PriceTag value={folio?.grandTotal || 0} />                      
                      <span>MMK</span>
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default FolioAndPaymentReviewDetails;