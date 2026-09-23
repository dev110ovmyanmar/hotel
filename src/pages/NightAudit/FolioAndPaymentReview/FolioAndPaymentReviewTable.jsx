import { Button, Modal, Table, Tooltip } from "antd";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import PriceTag from "../../../component/PriceTag/PriceTag";
import FolioAndPaymentReviewDetails from "./FolioAndPaymentReviewDetails";
import { useState } from "react";
import FinancialStatusTag from "../../../component/FinancialStatusTag/FinancialStatusTag";
import { EyeOutlined } from "@ant-design/icons";

const FolioAndPaymentReviewTable = ({ data, backStep, nextStep, }) => {

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedFolio, setSelectedFolio] = useState(null);
    const [issueModalOpen, setIssueModalOpen] = useState(false);
    const [selectedIssues, setSelectedIssues] = useState([]);

    const handleView = (record) => {
        setSelectedFolio(record);
        setDrawerOpen(true);
    };

    const handleViewIssue = (record) => {
        setSelectedIssues(record?.reviewIssues || []);
        setIssueModalOpen(true);
    };

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
        // {
        //     title: "Unposted Charges",
        //     dataIndex: "hasUnpostedCharges",
        //     key: "hasUnpostedCharges",
        //     width: 140,
        //     render: (hasUnpostedCharges, record) => (
        //         <>  <div
        //             className={
        //                 hasUnpostedCharges === true
        //                     ? "text-[#389E0D]"
        //                     : "text-[#CF1322]"
        //             }
        //         >
        //             {hasUnpostedCharges === true ? "True" : "False"}
        //         </div>
        //         </>

        //     ),
        // },
        {
            title: "Unposted Charges",
            dataIndex: "hasUnpostedCharges",
            key: "hasUnpostedCharges",
            width: 140,
            render: (hasUnpostedCharges, record) => (
                <>
                    <div
                        className={
                            hasUnpostedCharges === true
                                ? "text-[#389E0D]"
                                : "text-[#CF1322]"
                        }
                    >
                        {hasUnpostedCharges === true ? "True" : "False"}
                    </div>

                    {record?.reviewIssues?.length !== 0 &&
                        <Tooltip title="View Issue">
                            <EyeOutlined onClick={(e) => {
                                e.stopPropagation();
                                handleViewIssue(record);
                            }} />
                        </Tooltip>
                    }
                </>
            ),
        }
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
                    disabled={data?.reviewSummary?.blockingFolios !== 0}
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

            <Modal
                title="Review Issues"
                open={issueModalOpen}
                onCancel={() => setIssueModalOpen(false)}
                footer={null}
                width={600}
            >
                <div className="space-y-4">
                    {selectedIssues.map((issue, index) => (
                        <div
                            key={index}
                            className="border rounded-lg p-4 bg-red-50 dark:bg-red-950/20"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-red-600">
                                    {issue?.code}
                                </span>

                                <span className="text-xs font-medium text-red-600">
                                    {issue?.status}
                                </span>
                            </div>

                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                {issue?.message}
                            </p>

                            {issue?.difference !== undefined && (
                                <div className="mt-2 text-sm">
                                    <span className="font-medium">Difference: </span>
                                    {" "}  <PriceTag value={issue.difference} /> MMK
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Modal>
        </>
    );
};

export default FolioAndPaymentReviewTable;
