import React, { use, useState } from 'react';
import { Modal, Form, Input, Button, Radio, Row, Col, Divider, Typography, Card, Select, Spin, Checkbox } from 'antd';
import { DoubleRightOutlined, InfoCircleOutlined, WalletOutlined } from '@ant-design/icons';
import { createRoomAmendment } from '../../../../../../api/roomAmendmentApi';
import { useApiMutation } from '../../../../../../hooks/useApiMutation';
import Toast from '../../../../../../component/Toast/Toast';
import RoomDowngradeReview from './RoomDowngradeReview';
import { FaStar } from 'react-icons/fa';
import { darkModeStyle, selectedDarkMode, textWhiteInDarkStyle } from '../../../../../../utils';
import ColorStatusTag from '../../../../../../component/ColorStatusTag/ColorStatusTag';

const { Text, Title } = Typography;

export default function RoomDowngradeModal({
    isOpen,
    onClose,
    record,
    roomDowngradeUuid,
    roomList,
    availabilitySearchsPendings,
    ratePlanUuid
}) {
    const [form] = Form.useForm();
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [toReviewPage, setToReviewPage] = useState(null);
    const [selectedRoomTypeName, setSelectedRoomTypeName] = useState({});
    const [reviewData, setReviewData] = useState(null);
    const [checkSelectedRoom, setCheckSelectedRoom] = useState(false);
    const isRoomCheckIn = record?.roomStatus?.code === "checked_in";

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

    // Submits data directly using single-pane architectural validation structures
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const payload = {
                amendmentType: { uuid: roomDowngradeUuid },
                reservationRoom: { uuid: record?.uuid },
                room: { uuid: reviewData.roomUuid?.value },
                roomType: { uuid: reviewData?.roomType },
                ratePlan: { uuid: reviewData?.ratePlan?.value },
                rateStatus: reviewData?.rateStatus
            };

            createRoomAmendmentMutation.mutate(payload, {
                onSuccess: () => {
                    Toast.success("Room is downgraded successfully.");
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
                {
                    value: r.uuid,
                    label: (
                        <div className="flex flex-col justify-between">
                            <span>{r.roomNo}</span>

                            <div className='flex gap-1.5'>
                                <ColorStatusTag status={r.status} iconType="bed" />
                                <ColorStatusTag status={r.cleanStatus} iconType="broom" />
                            </div>
                        </div>
                    ),
                    roomNo: r.roomNo,
                    rank: r.roomType.rank,
                    disabled: isRoomCheckIn && (r?.cleanStatus?.code !== "clean" || r?.status?.code === "occupied")

                }
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
                roomNo: selectedRoomData?.roomNo
            };
            setReviewData(data);
            setToReviewPage(true);
        } catch (error) {
            console.log(error);
        }
    };

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
                className={
                    !checkSelectedRoom ? "text-default" : ""
                }
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
                Back
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
                    <span style={{ fontWeight: 600 }}>Room Amendment — Downgrade Room</span>
                </div>
            }
            open={isOpen}
            onCancel={handleCloseReset}
            width={500}
            destroyOnHidden
            footer={footerContent}
        >
            {
                availabilitySearchsPendings ?
                    <div className='flex justify-center items-center'>
                        <Spin />

                    </div>
                    :
                    !toReviewPage ? (
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
                            }}
                                className={darkModeStyle}
                            >
                                <Text ><strong >Room Type:</strong> <span className={textWhiteInDarkStyle}>{currentRoomType}</span></Text>
                                {/* <Text type="secondary"><strong style={{ color: '#475569' }}>Rank :</strong> {record?.roomType?.rank}</Text> */}

                                <div className="grid place-items-center w-fit -mt-1">
                                    <FaStar className='text-amber-200  text-3xl col-start-1 row-start-1' />
                                    <div className="col-start-1 row-start-1 text-gray-900 font-bold text-xs mt-1">
                                        {record?.roomType?.rank}
                                    </div>
                                </div>

                            </div>

                            {
                                hasRooms ? (
                                    <Form
                                        form={form}
                                        layout="vertical"
                                    >
                                        <Row gutter={[16, 16]}>


                                            {roomList?.rooms
                                                ?.filter(room => room?.rooms?.length > 0)
                                                ?.map(room => {
                                                    return (
                                                        <Col span={12}>
                                                            <div
                                                                className={`  
                                                                flex
                                                                justify-between
                                                                p-4                                                          
                                                                cursor-pointer 
                                                                shadow-md 
                                                                transition-all 
                                                                !border-2 
                                                                !duration-500
                                                                rounded-2xl 
                                                                ${selectedRoom === room.roomType.uuid
                                                                        ? `!border-blue-400/20 !bg-blue-500/15 backdrop-blur-lg !shadow-lg ${selectedDarkMode}`
                                                                        : '!border-blue-200 !shadow-md hover:!border-blue-500/30 hover:-translate-y-1'}
                                                                `}
                                                                onClick={() => {
                                                                    const matchedRatePlan = room.ratePlans.find(
                                                                        rp => rp.uuid === ratePlanUuid
                                                                    );
                                                                    setSelectedRoom(room.roomType.uuid);
                                                                    setSelectedRoomTypeName(room.roomType);
                                                                    setCheckSelectedRoom(true);
                                                                    form.resetFields(["roomUuid"]);
                                                                    form.setFieldsValue({
                                                                        roomUuid: undefined
                                                                    });
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
                                                                    };
                                                                }}


                                                            >
                                                                <div className="!text-xs">
                                                                    {room?.roomType?.name}
                                                                </div>

                                                                <div className="grid place-items-center w-fit -mt-2">
                                                                    <FaStar className={
                                                                        `
                                                                ${selectedRoom === room.roomType.uuid ? "text-amber-500" : "text-amber-200 "
                                                                        }
                                                                text-3xl 
                                                                col-start-1 
                                                                row-start-1
                                                                                                                                                                                                                                `
                                                                    } />
                                                                    <div className="col-start-1 row-start-1 text-gray-900 font-bold text-xs mt-1 ml-1 mr-1">
                                                                        {room?.roomType?.rank}
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </Col>
                                                    )
                                                })}

                                        </Row>

                                        <Form.Item name="roomType" hidden>
                                            <Input />
                                        </Form.Item>

                                        {
                                            selectedRoom &&
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
                                                                showSearch
                                                                optionFilterProp="label"
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
                                                                showSearch
                                                                filterOption={(input, option) => {
                                                                    return (
                                                                        String(option?.roomNo ?? "")
                                                                            .toLowerCase()
                                                                            .includes(input.toLowerCase())
                                                                    )
                                                                }
                                                                }
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
                                                        Override Room Rate
                                                    </Checkbox>
                                                </Form.Item>
                                            </>
                                        }
                                    </Form>
                                ) :

                                    <div className="text-center py-8">
                                        <Text type="secondary">There are no rooms available to downgrade.</Text>
                                    </div>
                            }


                        </>

                    )
                        : (
                            <RoomDowngradeReview
                                record={record}
                                selectedRoomTypeName={selectedRoomTypeName}
                                reviewData={reviewData}
                            />
                        )


            }

        </Modal>
    )

}

