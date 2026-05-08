import { ArrowRightOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Drawer, Modal, Tag } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { MdOutlineEscalatorWarning, MdPeopleOutline } from "react-icons/md";


const RoomBookedDrawer = ({
    roomBookOpen,
    setRoomBookOpen,
    roomConfirm,
    setRoomConfirm,
    selectedData,
    setSelectedData,
    roomBookValues,
    setRoomBookValues
}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteKey, setDeleteKey] = useState();

    const roomConfirmClick = () => {
        setRoomConfirm(true);
        setRoomBookOpen(false);
    };


    // const handleDelete = (one, two) => {
    //     setSelectedData((prev) => {
    //         return (prev.filter(item => item.key !== deleteKey))
    //     });

    //     setModalOpen(false);
    //     setRoomBookOpen(false);
    // }

    console.log(roomBookValues, "INRoomBookDrawer");
    return (
        <Drawer
            size={550}
            title={
                <div className="flex justify-between gap-4">
                    <span>View Room Booked</span>
                    <Button type="primary" onClick={roomConfirmClick} >
                        Room Confirm
                    </Button>
                </div>
            }
            open={roomBookOpen}
            onClose={() => setRoomBookOpen(false)}
            footer={
                <div className="flex justify-around gap-4 py-3">
                    <span className="!text-md">Total</span>
                    <span className="!text-md !font-bold">{roomBookValues?.grandTotal.toLocaleString()} MMK</span>
                </div>
            }

        >
            <div className="flex justify-between">
                <div>
                    <p>Check In Date</p>
                    <p>{roomBookValues?.filter.checkinDate}</p>
                </div>

                <div>
                    <ArrowRightOutlined />
                </div>

                <div>
                    <p>Check Out Date</p>
                    <p>{roomBookValues?.filter.checkoutDate}</p>
                </div>

            </div>

            <Divider />

            <p className="font-bold mb-2">Room Information</p>

            <div className="!space-y-3">
                {
                    roomBookValues?.rooms?.map((room) => (
                        <Card className="!shadow-xl">
                            <div className="flex justify-between">
                                <div className="flex">
                                    <p className="mr-3">{room?.roomType?.name}</p>
                                    <Tag color="blue">{room?.totalRooms} Room</Tag>
                                </div>
                                <div>
                                    <DeleteOutlined className="!text-red-500" onClick={() => {
                                        // setModalOpen(true),
                                        // setDeleteKey(i?.key)
                                    }}
                                    />
                                </div>
                            </div>

                            <div className="flex">
                                <div className="flex mr-2">
                                    <MdPeopleOutline fontSize={19} className="mt-1" />
                                    <span className="text-md ml-2 mt-1 ">{room?.adults}</span>
                                </div>
                                {/* <div className="flex">
                                    <MdOutlineEscalatorWarning />
                                    <span className="text-xs ml-1">{i?.child}</span>
                                </div> */}

                                <div className="text-lg text-gray-400 mx-2">|</div>

                                <div className="!text-md ml-1 mt-1">{room?.extraBed} Extra Bed</div>
                            </div>

                            <Divider />

                            {
                                room?.ratePlans?.map((rate) =>
                                    <div className="flex justify-between">
                                        <p>{rate?.name}</p>
                                        <p className="font-bold">{rate?.totalPrice?.toLocaleString()} MMK</p>
                                    </div>
                                )
                            }



                        </Card>

                    ))
                }
            </div>


            <Modal
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
            // onOk={handleDelete}
            >
                Are you sure you want to delete ?
            </Modal>
        </Drawer>
    );
};

export default RoomBookedDrawer;

//Same Room and Different Rate Plan
// {
//     roomBookValues?.rooms?.map((room) => (
//         room.ratePlans.map((rate) => (
//             <Card className="!shadow-xl">
//                 <div className="flex justify-between">
//                     <div className="flex">
//                         <p className="mr-3">{room?.roomType?.name}</p>
//                         <Tag color="blue">{rate?.subTotalRooms} Room</Tag>
//                     </div>
//                     <div>
//                         <DeleteOutlined className="!text-red-500" onClick={() => {
//                             // setModalOpen(true),
//                             // setDeleteKey(i?.key)
//                         }}
//                         />
//                     </div>
//                 </div>

//                 <div className="flex">
//                     <div className="flex mr-2">
//                         <MdPeopleOutline fontSize={19} className="mt-1" />
//                         <span className="text-md ml-2 mt-1 ">{room?.adults}</span>
//                     </div>
//                     {/* <div className="flex">
//                                     <MdOutlineEscalatorWarning />
//                                     <span className="text-xs ml-1">{i?.child}</span>
//                                 </div> */}

//                     <div className="text-lg text-gray-400 mx-2">|</div>

//                     <div className="!text-md ml-1 mt-1">{room?.extraBed} Extra Bed</div>
//                 </div>

//                 <Divider />

//                 <div className="flex justify-between">
//                     <p>{rate?.name}</p>
//                     <p className="font-bold">{rate?.subTotalPrice}</p>
//                 </div>

//             </Card>
//         ))

//     ))
// }

