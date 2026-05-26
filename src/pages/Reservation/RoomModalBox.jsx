import { Col, Divider, Modal, Row } from "antd"
import dayjs from "dayjs"

const RoomModalBox = ({
    roomModalBoxOpen,
    setRoomModalBoxOpen
}) => {
    const price = 150000;
    return (
        <Modal title="Pricing by Date"
            open={roomModalBoxOpen}
            onCancel={() => setRoomModalBoxOpen(false)}
            footer={null}
        >
            <Divider />
            <Row>
                <Col span={12}>
                    Date
                    <p>{dayjs().format("DD-MM-YYYY")}</p>
                </Col>
                <Col span={12}>
                    Price
                    <p>{price.toLocaleString()}</p>
                </Col>
            </Row>
        </Modal>
    )
}

export default RoomModalBox