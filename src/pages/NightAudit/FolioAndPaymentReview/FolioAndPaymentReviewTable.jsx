import { EyeOutlined, MoreOutlined } from "@ant-design/icons";
import { Button, Table } from "antd";
import { AiOutlineRight } from "react-icons/ai";
import PriceTag from "../../../component/PriceTag/PriceTag";
import FolioAndPaymentReviewDetails from "./FolioAndPaymentReviewDetails";
import { useState } from "react";
import FinancialStatusTag from "../../../component/FinancialStatusTag/FinancialStatusTag";

const FolioAndPaymentReviewTable = ({
    data,
    colorCheckBooking,
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
            width:140,
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
                summary={() => (
                    <Table.Summary fixed="bottom">
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0} colSpan={columns.length}>
                                <div className="flex justify-end items-center w-full py-1">
                                    <Button
                                        type="primary"
                                        onClick={colorCheckBooking}
                                        className="flex items-center gap-1"
                                    >
                                        Next Step
                                        <AiOutlineRight />
                                    </Button>
                                </div>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />


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
