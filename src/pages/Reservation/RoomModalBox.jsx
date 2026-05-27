import { Col, Divider, Modal, Row } from "antd"
import dayjs from "dayjs"
import React from "react"

const RoomModalBox = ({
    roomModalBoxOpen,
    setRoomModalBoxOpen,
    rateQuotes,
    priceKey,
    rateKey
}) => {
    console.log(rateKey, "rateKey")
    return (
        <Modal
            title="Pricing by Date"
            open={roomModalBoxOpen}
            onCancel={() => setRoomModalBoxOpen(false)}
            footer={null}
            width={320}
        >
            <Divider style={{ margin: "20px 0" }} />
            <Row gutter={50}>
                <Col span={12} className="!font-bold">Date</Col>
                <Col span={12} className="!font-bold text-end mb-2 ">Price (MMK)</Col>

                {
                    rateQuotes?.data?.rooms
                        ?.filter((room) => room?.roomType?.uuid === priceKey)
                        ?.flatMap((room) =>
                            room?.ratePlans
                                ?.filter((ratePlan) => ratePlan?.uuid === rateKey)
                                ?.flatMap((ratePlan) =>
                                    ratePlan?.dailyPrices?.map((price, index) => (
                                        <React.Fragment key={index}>
                                            <Col span={12}>
                                                <p>{dayjs(price?.date).format("DD MMM YYYY")}</p>
                                            </Col>

                                            <Col span={12}>
                                                <p className="text-end">{price?.price?.toLocaleString()}</p>
                                            </Col>

                                            {
                                                ratePlan?.dailyPrices?.length === 1
                                                    ? null
                                                    : <Divider style={{ margin: "4px 0" }} />
                                            }
                                        </React.Fragment>
                                    ))
                                )
                        )
                }


            </Row>
        </Modal>
    )
}

export default RoomModalBox

