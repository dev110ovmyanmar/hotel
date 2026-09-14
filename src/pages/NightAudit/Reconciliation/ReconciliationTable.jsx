import { Button, Table } from "antd";
import { AiOutlineRight } from "react-icons/ai";
import PriceTag from "../../../component/PriceTag/PriceTag";
import { nextStepButtonDesign } from "../../../variables/constants";

const ReconciliationTable = ({ colorCheckBooking, data }) => {
  const tableData = data?.folios;

  const columns = [
    {
      title: "Id",
      dataIndex: "folioId",
      key: "folioId",
      render: (text) => <div>{text}</div>,
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
      render: (value) => (
        <div className="flex justify-end items-center gap-1">
          <PriceTag value={value} />
        </div>
      ),
      align: "end",
    },
    {
      title: "Posted Charges",
      dataIndex: "postedCharges",
      key: "postedCharges",
      render: (value) => (
        <div className="flex justify-end items-center gap-1">
          <PriceTag value={value} />
        </div>
      ),
      align: "end",
    },
    {
      title: "Unposted Charges",
      dataIndex: "unpostedCharges",
      key: "unpostedCharges",
      render: (value) => (
        <div className="flex justify-end items-center gap-1">
          <PriceTag value={value} />
        </div>
      ),
      align: "end",
    },
    {
      title: "Actual Payment",
      dataIndex: "actualPayments",
      key: "actualPayments",
      render: (value) => (
        <div className="flex justify-end items-center gap-1">
          <PriceTag value={value} />
        </div>
      ),
      align: "end",
    },
    {
      title: "Folio Payment",
      dataIndex: "folioBalance",
      key: "folioBalance",
      render: (value) => (
        <div className="flex justify-end items-center gap-1">
          <PriceTag value={value} />
        </div>
      ),
      align: "end",
    },
    {
      title: "Grand Total",
      dataIndex: "folioGrandTotal",
      key: "folioGrandTotal",
      render: (value) => (
        <div className="flex justify-end items-center gap-1">
          <PriceTag value={value} />
        </div>
      ),
      align: "end",
    },
    {
      title: "Paid Amount",
      dataIndex: "folioPaidAmount",
      key: "folioPaidAmount",
      render: (value) => (
        <div className="flex justify-end items-center gap-1">
          <PriceTag value={value} />
        </div>
      ),
      align: "end",
    },
    {
      title: "Folio Balance",
      dataIndex: "folioBalance",
      key: "folioBalance",
      render: (value) => (
        <div className="flex justify-end items-center gap-1">
          <PriceTag value={value} />
        </div>
      ),
      align: "end",
    },
    
    // {
    //   title: "Status",
    //   //   dataIndex: "status",
    //   key: "status",
    //   align: "center",
    // },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={false}
        scroll={{ x: 1000 }}
      />

      <div className={nextStepButtonDesign}>
        <Button
          type="primary"
          onClick={colorCheckBooking}
          className="flex items-center gap-1"
        >
          Next Step
          <AiOutlineRight />
        </Button>
      </div>
    </div>
  );
};

export default ReconciliationTable;
