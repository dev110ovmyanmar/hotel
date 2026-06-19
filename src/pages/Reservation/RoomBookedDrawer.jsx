import { ArrowRightOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Drawer, Modal, Tag } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { FaMoon } from "react-icons/fa";
import { MdOutlineEscalatorWarning, MdPeopleOutline } from "react-icons/md";
import RoomModalBox from "./RoomModalBox";


const RoomBookedDrawer = ({
    roomBookOpen,
    setRoomBookOpen,
    roomConfirm,
    setRoomConfirm,
    selectedData,
    setSelectedData,
    roomBookValues,
    setRoomBookValues,
    rateQuotes,
    modalOpen,
    setModalOpen

}) => {
    const [deleteKey, setDeleteKey] = useState();
    const [priceKey, setPriceKey] = useState();
    const [rateKey, setRateKey] = useState();
    const [roomModalBoxOpen, setRoomModalBoxOpen] = useState(false);

    console.log(roomBookValues,
        "RoomBookedValue"
    )

    const roomConfirmClick = () => {
        setRoomConfirm(true);
        setRoomBookOpen(false);
    };

    const handleDelete = () => {
        setSelectedData((prev = []) => (
            prev.filter(item => item.roomTypeUuid !== deleteKey)
        ));

        setRoomBookValues((prev) => {
            const updatedValues = {
                ...prev,
                rooms: prev.rooms.filter(
                    (room) => room.roomType.uuid !== deleteKey
                )
            };

            rateQuotes.mutate(updatedValues ? updatedValues : []);

            return updatedValues;
        });

    };

    // console.log(dayjs(roomBookValues?.filter.checkoutDate).format("YYYY-MM-DD"),"RoomBookValueFilterCheckInDate")

    const checkInDate = dayjs(roomBookValues?.filter.checkinDate).startOf("day");
    const checkOutDate = dayjs(roomBookValues?.filter.checkoutDate).startOf("day");
    const totalNights = checkOutDate.diff(checkInDate, "day");

    return (
        <Drawer
            size={550}
            title={
                <div className="flex justify-between gap-4" >
                    <span>View Room Booked</span>
                    <Button type="primary" onClick={roomConfirmClick}>
                        Room Confirm
                    </Button>
                </div>
            }
            open={roomBookOpen}
            onClose={() => setRoomBookOpen(false)}
            footer={
                <>
                    <div className="flex gap-4 py-2">
                        <div className="ml-2">SubTotal</div>
                        <div className="flex flex-1 !justify-end">
                            <div className="!text-md !font-bold">{roomBookValues?.subTotal.toLocaleString()} MMK</div>
                        </div>
                    </div>

                    <div className="flex gap-4 py-2">
                        <div className="ml-2">Incentive Total</div>
                        <div className="flex flex-1 !justify-end">
                            <div className="!text-md !font-bold">{roomBookValues?.incentiveTotal.toLocaleString()} MMK</div>
                        </div>
                    </div>

                    <div className="flex gap-4 py-2">
                        <div className="ml-2">Tax Total</div>
                        <div className="flex flex-1 !justify-end">
                            <div className="!text-md !font-bold">{roomBookValues?.taxTotal.toLocaleString()} MMK</div>
                        </div>
                    </div>

                    <Divider />

                    <div className="flex gap-4 py-2">
                        <div className="!text-xl font-bold ml-2">Grand Total</div>
                        <div className="flex flex-1 !justify-end">
                            <div className="!text-md !font-bold">{roomBookValues?.grandTotal.toLocaleString()} MMK</div>
                        </div>
                    </div>
                </>
            }

        >
            <div className="flex justify-between">
                <div>
                    <p>Check-in</p>
                    <p className="font-bold">{dayjs(roomBookValues?.filter.checkinDate).format("DD-MM-YYYY")}</p>
                </div>

                <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 ml-auto sm:ml-0">
                    <FaMoon className="text-xs" />
                    <span className="text-xs font-bold whitespace-nowrap">
                        {totalNights}
                        {totalNights === 1 ? " Night" : " Nights"}
                    </span>
                </div>

                <div>
                    <p>Check-out</p>
                    <p className="font-bold">{dayjs(roomBookValues?.filter.checkoutDate).format("DD-MM-YYYY")}</p>
                </div>

            </div>

            <Divider />

            <p className="font-bold mb-2">Room Information</p>

            <div className="!space-y-3">
                {
                    roomBookValues?.rooms?.map((room) => (
                        <Card className="!shadow-xl">
                            <div className="bg-[#e6f4ff] p-4 mb-4">
                                <div className="flex justify-between">
                                    <div className="flex">
                                        <p className="mr-3 text-[#5758d9] font-bold">{room?.roomType?.name}</p>
                                        <Tag color="purple">{room?.totalRooms} Room</Tag>
                                    </div>
                                    {
                                        roomBookValues?.rooms.length === 1 ? null :
                                            <div>
                                                <DeleteOutlined
                                                    className="!text-red-500"
                                                    onClick={() => {
                                                        setModalOpen(true);
                                                        setDeleteKey(room?.roomType?.uuid)

                                                    }}
                                                />
                                            </div>
                                    }
                                </div>

                                <div className="flex">
                                    <div className="flex mr-2">
                                        <MdPeopleOutline fontSize={19} className="mt-1" />
                                        <span className="text-md ml-2 mt-1 ">
                                            {room?.adults + " x " + room?.totalRooms}
                                            <span> Room</span>
                                        </span>
                                    </div>
                                    {/* <div className="flex">
                                    <MdOutlineEscalatorWarning />
                                    <span className="text-xs ml-1">{i?.child}</span>
                                </div> */}

                                    {/* <div className="text-lg text-gray-400 mx-2">|</div> */}

                                    {/* <div className="!text-md ml-1 mt-1">{room?.extraBed} Extra Bed</div> */}
                                </div>
                            </div>

                            {/* <Divider
                                style={{
                                    margin: "3px 0"

                                }}
                            /> */}

                            {
                                room?.ratePlans?.map((rate) =>
                                    <div>
                                        <div className="flex justify-between mt-1 p-2">
                                            <div className="flex justify-between w-[40%]">
                                                <p>{rate?.name}</p>
                                                <div>
                                                    <ExclamationCircleOutlined
                                                        className="!text-[#2973e7] !text-sm cursor-pointer"
                                                        onClick={() => {
                                                            setRoomModalBoxOpen(true);
                                                            setPriceKey(room?.roomType?.uuid);
                                                            setRateKey(rate?.uuid)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <p className="font-bold">{rate?.totalPrice?.toLocaleString()} MMK</p>

                                        </div>
                                        {/* {
                                            room?.ratePlans?.length !== 1 &&
                                            <Divider
                                                style={{
                                                    margin: "3px 0"

                                                }}
                                            />
                                        } */}
                                    </div>
                                )
                            }

                            <Divider
                                style={{
                                    margin: "3px 0"

                                }}
                            />

                            <div className="flex justify-between mt-4 p-2 ">
                                <p>Incentive</p>
                                <p className="font-bold">{room?.incentiveTotal.toLocaleString()} MMK</p>
                            </div>

                            <div className="flex justify-between p-2 ">
                                <p>Tax</p>
                                <p className="font-bold">{room?.taxTotal.toLocaleString()} MMK</p>
                            </div>

                        </Card>

                    ))
                }
            </div>

            {/* Infomration  */}
            <RoomModalBox
                roomModalBoxOpen={roomModalBoxOpen}
                setRoomModalBoxOpen={setRoomModalBoxOpen}
                rateQuotes={rateQuotes}
                priceKey={priceKey}
                rateKey={rateKey}

            />

            {/* Delete */}
            <Modal
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={handleDelete}
                confirmLoading={rateQuotes?.isPending}
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

