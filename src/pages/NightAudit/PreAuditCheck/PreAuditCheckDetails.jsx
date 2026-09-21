import { Drawer, Space, Table, Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";
import usePermission from "../../../hooks/usePermission";
import { PERMISSIONS } from "../../../variables/permission";

const PreAuditCheckDetails = ({
    onClose,
    open,
    selectedData
}) => {
    const { hasPermission } = usePermission();
    const handleMenuClick = (item) => {

        if (item?.reservationRoomUuid) {
            const url = `/reservations/${item.reservationRoomUuid}/room-information`;
            window.open(url, "_blank", "noopener,noreferrer");
        }
    };

    const tableData = selectedData?.details ?? [];

    const columns = [
        {
            title: "ID",
            dataIndex: "reservationId",
            key: "reservationId",
            width: 60,
        },
        {
            title: "Guest Name",
            dataIndex: "guestName",
            key: "guestName",
        },
        {
            title: "Room No",
            dataIndex: "roomNo",
            key: "roomNo",
        },
        {
            title: "Action",
            key: "action",
            fixed: "end",
            align: "center",
            width: 60,
            render: (_, record) => (
                <Tooltip title="View Details">
                    <EditOutlined
                        style={{ cursor: "pointer" }}
                        onClick={() => handleMenuClick(record)}
                    />
                </Tooltip>
            ),
        },
    ];

    return (
        <Drawer
            title="Pre Audit Check Details"
            closable={{ "aria-label": "Close Button" }}
            onClose={onClose}
            open={open}
            size={550}
        >
            <Table
                columns={columns}
                dataSource={tableData}
                pagination={false}
                rowKey={(record) => record.reservationRoomUuid}
            />
        </Drawer>
    );
};

export default PreAuditCheckDetails;


