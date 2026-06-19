import React, { use, useState } from 'react';
import { Modal, Form, Input, Button, Radio, Row, Col, Divider, Typography, Card, Select, Spin, Checkbox } from 'antd';
import { DoubleRightOutlined, InfoCircleOutlined, WalletOutlined } from '@ant-design/icons';
import { createRoomAmendment } from '../../../../../../api/roomAmendmentApi';
import { useApiMutation } from '../../../../../../hooks/useApiMutation';
import Toast from '../../../../../../component/Toast/Toast';
import RoomUpgradeReview from './RoomUpgradeReview';

const { Text, Title } = Typography;

export default function RoomUpgradeModal({
    isOpen,
    onClose,
    record,
    roomUpgradeUuid,
    roomList,
    availabilitySearchsPendings,
    ratePlanUuid
}) {
    const [form] = Form.useForm();
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [toReviewPage, setToReviewPage] = useState(null);
    const [selectedRoomTypeName, setSelectedRoomTypeName] = useState({});
    console.log(selectedRoomTypeName, "selectedRoomTypeName")
    const [reviewData, setReviewData] = useState(null);
    const [checkSelectedRoom, setCheckSelectedRoom] = useState(false);

    console.log(reviewData, "ReviewData")
    // API Mutation engine handling state invalidation
    const createRoomAmendmentMutation = useApiMutation({
        mutationFn: createRoomAmendment,
        invalidateKeys: [["reservation-room"]],
    });

    // Baseline property safe fallback metrics extraction
    const currentRoomType = record?.roomType?.name;

    // Handles absolute clean form execution resets
    const handleCloseReset = () => {
        form.resetFields();
        onClose(false);
        setSelectedRoom();
        setToReviewPage();
        setSelectedRoomTypeName();
        setReviewData()
    };

    console.log(record, "Record")
    // Submits data directly using single-pane architectural validation structures
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            console.log(reviewData, "ReviewData")

            const payload = {
                amendmentType: { uuid: roomUpgradeUuid },
                reservationRoom: { uuid: record?.uuid },
                room: { uuid: reviewData.roomUuid?.value },
                roomType: { uuid: reviewData?.roomType },
                ratePlan: { uuid: reviewData?.ratePlan?.value },
                rateStatus: reviewData?.rateStatus
            };

            createRoomAmendmentMutation.mutate(payload, {
                onSuccess: () => {
                    Toast.success("Room is upgraded successfully.");
                    handleCloseReset();
                    setSelectedRoom();
                    setToReviewPage();
                    setSelectedRoomTypeName();
                    setReviewData();
                },

            });
        } catch (err) {
            console.error("Form validation requirements missing:", err);
        }
    };

    console.log(selectedRoomTypeName, "selectedRoomTypeName")

    const options = roomList?.rooms?.map(room => (
        { value: room?.roomType?.uuid, label: room?.roomType?.name }
    ));

    const ratePlanOptions =
        roomList?.rooms
            ?.filter(room => room?.roomType?.uuid === selectedRoom)
            ?.flatMap(room =>
                room.ratePlans.map(ratePlan => ({
                    value: ratePlan.uuid,
                    label: ratePlan.name,
                }))
            ) || [];


    const roomUuidOptions = roomList?.rooms
        ?.filter(room => room?.roomType?.uuid === selectedRoom)
        .flatMap(room => (
            room.rooms.map(r => (
                { value: r.uuid, label: r.roomNo, rank: r.roomType.rank, }
            )
            )));

    const handleReview = async () => {
        try {
            const values = await form.validateFields();

            const selectedRoomData = roomUuidOptions.find(
                room => room.value === values.roomUuid.value
            );

            const data = {
                ...values,
                rank: selectedRoomData?.rank,
            };


            setReviewData(data);
            setToReviewPage(true);
            console.log(data, "DataINHandleReview");
        } catch (error) {
            console.log(error);
        }
    };

    console.log(reviewData, "reviewDatarateStatus")

    const backToSetFields = () => {
        setToReviewPage(false);
        form.setFieldsValue({
            rateStatus: reviewData?.rateStatus,
            ratePlan: reviewData?.ratePlan,
            roomUuid: reviewData?.roomUuid,
            roomType: reviewData?.roomType,
        });
    }

    const hasRooms = roomList?.rooms?.length > 0;

    let footerContent = null;

    if (availabilitySearchsPendings || !hasRooms) {
        footerContent = null;
    } else if (!toReviewPage) {
        footerContent = [
            <Button
                key="review"
                type="primary"
                onClick={handleReview}
                disabled={!checkSelectedRoom}
            >
                Review
            </Button>,
        ];
    } else {
        footerContent = [
            <Button
                key="backTo"
                onClick={backToSetFields}
            >
                Back To
            </Button>,
            <Button
                key="confirm"
                type="primary"
                onClick={handleSubmit}
                loading={createRoomAmendmentMutation.isPending}
            >
                Confirm
            </Button>,
        ];
    }

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '18px', background: '#1677ff', borderRadius: '2px' }} />
                    <span style={{ fontWeight: 600 }}>Room Amendment — Upgrade Room</span>
                </div>
            }
            open={isOpen}
            onCancel={handleCloseReset}
            width={500}
            destroyOnClose
            footer={footerContent}
        >
            {
                availabilitySearchsPendings ?
                    <div className='flex justify-center items-center'>
                        <Spin />

                    </div>
                    :
                    !toReviewPage ? (
                        hasRooms ? (
                            <>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    background: '#f8fafc',
                                    padding: '10px 14px',

                                    borderRadius: '6px',
                                    margin: '12px 0 20px 0',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '13px'
                                }}>
                                    <Text type="secondary"><strong style={{ color: '#475569' }}>Room Type:</strong> {currentRoomType}</Text>
                                    <Text type="secondary"><strong style={{ color: '#475569' }}>Rank :</strong> {record?.roomType?.rank}</Text>
                                    {/* <Text type="secondary"><strong style={{ color: '#475569' }}>Rate :</strong> {record?.ratePlan.name}</Text> */}
                                </div>

                                <Form
                                    form={form}
                                    layout="vertical"
                                // onFinish={onFinishValue}
                                >
                                    <Row gutter={[16, 16]}>

                                        {/* <Col span={12}> */}
                                        {/* <Row gutter={[16, 16]}> */}
                                        {roomList?.rooms?.map(room => {
                                            return (
                                                <Col span={8}>
                                                    <Card
                                                        className='!border !border-gray-200 shadow-md cursor-pointer'
                                                        // onClick={()=>}
                                                        onClick={() => {
                                                            const matchedRatePlan = room.ratePlans.find(
                                                                rp => rp.uuid === ratePlanUuid
                                                            );
                                                            console.log(room, "RoomInSearch")
                                                            setSelectedRoom(room.roomType.uuid);
                                                            setSelectedRoomTypeName(room.roomType);
                                                            setCheckSelectedRoom(true);
                                                            form.setFieldsValue({
                                                                roomType: room?.roomType?.uuid
                                                            });
                                                            if (matchedRatePlan) {
                                                                form.setFieldsValue({
                                                                    ratePlan: {
                                                                        value: matchedRatePlan.uuid,
                                                                        label: matchedRatePlan.name,
                                                                    },
                                                                });
                                                            }

                                                        }}
                                                        style={{
                                                            height: 80,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            backgroundColor:
                                                                selectedRoom === room.roomType.uuid ? "#1677ff" : "#fff",
                                                            color:
                                                                selectedRoom === room.roomType.uuid ? "#fff" : "#000",
                                                            border:
                                                                selectedRoom === room.roomType.uuid
                                                                    ? "2px solid #1677ff"
                                                                    : "1px solid #e5e7eb",
                                                        }}
                                                    >
                                                        <div className='!text-xs'>{room?.roomType?.name}</div>
                                                        <div className='!text-xs'>Rank - {room?.roomType?.rank}</div>
                                                    </Card>
                                                </Col>
                                            )
                                        })}

                                        {/* </Row> */}
                                        {/* </Col> */}
                                    </Row>

                                    <Form.Item name="roomType" hidden>
                                        <Input />
                                    </Form.Item>

                                    {
                                        selectedRoom &&
                                        // <Col span={12}>
                                        <>
                                            <Row gutter={16}>
                                                <Col span={12}>
                                                    <Form.Item
                                                        name="ratePlan"
                                                        className='!my-5'
                                                        label="Rate Plan"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "Please select a rate plan",
                                                            },
                                                        ]}

                                                    >
                                                        <Select
                                                            options={ratePlanOptions}
                                                            labelInValue
                                                        >
                                                        </Select>
                                                    </Form.Item>
                                                </Col>

                                                <Col span={12}>
                                                    <Form.Item
                                                        name="roomUuid"
                                                        className='!mt-5'
                                                        label="Rooms"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "Please select a room number",
                                                            },
                                                        ]}

                                                    >
                                                        <Select
                                                            options={roomUuidOptions}
                                                            labelInValue
                                                        >
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                            </Row>

                                            <Form.Item
                                                name="rateStatus"
                                                valuePropName="checked"
                                                labelInValue
                                                initialValue={false}
                                            >
                                                <Checkbox>
                                                    If checked, the room will be upgraded with the new price and facilities.
                                                </Checkbox>
                                            </Form.Item>
                                        </>
                                        // </Col>
                                    }
                                </Form>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <Text type="secondary">There are no rooms available to upgrade.</Text>
                            </div>
                        )
                    )
                        : (
                            <RoomUpgradeReview
                                record={record}
                                selectedRoomTypeName={selectedRoomTypeName}
                                reviewData={reviewData}
                            />
                        )


            }

        </Modal>
    )

}

