import { CloseCircleOutlined, EditOutlined, EyeOutlined, MoreOutlined, WarningOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Col, Dropdown, Form, Row, Space, Table, Tag } from "antd";
import { AiOutlineRight } from "react-icons/ai";
import { Calendar1Icon, CalendarRange, CircleCheck, LockKeyhole } from "lucide-react";
import dayjs from "dayjs";
import { addDays, nextStepButtonDesign } from "../../../variables/constants";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { clickCloseBusinessDate, clickCreateNewDay } from "../../../api/nightAuditApi";
import { useState } from "react";

const CloseBusinessDateTable = ({
    colorCheckBooking,
    preAuditChecksData
}) => {

    const [form] = Form.useForm();
    const nextBusinessDate = addDays(preAuditChecksData?.businessDate, 1);

    const closeBusinessDateMutate = useApiMutation({
        mutationFn: clickCloseBusinessDate,
        // invalidateKeys: [["admins"]],
    });

    const createNewDayMutate = useApiMutation({
        mutationFn: clickCreateNewDay,
        // invalidateKeys: [["admins"]],
    });

    const handleCloseBusinessDate = () => {
        closeBusinessDateMutate.mutate({
            businessDate: preAuditChecksData?.businessDate
        })
    };

    const handlecreateNewDay = () => {
        createNewDayMutate.mutate({
            businessDate: nextBusinessDate
        }, {
            onSuccess: () => {
                setShowNewBusinessDayCard(true)
            }
        })
    };

    console.log(nextBusinessDate, "nextBusinessDate")
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
                console.log(text, "TextStatus")
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
                        // summary={() => (
                        //     <Table.Summary fixed="bottom">
                        //         <Table.Summary.Row>
                        //             <Table.Summary.Cell index={0} colSpan={columns.length}>
                        //                 <div className="flex justify-end items-center w-full py-1">
                        //                     <Button
                        //                         type="primary"
                        //                         onClick={colorCheckBooking}
                        //                         className="flex items-center gap-1"
                        //                     >
                        //                         Next Step
                        //                         <AiOutlineRight />
                        //                     </Button>
                        //                 </div>
                        //             </Table.Summary.Cell>
                        //         </Table.Summary.Row>
                        //     </Table.Summary>
                        // )}
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
                                        className="!w-full"
                                        onClick={handleCloseBusinessDate}
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
    )
}

export default CloseBusinessDateTable