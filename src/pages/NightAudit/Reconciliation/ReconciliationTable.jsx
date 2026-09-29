import { Button, Table } from "antd";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import PriceTag from "../../../component/PriceTag/PriceTag";
import { useEffect, useState } from "react";

const ReconciliationTable = ({ backStep, nextStep, data }) => {
  const tableData = data?.folios || [];

  const [isConfirmed, setIsConfirmed] = useState(() => {
    return JSON.parse(
      localStorage.getItem("isConfirmed") || "false"
    );
  });

  useEffect(() => {
    const handleReconciliationConfirmed = (event) => {
      const confirmed = event.detail?.isConfirmed;

      if (typeof confirmed === "boolean") {
        setIsConfirmed(confirmed);
      }
    };

    window.addEventListener(
      "reconciliation_confirmed",
      handleReconciliationConfirmed
    );

    return () => {
      window.removeEventListener(
        "reconciliation_confirmed",
        handleReconciliationConfirmed
      );
    };
  }, []);

  const columns = [
    {
      title: "Id",
      dataIndex: "folioId",
      key: "folioId",
    },
    {
      title: "Folio No.",
      dataIndex: "folioNo",
      key: "folioNo",
    },
    {
      title: "Res No.",
      key: "reservationNo",
      width: 180,
      render: (_, record) => (
        <div className="flex flex-col leading-tight">
          <span className="font-medium text-indigo-700 dark:text-indigo-500">
            {record?.reservationNo || "-"}
          </span>

          <span className="text-xs font-medium">
            Room: <strong>{record?.roomNumber || "-"}</strong>
          </span>
        </div>
      ),
    },
    {
      title: "Expected Charges",
      dataIndex: "expectedCharges",
      key: "expectedCharges",
      align: "end",
      render: (value) => (
        <div className="flex justify-end items-center gap-1">
          <PriceTag value={value} />
        </div>
      ),
    },
    {
      title: "Posted Charges",
      dataIndex: "postedCharges",
      key: "postedCharges",
      align: "end",
      render: (value) => (
        <div className="flex justify-end items-center gap-1">
          <PriceTag value={value} />
        </div>
      ),
    },
    {
      title: "Unposted Charges",
      dataIndex: "unpostedCharges",
      key: "unpostedCharges",
      align: "end",
      render: (value) => (
        <div className="flex justify-end items-center gap-1">
          <PriceTag value={value} />
        </div>
      ),
    },
    {
      title: "Actual Payment",
      dataIndex: "actualPayments",
      key: "actualPayments",
      align: "end",
      render: (value) => (
        <div className="flex justify-end items-center gap-1">
          <PriceTag value={value} />
        </div>
      ),
    },
    {
      title: "Folio Payment",
      dataIndex: "folioBalance",
      key: "folioBalance",
      align: "end",
      render: (value) => (
        <div className="flex justify-end items-center gap-1">
          <PriceTag value={value} />
        </div>
      ),
    },
    {
      title: "Grand Total",
      dataIndex: "folioGrandTotal",
      key: "folioGrandTotal",
      align: "end",
      render: (value) => (
        <div className="flex justify-end items-center gap-1">
          <PriceTag value={value} />
        </div>
      ),
    },
    {
      title: "Paid Amount",
      dataIndex: "folioPaidAmount",
      key: "folioPaidAmount",
      align: "end",
      render: (value) => (
        <div className="flex justify-end items-center gap-1">
          <PriceTag value={value} />
        </div>
      ),
    },
    {
      title: "Folio Balance",
      dataIndex: "folioBalance",
      key: "folioBalance",
      align: "end",
      render: (value) => (
        <div className="flex justify-end items-center gap-1">
          <PriceTag value={value} />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto">
        <Table
          columns={columns}
          dataSource={tableData}
          pagination={false}
          rowKey="folioId"
          scroll={{ x: 1500 }}
          className="min-w-[1500px]"
        />
      </div>

      <div className="sticky bottom-0 flex justify-end gap-4 bg-gray-50 dark:bg-[#121111] py-2 px-4 z-10">
        <Button
          type="primary"
          onClick={backStep}
          className="flex items-center gap-1"
        >
          <AiOutlineLeft />
          Back
        </Button>

        <Button
          type="primary"
          onClick={nextStep}
          className="flex items-center gap-1"
          disabled={isConfirmed !== true}
        >
          Next Step
          <AiOutlineRight />
        </Button>
      </div>
    </div>
  );
};
export default ReconciliationTable;