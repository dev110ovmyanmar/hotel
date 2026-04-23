import { ArrowRightOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Drawer, Modal, Tag } from "antd";
import { useState } from "react";
import { MdOutlineEscalatorWarning, MdPeopleOutline } from "react-icons/md";


const RoomBookedDrawer = ({
    roomBookOpen,
    setRoomBookOpen,
    roomConfirm,
    setRoomConfirm,
    selectedData,
    setSelectedData
}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteKey, setDeleteKey] = useState();

    const roomConfirmClick = () => {
        setRoomConfirm(true);
        setRoomBookOpen(false);
    };

    const handleDelete = (one, two) => {
        setSelectedData((prev) => {
            return (prev.filter(item => item.key !== deleteKey))
        });

        setModalOpen(false);
        setRoomBookOpen(false);
    }

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
                    <span className="!text-md !font-bold">500,000 MMK</span>
                </div>
            }

        >
            <div className="flex justify-between">
                <div>
                    <p>Check In Date</p>
                    <p>22/02/2026</p>
                </div>

                <div>
                    <ArrowRightOutlined />
                </div>

                <div>
                    <p>Check In Date</p>
                    <p>22/02/2026</p>
                </div>

            </div>

            <Divider />

            <p className="font-bold mb-2">Room Information</p>

            <div className="!space-y-3">
                {
                    selectedData?.map((i) => (
                        <Card key={i?.key} className="!shadow-xl">
                            <div className="flex justify-between">
                                <div className="flex">
                                    <p className="mr-3">{i?.roomType}</p>
                                    <Tag color="blue">{i?.room} Room</Tag>
                                </div>
                                <div>
                                    <DeleteOutlined className="!text-red-500" onClick={() => {
                                        setModalOpen(true),
                                            setDeleteKey(i?.key)
                                    }}
                                    />
                                </div>
                            </div>

                            <div className="flex">
                                <div className="flex mr-3">
                                    <MdPeopleOutline />
                                    <span className="text-xs ml-1">{i?.adult}</span>
                                </div>
                                <div className="flex">
                                    <MdOutlineEscalatorWarning />
                                    <span className="text-xs ml-1">{i?.child}</span>
                                </div>

                                <div className="text-xs text-gray-400 mx-2">|</div>

                                <div>{i?.extraBed}Extra Bed</div>
                            </div>

                            <Divider />

                            <div className="flex justify-between">
                                <p>{i?.rateAndPrices[1]}</p>
                                <p className="font-bold">{i?.rateAndPrices[0]}</p>
                            </div>
                        </Card>
                    ))
                }
            </div>


            <Modal
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={handleDelete}
            >
                Are you sure you want to delete ?
            </Modal>
        </Drawer>
    );
};

export default RoomBookedDrawer;

