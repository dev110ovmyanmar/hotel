import { EditOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space, Table, Tag } from "antd";
import { data } from "react-router-dom";
import PriceTag from "../../component/PriceTag/PriceTag";
import { AiOutlineRight } from "react-icons/ai";


const RoomChargeTable = ({
    roomChargeClick
}) => {
    const columns = [
        {
            title: "Order Id",
            dataIndex: "orderId",
            key: "orderId",
            render: (text) => <div>{text}</div>
        },
        {
            title: "Check In Date, Time",
            dataIndex: "checkInDateTime",
            key: "checkInDateTime",
            render: (text) => <div>{text}</div>
        },
        {
            title: "Check Out Date, Time",
            dataIndex: "checkOutDateTime",
            key: "checkOutDateTime",
            render: (text) => <div>{text}</div>
        },
        {
            title: "Room",
            dataIndex: "room",
            key: "room",
            render: (text) => <div>{text}</div>
        },
        {
            title: "Total (MMK)",
            dataIndex: "total",
            key: "total",
            render: (text) => <PriceTag value={text} />
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

    const dataSource = [
        {
            key: "1",
            orderId: "1000",
            checkInDateTime: "21/1/2026 1:00 PM",
            checkOutDateTime: "22/1/2026 5:00 PM",
            room: "DBD 301",
            total: 180000,
        },
        {
            key: "2",
            orderId: "1000",
            checkInDateTime: "21/1/2026 1:00 PM",
            checkOutDateTime: "22/1/2026 5:00 PM",
            room: "DBD 302",
            total: 180000,
        },
        {
            key: "3",
            orderId: "1000",
            checkInDateTime: "21/1/2026 1:00 PM",
            checkOutDateTime: "22/1/2026 5:00 PM",
            room: "DBD 303",
            total: 180000,
        },


    ];
    return (
        <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            summary={() => (
                <Table.Summary fixed>
                    <Table.Summary.Row>
                        <Table.Summary.Cell index={0}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}></Table.Summary.Cell>
                        <Table.Summary.Cell index={2}></Table.Summary.Cell>
                        <Table.Summary.Cell index={3}></Table.Summary.Cell>
                        <Table.Summary.Cell index={4}></Table.Summary.Cell>
                        <Table.Summary.Cell index={5}>
                            <Button
                                type="primary"
                                onClick={roomChargeClick}
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

export default RoomChargeTable