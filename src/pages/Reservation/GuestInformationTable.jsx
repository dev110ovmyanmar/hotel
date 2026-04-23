import { EditOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import { Dropdown, Space, Table } from "antd";
import { PERMISSIONS } from "../../variables/permission";


const GuestInformationTable = ({
    guestInfoTable,
    setGuestInfoTable
}) => {
    const columns = [
        {
            title: "Guest Name",
            dataIndex: "guestName",
            key: "guestName",
            render: (text) => <div>{text}</div>
        },
        {
            title: "Phone Number 1",
            dataIndex: "phoneNumberOne",
            key: "phoneNumberOne",
            render: (text) => <div>{text}</div>
        },
        {
            title: "Phone Number 2",
            dataIndex: "phoneNumberTwo",
            key: "phoneNumberTwo",
            render: (text) => <div>{text}</div>
        },
        {
            title: "Action",
            render: (_, record) => {
                const smallStyle = { fontSize: "12px" };

                // Define all possible actions
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
            guestName: "Liam Johnson Smith",
            phoneNumberOne: "+959 123-456-789",
            phoneNumberTwo: "+959 123-456-789"
        }

    ];
    return (
        <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
        />
    )
}


export default GuestInformationTable;