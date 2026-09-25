import { CloseCircleOutlined } from "@ant-design/icons";
import { Button, Table, Tag } from "antd";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { CircleCheck } from "lucide-react";
import PriceTag from "../../../component/PriceTag/PriceTag";

const DailyChargePostingTable = ({
    nextStep,
    backStep,
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
            // render: (record) => {
            //     const posted = record?.chargeStatus === "posted";

            //     return (
            //         <Tag color={posted ? "green" : "red"}
            //             className={
            //                 `!rounded ${posted
            //                     ? "!border-green-500"
            //                     : "!border-red-500"
            //                 }`
            //             }>
            //             <div className="flex gap-x-2 items-center">
            //                 {posted
            //                     ? <CircleCheck size={15} />
            //                     : <CloseCircleOutlined className="!text-[15px]" />
            //                 }
            //                 <div>{record?.chargeStatus?.charAt(0).toUpperCase() + record?.chargeStatus?.slice(1).toLowerCase()}</div>
            //             </div>
            //         </Tag>
            //     )
            // }
        },
        {
            title: "Grand Total",
            dataIndex: "grandTotal",
            key: "grandTotal",
            render: (text) => {
                return (
                    <PriceTag value={text} />
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
                    disabled={dailyChargePostingData?.summary?.unposted !== 0}
                >
                    Next Step
                    <AiOutlineRight />
                </Button>
            </div>
        </div>
    )
}

export default DailyChargePostingTable