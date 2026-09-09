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
                const unposted = record?.code === "unposted";
                const total = record?.code === "total";

                return (
                    <Tag color={posted ? "red" : unposted ? "orange" : "green"}
                        className={
                            `!rounded ${posted
                                ? "!border-red-500"
                                : unposted
                                    ? "!border-orange-500"
                                    : "!border-green-500"
                            }`
                        }>
                        <div className="flex gap-x-2 items-center">
                            {posted
                                ? <CircleCheck size={15} />
                                : unposted
                                    ? <WarningOutlined className="!text-[15px]" />
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
        },
        {
            title: "Action",
            name: "action",
            dataIndex: "action",
            fixed: "end",
            align: "center",
            render: (_, record) => {
                const smallStyle = { fontSize: "12px" };

                const actions = [
                    {
                        key: "view",
                        label: "View",
                        icon: <EyeOutlined style={{ fontSize: "12px" }} />,
                        // permission: PERMISSIONS.ADMIN_VIEW,
                        // onClick: () => {
                        //     setDrawerOpen(true);
                        //     setMode("view");
                        //     setSelectedData(record);
                        // },
                    },

                ];

                // Filter actions based on permission & hidden flags
                const items = actions
                    .filter(
                        (action) =>
                            (!action.permission || hasPermission(action.permission)) && !action.hidden,
                    )
                    .map((action) => ({
                        key: action.key,
                        label: (
                            <Space size={4} style={smallStyle} onClick={action.onClick}>
                                {action.icon}
                                <span style={{ fontSize: "14px" }}>{action.label}</span>
                            </Space>
                        ),
                    }));

                return (
                    <Dropdown menu={{ items }} trigger={["click"]}>
                        <MoreOutlined style={{ fontSize: "16px" }} />
                    </Dropdown>
                );
            },
        },

    ];

    return (
        <div>
            <Table
                columns={columns}
                dataSource={dailyChargePostingData?.charges}
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