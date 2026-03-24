import { Button, Dropdown, Tag } from "antd";
import { EditOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import ColorStatusTag from "../../../component/ColorStatusTag/ColorStatusTag";

export default function useRestaurantTableColumns(onEdit, onView) {
    return [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 80,
        },
        {
            title: "Table No",
            dataIndex: "tableNo",
            key: "tableNo",
        },
        {
            title: "Capacity",
            dataIndex: "capacity",
            key: "capacity",
            render: (capacity) => `${capacity} Seats`,
        },
        {
            title: "Status",
            dataIndex: "tableStatus",
            key: "tableStatus",
            render: (_, record) => {
                return (
                    <ColorStatusTag status={record?.tableStatus} />
                );
            },
        },
        {
            title: "Actions",
            key: "actions",
            width: 100,
            fixed: 'right',
            render: (_, record) => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: "1",
                                label: "View",
                                icon: <EyeOutlined />,
                                onClick: () => onView(record)
                            },
                            {
                                key: "2",
                                label: "Edit",
                                icon: <EditOutlined />,
                                onClick: () => onEdit(record)
                            },
                        ],
                    }}
                    trigger={["click"]}
                    placement="bottomRight"
                >
                    <Button
                        icon={<MoreOutlined />}
                        size="small"
                        type="text"
                        className="flex items-center justify-center"
                    />
                </Dropdown>
            ),
        },
    ];
}