import { CloseCircleOutlined, EditOutlined, EyeOutlined, MoreOutlined, WarningOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space, Table, Tag } from "antd";
import { AiOutlineRight } from "react-icons/ai";
import { CircleCheck } from "lucide-react";


const DailyChargePostingTable = ({
    colorCheckBooking,
    preAuditChecksData
}) => {
    const columns = [
        // {
        //     title: "Id",
        //     dataIndex: "id",
        //     key: "id",
        //     render: (text) => <div>{text}</div>
        // },
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
                                ? <CircleCheck size={15}/>
                                : warning
                                    ? <WarningOutlined className="!text-[15px]"/>
                                    : <CloseCircleOutlined className="!text-[15px]"/>
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
        // {
        //     title: "Details",
        //     dataIndex: "details",
        //     key: "details",
        //     align:"center"
        // },

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
                    {
                        key: "edit",
                        label: "Edit",
                        icon: <EditOutlined style={{ fontSize: "12px" }} />,
                        // permission: PERMISSIONS.ADMIN_EDIT,
                        // onClick: () => {
                        //     setDrawerOpen(true);
                        //     setMode("edit");
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
        <Table
            columns={columns}
            dataSource={preAuditChecksData}
            pagination={false}
            summary={() => (
                <Table.Summary fixed>
                    <Table.Summary.Row>
                        <Table.Summary.Cell index={0}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={2}></Table.Summary.Cell>
                        <Table.Summary.Cell index={3}>
                            <Button
                                type="primary"
                                onClick={colorCheckBooking}
                            >
                                Next Step
                                <AiOutlineRight />
                            </Button>
                        </Table.Summary.Cell>
                    </Table.Summary.Row>
                </Table.Summary>
            )}
        />
    )
}

export default DailyChargePostingTable