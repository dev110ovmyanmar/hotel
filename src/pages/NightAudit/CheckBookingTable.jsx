import { EditOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space, Table, Tag } from "antd";
import { data } from "react-router-dom";
import PriceTag from "../../component/PriceTag/PriceTag";
import { AiOutlineRight } from "react-icons/ai";
import { nightAuditCheckBookings } from "../../api/nightAuditApi";
import useApiQuery from "../../hooks/useApiQuery";
import dayjs from "dayjs";
import ColorStatusTag from "../../component/ColorStatusTag/ColorStatusTag";


const CheckBookingTable = ({
    colorCheckBooking
}) => {
    const columns = [
        {
            title: "Id",
            dataIndex: "id",
            key: "id",
            render: (text) => <div>{text}</div>
        },
        {
            title: "Check In",
            dataIndex: "checkinDate",
            key: "checkinDate",
            render: (text) => <div>{dayjs(text).format("YYYY-MM-DD")}</div>
        },
        {
            title: "Check Out",
            dataIndex: "checkoutDate",
            key: "checkoutDate",
            render: (text) => <div>{dayjs(text).format("YYYY-MM-DD")}</div>
        },
        {
            title: "Total Night",
            dataIndex: "totalNight",
            key: "totalNight",
            render: (text) => <div>{text}</div>,
            align:"center"
        },
        // {
        //     title: "Payment",
        //     dataIndex: "payment",
        //     key: "payment",
        //     render: (text) => <div>{text}</div>
        // },
        {
            title: "Total (MMK)",
            dataIndex: "grandTotal",
            key: "grandTotal",
            render: (text) => <PriceTag value={text} />,
            align: "right"

        },
        // {
        //     title: "Balance (MMK)",
        //     dataIndex: "balance",
        //     key: "balance",
        //     render: (text) => <PriceTag value={text} />
        // },
        {
            title: "Status",
            dataIndex: "roomStatus",
            key: "roomStatus",
            render: (_, record) => <ColorStatusTag status={record?.roomStatus} />,
            align:"center"
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

    const { data: nightAuditCheckBookingData, isLoading, error } = useApiQuery({
        fetchQueryName: "night-audit-check-bookings",
        fetchQueryFunction: nightAuditCheckBookings,
    });

    return (
        <Table
            columns={columns}
            dataSource={nightAuditCheckBookingData}
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