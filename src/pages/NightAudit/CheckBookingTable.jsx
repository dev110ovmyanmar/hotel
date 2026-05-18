import { EditOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space, Table, Tag } from "antd";
import { data } from "react-router-dom";
import PriceTag from "../../component/PriceTag/PriceTag";
import { AiOutlineRight } from "react-icons/ai";


const CheckBookingTable = ({
    colorCheckBooking
}) => {
    const columns = [
        {
            title: "Order Id",
            dataIndex: "orderId",
            key: "orderId",
            render: (text) => <div>{text}</div>
        },
        {
            title: "Check In",
            dataIndex: "checkIn",
            key: "checkIn",
            render: (text) => <div>{text}</div>
        },
        {
            title: "Check Out",
            dataIndex: "checkOut",
            key: "checkOut",
            render: (text) => <div>{text}</div>
        },
        {
            title: "Night",
            dataIndex: "night",
            key: "night",
            render: (text) => <div>{text}</div>
        },
        {
            title: "Payment",
            dataIndex: "payment",
            key: "payment",
            render: (text) => <div>{text}</div>
        },
        {
            title: "Total (MMK)",
            dataIndex: "total",
            key: "total",
            render: (text) => <PriceTag value={text} />
        },
        {
            title: "Balance (MMK)",
            dataIndex: "balance",
            key: "balance",
            render: (text) => <PriceTag value={text} />
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (text) => (
                <Tag>{text}</Tag>
            )
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
            checkIn: "21/1/2026",
            checkOut: "22/1/2026",
            night: "1",
            total: 180000,
            payment: "Cash",
            balance: 30000,
            status: "confirmed"
        },
        {
            key: "2",
            orderId: "1000",
            checkIn: "21/1/2026",
            checkOut: "22/1/2026",
            night: "1",
            total: "180000",
            payment: "Cash",
            balance: "30000",
            status: "confirmed"
        },
        {
            key: "3",
            orderId: "1000",
            checkIn: "21/1/2026",
            checkOut: "22/1/2026",
            night: "1",
            total: "180000",
            payment: "Cash",
            balance: "30000",
            status: "confirmed",
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
                        <Table.Summary.Cell index={5}></Table.Summary.Cell>
                        <Table.Summary.Cell index={6}></Table.Summary.Cell>
                        <Table.Summary.Cell index={7}></Table.Summary.Cell>
                        <Table.Summary.Cell index={8}>
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

export default CheckBookingTable