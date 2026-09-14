import { CloseCircleOutlined, EyeOutlined, MoreOutlined, WarningOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space, Table, Tag } from "antd";
import { AiOutlineRight } from "react-icons/ai";
import { CircleCheck } from "lucide-react";

const PreAuditTable = ({
    colorCheckBooking,
    preAuditChecksData
}) => {

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
                dataSource={preAuditChecksData?.checks}
                pagination={false}
            />
            <div className="sticky bottom-0 flex justify-end bg-gray-50 py-2 px-4 z-10">
               
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

        </div>
    )
}

export default PreAuditTable

