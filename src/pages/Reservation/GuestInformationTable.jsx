import { EditOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import { Dropdown, Space, Table } from "antd";
import { PERMISSIONS } from "../../variables/permission";


const GuestInformationTable = ({
    guestInfoTable,
    setGuestInfoTable,
    contactPersonInfo,
    setContactPersonInfo
}) => {

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text) => <div>{text}</div>
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
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

    return (
        <Table
            columns={columns}
            dataSource={[contactPersonInfo]}
            pagination={false}
        
        />
    )
}


export default GuestInformationTable;