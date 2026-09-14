import { Button, Table } from "antd";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import PriceTag from "../../../component/PriceTag/PriceTag";
import FolioAndPaymentReviewDetails from "./FolioAndPaymentReviewDetails";
import { useState } from "react";
import FinancialStatusTag from "../../../component/FinancialStatusTag/FinancialStatusTag";

const FolioAndPaymentReviewTable = ({
    data,
    backStep,
    nextStep,
}) => {
    const tableData = data?.folios;
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedFolio, setSelectedFolio] = useState(null);

    const handleView = (record) => {
        setSelectedFolio(record);
        setDrawerOpen(true);
    };

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
            dataIndex: "reservationNo",
            key: "reservationNo",
            render: (_, record) => (
                <span className="font-medium text-indigo-700 dark:text-indigo-500">
                    {record?.reservationNo || "-"}
                </span>
            ),
        },
        {
            title: "Guest Name",
            dataIndex: "guestName",
            key: "guestName",
            // width: 150,
        },
        {
            title: "Grand Total",
            dataIndex: "grandTotal",
            key: "grandTotal",
            render: (value) => (
                <div className="flex justify-end items-center gap-1">
                    <PriceTag value={value} />
                </div>
            ),
            align: "end",
        },
        {
            title: "Paid Amount",
            dataIndex: "paidAmount",
            key: "paidAmount",
            render: (value) => (
                <div className="flex justify-end items-center gap-1">
                    <PriceTag value={value} />
                </div>
            ),
            align: "end",
        },
        {
            title: "Balance Amount",
            dataIndex: "balanceAmount",
            key: "balanceAmount",
            render: (value) => (
                <div className="flex justify-end items-center gap-1">
                    <PriceTag value={value} />
                </div>
            ),
            align: "end",
        },
        {
            title: "Financial Status",
            dataIndex: "financialStatus",
            key: "financialStatus",
            render: (financialStatus) => (
                <FinancialStatusTag status={financialStatus} />
            ),
        },
        {
            title: "Has Unposted Charges",
            dataIndex: "hasUnpostedCharges",
            key: "hasUnpostedCharges",
            width: 140,
            render: (hasUnpostedCharges) => (
                <div
                    className={
                        hasUnpostedCharges === true
                            ? "text-[#389E0D]"
                            : "text-[#CF1322]"
                    }
                >
                    {hasUnpostedCharges === true ? "True" : "False"}
                </div>
            ),
        },
    ];

    return (
        <>
            <Table
                columns={columns}
                dataSource={tableData}
                pagination={false}
                scroll={{ x: 1000 }}
                rowKey="folioId"
                onRow={(record) => ({
                    onClick: () => handleView(record),
                    className: "cursor-pointer",
                })}
                rowClassName={(record) =>
                    selectedFolio?.folioId === record.folioId
                        ? "selected-folio-row"
                        : ""
                }
            />

            {/* <div className={`${nextStepButtonDesign} flex gap-4`}> */}
            <div className="sticky bottom-0 flex justify-end gap-4 bg-gray-50 py-2 px-4 z-10">

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
                >
                    Next Step
                    <AiOutlineRight />
                </Button>
            </div>

            {drawerOpen && (
                <FolioAndPaymentReviewDetails
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    data={selectedFolio}
                />
            )}
        </>
    );
};

export default FolioAndPaymentReviewTable;
