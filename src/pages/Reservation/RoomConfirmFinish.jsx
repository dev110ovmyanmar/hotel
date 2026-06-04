import { Card, Divider, Tag } from "antd"
import { MdPeopleOutline } from "react-icons/md"


const RoomConfirmFinish = ({
    roomBookValues
}) => {
    return (
        <>
            {
                roomBookValues?.rooms?.map((i) => (
                    <Card className="!my-3" >
                        <div className="flex justify-between">
                            <p>{i?.roomType?.name}</p>
                            <Tag color="blue">{i?.totalRooms} Room</Tag>
                        </div>

                        <div className="flex">
                            <MdPeopleOutline fontSize={19} className="mt-1" />
                            <span className="text-md ml-1 mt-1">{i.adults}</span>

                            {/* <MdOutlineEscalatorWarning className="ml-3" />
                                <span className="ml-1 text-xs">{i.child}</span> */}

                            {/* <div className="text-lg text-gray-400 mx-2">|</div> */}
                            {/* <div className="!text-md ml-1 mt-1">{i.extraBed} Extra Bed</div> */}
                        </div>

                        <Divider />

                        {
                            i?.ratePlans?.map((rate) =>
                                <div className="flex justify-between py-1">
                                    <p>{rate?.name}</p>
                                    <p className="font-bold">{rate?.totalPrice?.toLocaleString()} MMK</p>
                                </div>
                            )
                        }

                        <Divider/>
                        
                        <div className="flex justify-between mt-5">
                            <p>Incentive</p>
                            <p className="font-bold">{i?.incentiveTotal.toLocaleString()} MMK</p>
                        </div>

                        <div className="flex justify-between">
                            <p>Tax</p>
                            <p className="font-bold">{i?.taxTotal.toLocaleString()} MMK</p>
                        </div>
                    </Card>
                ))
            }
        </>
    )
}

export default RoomConfirmFinish