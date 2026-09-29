import { CloseCircleOutlined, WarningOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Row, Table, Tag } from "antd";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { CalendarRange, CircleCheck, LockKeyhole } from "lucide-react";
import { addDays } from "../../../variables/constants";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { clickCloseBusinessDate } from "../../../api/nightAuditApi";
import { useState } from "react";    

const CloseBusinessDateTable = ({
    backStep,
    nextStep,
    preAuditChecksData
}) => {

    const [form] = Form.useForm();
    const nextBusinessDate = addDays(preAuditChecksData?.businessDate, 1);
    const [successCloseBusinessDate, setSuccessCloseBusinessDate] = useState(false);
    const disableBtn = preAuditChecksData?.summary?.blockingIssues !== 0;

    const closeBusinessDateMutate = useApiMutation({
        mutationFn: clickCloseBusinessDate,
        // invalidateKeys: [["admins"]],
    });

    // const createNewDayMutate = useApiMutation({
    //     mutationFn: clickCreateNewDay,
    //     // invalidateKeys: [["admins"]],
    // });

    const auditData = JSON.parse(
        localStorage.getItem("nightAudit")
    );
    const activeButton = auditData?.auditStatus === "completed";

    const handleCloseBusinessDate = () => {
        closeBusinessDateMutate.mutate({
            businessDate: preAuditChecksData?.businessDate
        },
            {
                onSuccess: (data) => {
                    const nightAuditStatus = data?.auditStatus;
                    const nightAuditData = JSON.parse(
                        localStorage.getItem("nightAudit")
                    );

                    localStorage.setItem(
                        "nightAudit",
                        JSON.stringify({
                            ...nightAuditData,
                            auditStatus: nightAuditStatus
                        })
                    );

                    setSuccessCloseBusinessDate(true)
                }
            })
    };

    // const handlecreateNewDay = () => {
    //     createNewDayMutate.mutate({
    //         businessDate: nextBusinessDate
    //     }, {
    //         onSuccess: () => {
    //             setShowNewBusinessDayCard(true)
    //         }
    //     })
    // };

    const columns = [
        {
            title: "No",
            key: "no",
            render: (_, __, index) => {
                return <div>{index + 1}</div>;
            },
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            render: (text) => {
                const blocking = text === "BLOCKING";
                const passed = text === "PASSED";
                const warning = text === "WARNING"
                return (
                    <Tag color={blocking ? "red" : warning ? "orange" : "green"}
                        className={
                            `!rounded ${blocking
                                ? "!border-red-500"
                                : warning
                                    ? "!border-orange-500"
                                    : "!border-green-500"
                            }`
                        }>
                        <div className="flex gap-x-2 items-center">
                            {passed
                                ? <CircleCheck size={15} />
                                : warning
                                    ? <WarningOutlined className="!text-[15px]" />
                                    : <CloseCircleOutlined className="!text-[15px]" />
                            }
                            <div>{text?.charAt(0).toUpperCase() + text?.slice(1).toLowerCase()}</div>
                        </div>
                    </Tag>
                )
            }
        },
        {
            title: "Count",
            dataIndex: "count",
            key: "count",
        },

    ];

    return (
        <div >
            <Row gutter={10}>
                <Col span={14}>
                    <Table
                        columns={columns}
                        dataSource={preAuditChecksData?.checks}
                        pagination={false}
                    />
                </Col>

                <Col span={10}>
                    <Card
                        title={
                            <div className="flex flex-col gap-y-3 py-3">
                                <div>Closure Summary</div>
                                <div className="flex justify-start items-center gap-x-5 p-3 border border-green-300  bg-[#F6FFED] text-green-600 rounded">
                                    <div>
                                        <CircleCheck />
                                    </div>
                                    <div className="text-green-600">
                                        <div>Ready To Close</div>
                                        <div className="!text-[10px]">All Required checks are completed. No blocking issues found.</div>
                                    </div>
                                </div>
                            </div>
                        }
                    >
                        <div>
                            <div>
                                <div className="text-lg font-bold">Final Confirmation</div>
                                <div className="!text-[10px]">Once closed, the current business date will be finalized and a new day will be created.</div>
                            </div>

                            <div className="flex flex-col gap-y-2 border border-blue-200 rounded bg-blue-50 p-3 !my-5">
                                <div className="flex gap-x-6">
                                    <div><CalendarRange /></div>
                                    <div>{preAuditChecksData?.businessDate}</div>
                                </div>

                                <div className="flex gap-x-6">
                                    <div><CalendarRange /></div>
                                    <div>All Folios, payments and daily charges will be finalized.</div>
                                </div>

                                <div className="flex gap-x-6">
                                    <div><CalendarRange /></div>
                                    <div>System will be prepared for the next business date {nextBusinessDate}</div>
                                </div>
                            </div>

                            <Form
                                form={form}
                            >

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        className="!w-full"
                                        onClick={handleCloseBusinessDate}
                                        disabled={activeButton || disableBtn}
                                        loading={closeBusinessDateMutate.isPending}

                                    >
                                        <div className="flex gap-x-5">
                                            <div><LockKeyhole /></div>
                                            <div>Close Business Date</div>
                                        </div>
                                    </Button>
                                </Form.Item>
                            </Form>


                        </div>
                    </Card>
                </Col>
            </Row>

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
                    disabled={!activeButton}
                >
                    Next Step
                    <AiOutlineRight />
                </Button>
            </div>
        </div>
    )
}

export default CloseBusinessDateTable