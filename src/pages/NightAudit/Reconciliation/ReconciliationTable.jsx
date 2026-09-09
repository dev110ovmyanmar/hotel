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
      title: "Reservation No.",
      dataIndex: "reservationNo",
      key: "reservationNo",
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
      title: "Expected Payment",
      dataIndex: "expectedPayments",
      key: "expectedPayments",
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
      title: "Status",
      //   dataIndex: "status",
      key: "status",
      align: "center",
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={false}
      // summary={() => (
      //   <Table.Summary fixed>
      //     <Table.Summary.Row>
      //       <Table.Summary.Cell index={0} colSpan={columns.length}>
      //         <div className="flex justify-end items-center w-full py-1">
      //           <Button
      //             type="primary"
      //             onClick={colorCheckBooking}
      //             className="flex items-center gap-1"
      //           >
      //             Next Step
      //             <AiOutlineRight />
      //           </Button>
      //         </div>
      //       </Table.Summary.Cell>
      //     </Table.Summary.Row>
      //   </Table.Summary>
      // )}
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
