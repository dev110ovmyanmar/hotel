import { Drawer, Table, Tooltip } from "antd";
import { EditOutlined, LockOutlined } from "@ant-design/icons";
import usePermission from "../../../hooks/usePermission";
import { PERMISSIONS } from "../../../variables/permission";

const PreAuditCheckDetails = ({ onClose, open, selectedData }) => {

    const { hasPermission } = usePermission();
    const hasReservationRoomPermission = hasPermission(PERMISSIONS.RESERVATION_ROOM_LIST);

    const folio = selectedData?.code === "folio_posting_data_issues";
    const room = selectedData?.code === "blocked_rooms";

    const handleMenuClick = (item) => {
        if (folio && item?.reservationRoomUuid) {
            const url = `/reservations/${item.reservationRoomUuid}/folio-operations`;
            window.open(url, "_blank", "noopener,noreferrer");
        } else if (room) {
            const url = `/rooms/room-lists`;
            window.open(url, "_blank", "noopener,noreferrer");
        } else if (item?.reservationRoomUuid) {
            const url = `/reservations/${item.reservationRoomUuid}/room-information`;
            window.open(url, "_blank", "noopener,noreferrer");
        }
    };

    const tableData = selectedData?.details ?? [];

    const columns = [
        {
            title: room ? "Room Type Name" : "Guest Name",
            dataIndex: room ? "roomTypeName" : "guestName",
            key: room ? "roomTypeName" : "guestName",
            render: (value) => value || "-",
        },
        {
            title: "Room No",
            dataIndex: "roomNo",
            key: "roomNo",
            render: (roomNo) => roomNo || "-",
        },
        {
            title: "Action",
            key: "action",
            fixed: "end",
            align: "center",
            width: 60,
            render: (_, record) => (
                <Tooltip
                    title={
                        hasReservationRoomPermission
                            ? "View Details"
                            : "Permission denied"
                    }
                >
                    {hasReservationRoomPermission ? (
                        <EditOutlined
                            style={{ cursor: "pointer" }}
                            onClick={() => handleMenuClick(record)}
                        />
                    ) : (
                        <LockOutlined
                            style={{
                                cursor: "not-allowed",
                                color: "#999",
                            }}
                        />
                    )}
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
