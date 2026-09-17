import { Drawer, Table, Tooltip } from "antd"
import useApiQuery from "../../../hooks/useApiQuery";
import { reservationRoomList } from "../../../api/reservationSectionApi";
import { fetchRoom } from "../../../api/roomApi";
import ColorStatusTag from "../../../component/ColorStatusTag/ColorStatusTag";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const PreAuditCheckDetails = ({
    onClose,
    open,
    selectedData
}) => {
    const navigate = useNavigate();
    const isTodayArrivals = selectedData?.code === "today_arrivals";
    const isUnassignedRooms = selectedData?.code === "unassigned_rooms";

    console.log(selectedData,"PreAuditCheckDetailsSelectedData")
    const { data } = useApiQuery({
        fetchQueryName: "reservationRoomList",
        fetchQueryFunction: reservationRoomList,
        params: {
            uuid: selectedData?.uuid,
        },
        options: {
            enabled: open && !!selectedData && isTodayArrivals,
        },
    });

    console.log(data, "DataInPreAuditCheckDetails")

    const { data: fetchRoomData, isLoading } = useApiQuery({
        fetchQueryName: "roomData",
        fetchQueryFunction: fetchRoom,
        // params: {
        //   pagination: {
        //     page: page,
        //     perPage: perPage,
        //   },
        //   keyword,
        //   status: normalStatus,
        // },
        options:{
            enabled: open && !!selectedData && isUnassignedRooms,
        }
    });

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 60,
        },
        {
            title: "Guest Name",
            dataIndex: ["guest", "fullName"],
            key: "guestName",
            width: 60,
        },
        {
            title: "Room Type",
            key: "roomTyoe",
            width: 60,
            render: (record) => {

                return (
                    <>
                        <div>{record?.roomType?.name}</div>
                        {
                            record?.room
                                ?
                                <span>({record?.room?.roomNo})</span>
                                :
                                null
                        }

                    </>
                )

            }
        },
        {
            title: "Room Status",
            dataIndex: "roomStatus",
            key: "roomTyoe",
            width: 60,
            render: (text) => {
                return (
                    <ColorStatusTag status={text} />
                )

            }
        },
        {
            title: "Action",
            key: "action",
            // dataIndex: "action",
            fixed: "end",
            align: "center",
            width: 30,
            render: (record) => {

                const handlePreAuditView = () => {
                    if (record?.uuid) {
                        navigate(`/reservations/${record?.uuid}/room-information`);
                    }
                }

                return (
                    <>

                        <Tooltip title="View Details">
                            <EyeOutlined
                                onClick={handlePreAuditView}
                            />
                        </Tooltip>

                    </>
                )
            }
        },

    ];

    return (
        <Drawer
            title="Pre Audit Check Details"
            closable={{ 'aria-label': 'Close Button' }}
            onClose={onClose}
            open={open}
            size={550}
        >
            <Table
                columns={columns}
                dataSource={data?.data}
                pagination={false}

            />

        </Drawer>
    )
}

export default PreAuditCheckDetails