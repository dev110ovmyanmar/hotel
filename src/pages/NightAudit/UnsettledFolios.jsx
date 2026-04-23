import { EditOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space, Table, Tag } from "antd";
import { data } from "react-router-dom";
import PriceTag from "../../component/PriceTag/PriceTag";
import { AiOutlineRight } from "react-icons/ai";


const UnsettledFolios = ({
    unsettledFolioClick
}) => {
    const columns = [
        {
            title: "Reservation Id",
            dataIndex: "reservationId",
            key: "reservationId",
            render: (text) => <div>{text}</div>
        },
        {
            title: "Fillio Id",
            dataIndex: "fillioId",
            key: "fillioId",
            render: (text) => <div>{text}</div>
        },
        {
            title: "Fillio Line ID",
            dataIndex: "fillioLineId",
            key: "fillioLineId",
            render: (text) => <div>{text}</div>
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: (text) => <div>{text}</div>
        },
        {
            title: "Guest Name",
            dataIndex: "guestName",
            key: "guestName",
            render: (text) => <div>{text}</div>
        },
        {
            title: "Room No",
            dataIndex: "roomNo",
            key: "roomNo",
            render: (text) => <div>{text}</div>
        },
        {
            title: "Balance",
            dataIndex: "balance",
            key: "balance",
            render: (text) => <PriceTag value={text} />
        },
        {
            title: "Action",
            name: "action",
            dataIndex: "action",
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
            reservationId: "1000",
            fillioId:"FID1234",
            fillioLineId:"FLID123456",
            date: "21/1/2026",
            guestName:"Liam Johnson Smith",
            roomNo:"DBD 301",
            balance: 300000,
        },
        {
            key: "2",
            reservationId: "1000",
            fillioId:"FID1234",
            fillioLineId:"FLID123456",
            date: "21/1/2026",
            guestName:"Liam Johnson Smith",
            roomNo:"DBD 302",
            balance: 300000,
        },
        {
            key: "3",
            reservationId: "1000",
            fillioId:"FID1234",
            fillioLineId:"FLID123456",
            date: "21/1/2026",
            guestName:"Liam Johnson Smith",
            roomNo:"DBD 303",
            balance: 300000,
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
                        <Table.Summary.Cell index={7}>
                            <Button type="primary" onClick={unsettledFolioClick}>
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

export default UnsettledFolios