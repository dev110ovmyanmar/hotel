import { Button, Card, Col, Form, Input, Row } from "antd";
import { AiOutlineCreditCard, AiOutlineDollarCircle, AiOutlineRight } from "react-icons/ai";
import { LuBedDouble } from "react-icons/lu";
import { SlCup } from "react-icons/sl";

const NightAuditPosting = ({
    nightAuditPostingClick
}) => {

    const cardTitle = "inline mr-2 !text-xl";

    return (
        <>
            <Row gutter={16}>
                {/* Room and Stay Charges  */}
                <Col span={12}>
                    <Card
                        title={
                            <div>
                                <LuBedDouble className={cardTitle} />
                                <span>Room & Stay Charges</span>
                            </div>
                        }
                    >
                        <Form
                            layout="vertical"
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Room Charge"
                                        name="roomCharge"
                                    >
                                        <Input suffix="MMK" />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        label="Extra Bed"
                                        name="extraBed"
                                    >
                                        <Input suffix="MMK" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Cancellation"
                                        name="cancellation"
                                    >
                                        <Input suffix="MMK" />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        label="No Show Charge"
                                        name="noShowCharge"
                                    >
                                        <Input suffix="MMK" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Col>

                {/* Food and Beverage */}
                <Col span={12}>
                    <Card
                        title={
                            <div>
                                <SlCup  className={cardTitle} />
                                <span>Food & Beverage</span>
                            </div>
                        }
                    >
                        <Form
                            layout="vertical"
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Breakfast"
                                        name="breakfast"
                                    >
                                        <Input suffix="MMK" />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        label="Breakfast Extra"
                                        name="breakfastExtra"
                                    >
                                        <Input suffix="MMK" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Breakfast Child"
                                        name="breakfastChild"
                                    >
                                        <Input suffix="MMK" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Col>
            </Row>

            <Row gutter={16} className="!my-5">
                {/* Service Charges  */}
                <Col span={12}>
                    <Card
                        title={
                            <div>
                                <AiOutlineDollarCircle className={cardTitle} />
                                <span>Service Charges</span>
                            </div>
                        }
                    >
                        <Form
                            layout="vertical"
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Room Service"
                                        name="roomService"
                                    >
                                        <Input suffix="MMK" />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        label="Other Service"
                                        name="otherService"
                                    >
                                        <Input suffix="MMK" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Mini Bar"
                                        name="miniBar"
                                    >
                                        <Input suffix="MMK" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Col>

                {/* Payments */}
                <Col span={12}>
                    <Card
                        title={
                            <div>
                                <AiOutlineCreditCard className={cardTitle} />
                                <span>Payments</span>
                            </div>
                        }
                    >
                        <Form
                            layout="vertical"
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Cash(CO/HF)"
                                        name="cashCoHf"
                                    >
                                        <Input suffix="MMK" />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item
                                        label="Deposit(CO/HF)"
                                        name="depositCoHF"
                                    >
                                        <Input suffix="MMK" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="MMQR Pay"
                                        name="mmqrPay"
                                    >
                                        <Input suffix="MMK" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Col>
            </Row>

            <div
                className="flex justify-end"
            >
                <Button type="primary" onClick={nightAuditPostingClick}>
                    Next Step
                    <AiOutlineRight />
                </Button>
            </div>
        </>


    )
}

export default NightAuditPosting;