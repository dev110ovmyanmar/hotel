import { CloseCircleOutlined, EditOutlined, EyeOutlined, MoreOutlined, WarningOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space, Table, Tag } from "antd";
import { AiOutlineRight } from "react-icons/ai";
import { CircleCheck } from "lucide-react";
import { nextStepButtonDesign } from "../../../variables/constants";


const DailyChargePostingTable = ({
    colorCheckBooking,
    dailyChargePostingData
}) => {
    const columns = [
        {
            title: "No",
            key: "no",
            render: (_, __, index) => <div>{index + 1}</div>,
        },
        {
            title: "Room No",
            dataIndex: ["reservationRoom", "room", "roomNo"],
            key: "roomNo",
        },
        {
            title: "Status",
            dataIndex: "chargeStatus",
            key: "chargeStatus",
            align: "center",
            render: (record) => {
                const posted = record?.code === "posted";

                return (
                    <Tag color={posted ? "green" : "red"}
                        className={
                            `!rounded ${posted
                                ? "!border-green-500"
                                : "!border-red-500"
                            }`
                        }>
                        <div className="flex gap-x-2 items-center">
                            {posted
                                ? <CircleCheck size={15} />
                                : <CloseCircleOutlined className="!text-[15px]" />
                            }
                            <div>{record?.name?.charAt(0).toUpperCase() + record?.name?.slice(1).toLowerCase()}</div>
                        </div>
                    </Tag>
                )
            }
        },
        {
            title: "Grand Total",
            dataIndex: "grandTotal",
            key: "grandTotal",
            render: (text) => {
                return (
                    <div className="text-end">{text?.toLocaleString()}</div>
                )
            },
            align: "right"
        }
    ];

    return (
        <div>
            <Table
                columns={columns}
                dataSource={dailyChargePostingData?.charges}
                pagination={false}
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
    )
}

export default DailyChargePostingTable