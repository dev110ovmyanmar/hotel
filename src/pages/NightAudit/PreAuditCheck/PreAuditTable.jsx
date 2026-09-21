import { CloseCircleOutlined, EyeOutlined, LockOutlined, MoreOutlined, WarningOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space, Table, Tag, Tooltip } from "antd";
import { AiOutlineRight } from "react-icons/ai";
import { CircleCheck } from "lucide-react";
import { PERMISSIONS } from "../../../variables/permission";
import PreAuditCheckDetails from "./PreAuditCheckDetails";
import { useState } from "react";
import useApiQuery from "../../../hooks/useApiQuery";
import { reservationRoomList } from "../../../api/reservationSectionApi";

const PreAuditTable = ({
    colorCheckBooking,
    preAuditChecksData
}) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedData, setSelectedData] = useState({});

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
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Count",
            dataIndex: "count",
            key: "count",
            align: "end"
        },
        {
            title: "Action",
            name: "action",
            dataIndex: "action",
            fixed: "end",
            align: "center",
            render: (_, record) => {
                const hasPermissionForReservationList = PERMISSIONS?.RESERVATION_LIST;

                const handlePreAuditView = () => {
                    setDrawerOpen(true);
                    setSelectedData(record)
                }

                return (
                    <>
                        {
                           record?.details?.length > 0
                                ?
                                <Tooltip title="View Details">
                                    <EyeOutlined
                                        onClick={handlePreAuditView}
                                    />
                                </Tooltip>
                                :
                                <Tooltip title="Locked" >
                                    <LockOutlined disabled className="!text-gray-400 cursor-not-allowed" />
                                </Tooltip>
                        }

                    </>
                )
            }
        },

    ];

    return (
        <div>
            <Table
                columns={columns}
                dataSource={preAuditChecksData?.checks}
                pagination={false}
            />
            <div className="sticky bottom-0 flex justify-end bg-gray-50 dark:bg-[#121111] py-2 px-4 z-10">
                <Button
                    type="primary"
                    onClick={colorCheckBooking}
                    className="flex items-center gap-1"
                    disabled={preAuditChecksData?.summary?.blockingIssues !== 0}
                >
                    Next Step
                    <AiOutlineRight />
                </Button>
            </div>

            <PreAuditCheckDetails
                onClose={() => setDrawerOpen(false)}
                open={drawerOpen}
                selectedData={selectedData}
            />

        </div>
    )
}

export default PreAuditTable

