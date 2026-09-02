import { EditOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space, Table, Tag } from "antd";
import { data } from "react-router-dom";
import PriceTag from "../../component/PriceTag/PriceTag";
import { AiOutlineRight } from "react-icons/ai";
import { nightAuditCheckBookings } from "../../api/nightAuditApi";
import useApiQuery from "../../hooks/useApiQuery";
import dayjs from "dayjs";
import ColorStatusTag from "../../component/ColorStatusTag/ColorStatusTag";


const WarningTable = ({
    warningData
}) => {
    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Type",
            // dataIndex: "name",
            // key: "name",
        },
        {
            title: "Details",
            dataIndex: "message",
            key: "message",
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

    return (
        <Table
            columns={columns}
            dataSource={warningData}
            pagination={false}
        />
    )
}

export default WarningTable