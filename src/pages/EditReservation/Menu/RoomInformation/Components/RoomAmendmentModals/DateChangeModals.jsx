import React, { useState } from 'react';
import { Modal, DatePicker, Form, Input, Descriptions, Badge, Button, Divider, Tag, Row, Col } from 'antd';
import dayjs from 'dayjs';
import { ArrowRightOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { textColorDarkMode, textWhiteInDarkStyle } from '../../../../../../utils';
import { createRoomAmendment, dateChangeCheck } from '../../../../../../api/roomAmendmentApi';
import { useApiMutation } from '../../../../../../hooks/useApiMutation';
import Toast from '../../../../../../component/Toast/Toast';

export default function DateChangeModal({
    isOpen,
    onClose,
    record,
    dateChangeUuid
}) {
    const { RangePicker } = DatePicker;
    const [form] = Form.useForm();

    const currentCheckInDate = dayjs(record?.checkinDate).format("DD-MM-YYYY");
    const currentCheckOutDate = dayjs(record?.checkoutDate).format("DD-MM-YYYY");
    const watchDates = Form.useWatch("dates", form);
    const watchCheckInDate = watchDates?.[0];
    const watchCheckOutDate = watchDates?.[1];

    const formatWatchCheckInDate = watchCheckInDate?.format("DD-MM-YYYY");
    const formatWatchCheckOutDate = watchCheckOutDate?.format("DD-MM-YYYY");

    const compareCurrentAndWatchDate = (currentCheckInDate === formatWatchCheckInDate) && (currentCheckOutDate === formatWatchCheckOutDate);

    const [isDateCheckAvailable, setIsDateCheckAvailable] = useState(null);
    const [showSameDateMessage, setShowSameDateMessage] = useState(false);

    const checkDateChangeAvailable = useApiMutation({
        mutationFn: dateChangeCheck,
        invalidateKeys: [["date-change-check"]],
    });

    const createRoomAmendmentMutation = useApiMutation({
        mutationFn: createRoomAmendment,
        invalidateKeys: [["reservation-room"]],
    });

    const handleCheck = () => {
        setIsDateCheckAvailable(null);

        if (compareCurrentAndWatchDate) {
            setShowSameDateMessage(true);
            return;
        }

        setShowSameDateMessage(false);

        const formatCheckInDate = watchCheckInDate.format("YYYY-MM-DD");
        const formatCheckOutDate = watchCheckOutDate.format("YYYY-MM-DD");

        const payload = {
            checkinDate: formatCheckInDate,
            checkoutDate: formatCheckOutDate,
            reservationRoom: {
                uuid: record?.uuid
            }
        }

        checkDateChangeAvailable.mutate(payload, {
            onSuccess: (data) => {
                console.log(data?.isAvailable, "isAvailable");
                setIsDateCheckAvailable(data?.isAvailable === true);

            }
        })
    }
    console.log(isDateCheckAvailable, "isDateCheckAvailable")

    const handleSubmitConfirm = async () => {
        try {
            const values = await form.validateFields();
            console.log(values, "handleSubmitConfirmvalues");
            // amendmentType: { uuid: extraBedAmendmentUuid },
            const formatCheckInDate = values?.dates?.[0].format("YYYY-MM-DD");
            const formatCheckOutDate = values?.dates?.[1].format("YYYY-MM-DD");
            const payload = {
                checkinDate: formatCheckInDate,
                checkoutDate: formatCheckOutDate,
                amendmentType: {
                    uuid: dateChangeUuid
                },
                reservationRoom: {
                    uuid: record?.uuid
                }

            };
            createRoomAmendmentMutation.mutate(payload, {
                onSuccess: () => {
                    onClose(false);
                    Toast.success("Changed Date Successfully.")
                }
            })
        }
        catch (error) {
            console.log(error, "error")
        }
    }

    // Control screen state: 'form' or 'summary'
    const [currentStep, setCurrentStep] = useState('form');
    const [pendingValues, setPendingValues] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Deep parsing row record metadata structures
    const reservationNo = record?.reservation?.reservationNo || `ID-${record?.id}`;
    const roomName = record?.room ? record?.room?.roomNo : null;

    // Original Values parsed safely into dayjs instances
    const originalCheckin = record?.checkinDate ? dayjs(record.checkinDate) : dayjs();
    const originalCheckout = record?.checkoutDate ? dayjs(record.checkoutDate) : dayjs();
    const originalReason = record?.reservation?.reason;

    // Fallback calculation directly uses the item's baseline night state
    const originalNights = record?.totalNight ?? originalCheckout.diff(originalCheckin, 'day');

    // Step 1: Validate form entry and generate the summary preview
    const handleProceedToSummary = async () => {
        try {
            const values = await form.validateFields();
            setPendingValues(values);
            setCurrentStep('summary');
        } catch (err) {
            console.error("Validation failed:", err);
        }
    };

    // Step 2: Final API Save Execution
    const handleFinalCommit = async () => {
        setIsSubmitting(true);
        try {
            // Structuring final API request body values
            const payload = {
                room_uuid: record?.uuid,
                reservation_uuid: record?.reservation?.uuid,
                checkin_date: pendingValues.checkin.format('YYYY-MM-DD'),
                checkout_date: pendingValues.checkout.format('YYYY-MM-DD'),
                reason: pendingValues.reason
            };

            // Clean up states and exit
            handleCloseReset();
        } catch (error) {
            console.error("API error applying changes:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseReset = () => {
        form.resetFields();
        setCurrentStep('form');
        setPendingValues(null);
        setIsDateCheckAvailable(null);
        setShowSameDateMessage(false);
        onClose();
    };

    // Calculate new stats if values exist
    const newNights = pendingValues
        ? pendingValues.checkout.diff(pendingValues.checkin, 'day')
        : 0;

    const currentStayDate = 'flex !text-xs border-2 border-blue-300 shadow-md rounded p-2';
    return (
        <Modal
            // title={
            //     currentStep === 'form'
            //         ?
            //         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            //             <div style={{ width: '4px', height: '18px', background: '#1677ff', borderRadius: '2px' }} />
            //             <span style={{ fontWeight: 600 }}>Modify Stay Schedules</span>
            //         </div>
            //         :
            //         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            //             <div style={{ width: '4px', height: '18px', background: '#1677ff', borderRadius: '2px' }} />
            //             <span style={{ fontWeight: 600 }}>Review Summary of Changes</span>
            //         </div>
            //     // <span><CheckCircleOutlined style={{ color: '#52c41a' }} /> Review Summary of Changes</span>
            // }
            title={
                <div className="flex items-center gap-2">
                    <div className="h-[18px] w-1 rounded-sm bg-[#1677ff]" />
                    <span className="font-semibold">
                        {currentStep === "form" ? "Modify Stay Schedules" : "Review Summary of Changes"}
                    </span>
                </div>
            }
            open={isOpen}
            onCancel={handleCloseReset}
            destroyOnClose
            width={currentStep === 'form' ? 520 : 650}
            // footer={
            //     currentStep === 'form' ? [
            //         <Button key="back" onClick={handleCloseReset}>Cancel</Button>,
            //         <Button key="submit" type="primary" onClick={handleProceedToSummary}>Review Changes</Button>
            //     ] : [
            //         <Button key="back-to-form" disabled={isSubmitting} onClick={() => setCurrentStep('form')}>Modify Selection</Button>,
            //         <Button key="confirm" type="primary" loading={isSubmitting} onClick={handleFinalCommit}>Confirm & Save Changes</Button>
            //     ]
            // }
            footer={
                <>
                    <Button key="back" onClick={handleCloseReset}>Cancel</Button>
                    <Button
                        htmlType="submit"
                        type="primary"
                        disabled={!isDateCheckAvailable}
                        onClick={handleSubmitConfirm}
                        loading={createRoomAmendmentMutation?.isPending}

                    >
                        Confirm
                    </Button>
                </>
            }
        >
            {/* Context header string linked to your JSON payload structure */}
            <div className="text-indigo-700 dark:text-indigo-500 font-semibold">
                {reservationNo}  <span className={`text-slate-800 ${textWhiteInDarkStyle}`}> {roomName ? `- ${roomName}` : null}</span>
            </div>

            <Divider style={{ margin: '12px 0' }} />

            {/* --- STEP 1: DURATION SELECTION FORM --- */}
            {/* {currentStep === 'form' && ( */}
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    currentDates: [
                        dayjs(currentCheckInDate, "DD-MM-YYYY"),
                        dayjs(currentCheckOutDate, "DD-MM-YYYY")
                    ],
                }}
            >
                <Row className='!mb-2' gutter={8}>
                    <Col span={19}>
                        <Form.Item
                            name="currentDates"
                            label="Current Check-In/Out Date"
                            className='!m-0 '
                        >
                            <RangePicker className='!w-full' disabled format="YYYY-MM-DD" />
                        </Form.Item>
                    </Col>
                </Row>


                {/* <div className='grid grid-cols-2 gap-x-3'> */}
                {/* <Form.Item
                        name={["dates", "checkin"]}
                        label="New Check-In Date"
                        rules={[{ required: true, message: 'Select check-in' }]}>
                        <DatePicker
                            format="DD-MM-YYYY"
                            disabledDate={(current) => {
                                return current && current.isBefore(dayjs(), "day");
                            }}
                            onChange={(date) => {
                                const checkout = form.getFieldValue(["dates", "checkout"]);

                                // If existing checkout is invalid, clear it
                                if (
                                    date &&
                                    checkout &&
                                    !checkout.isAfter(date, "day")
                                ) {
                                    form.setFieldValue(["dates", "checkout"], null);
                                }

                                // Revalidate checkout
                                form.validateFields([["dates", "checkout"]]);
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name={["dates", "checkout"]}
                        label="New Check-Out Date"
                        rules={[{ required: true, message: 'Select check-out' }]}>
                        <DatePicker
                            format="DD-MM-YYYY"
                            disabledDate={(current) => {
                                const checkin = form.getFieldValue(["dates", "checkin"]);

                                if (!checkin) {
                                    return current && current.isBefore(dayjs(), "day");
                                }

                                return current && current.isBefore(checkin.add(1, "day"), "day");
                            }}
                        />
                    </Form.Item> */}




                {/* </div> */}

                <Row gutter={8}>
                    <Col span={19}>
                        <Form.Item
                            label="New Check-In/Out Date"
                            name="dates"
                            rules={[{ required: true, message: 'Select check-in / check-out' }]}

                        >
                            <RangePicker
                                className='!w-full'
                                disabledDate={(current, info) => {
                                    const today = dayjs().startOf("day");

                                    if (current.isBefore(today, "day")) {
                                        return true;
                                    }

                                    if (
                                        info.from &&
                                        current.isSame(info.from, "day")
                                    ) {
                                        return true;
                                    }

                                    return false;
                                }}
                                onCalendarChange={(dates) => {
                                    setShowSameDateMessage(false);
                                    setIsDateCheckAvailable(null);
                                }}
                            >

                            </RangePicker>
                        </Form.Item>


                    </Col>

                    <Col span={5}>
                        <Form.Item
                            label=" "

                        >
                            <Button
                                className='!w-full'
                                type='primary'
                                onClick={handleCheck}
                                loading={checkDateChangeAvailable?.isPending}
                                disabled={!(watchCheckInDate && watchCheckOutDate)}
                            >
                                Check
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>

                {
                    showSameDateMessage
                        ?
                        <div className={`flex justify-between border-2 border-red-300 rounded p-2 shadow-md !backdrop-blur-md !mb-6 !-mt-3`}>
                            <div className='text-red-500 !text-xs'>The selected date is the same as the current date. Please select another date.</div>
                        </div>
                        :
                        null
                }


                {
                    isDateCheckAvailable !== null &&
                    watchCheckInDate &&
                    watchCheckOutDate &&
                    <div className={`flex justify-between border-2 rounded p-2 shadow-lg !backdrop-blur-md !mb-6 !-mt-3 ${isDateCheckAvailable === true ? 'border-green-300 ' : 'border-red-300'}`}>
                        <div className='flex gap-2 !font-bold'>
                            <div>{watchCheckInDate?.format("DD MMM YYYY")}</div>
                            <div>-</div>
                            <div>{`${watchCheckOutDate?.format("DD MMM YYYY")}`}</div>
                        </div>

                        <Tag color={isDateCheckAvailable ? "green" : "red"}
                            style={{
                                color: isDateCheckAvailable === true ? "#389E0D" : "#CF1322",
                                backgroundColor: isDateCheckAvailable === true ? "#F6FFED" : "#FFF1F0",
                                borderColor: isDateCheckAvailable === true ? "#B7EB8F" : "#FFA39E",
                                borderRadius: "5px"
                            }}
                        >
                            {isDateCheckAvailable === true ? "Available" : "Unavailable"}
                        </Tag>
                    </div>
                }

                {/* <Form.Item name="reason" label="Reason For Schedule Disruption"
                    rules={[{ required: true, message: 'Please provide an audit trail reason.' }]}
                    >
                        <Input.TextArea placeholder="Provide detailed explanation for tracking logs..." rows={3} />
                    </Form.Item> */}
            </Form>
            {/* )} */}

            {/* --- STEP 2: METRIC COMPARISON SUMMARY --- */}
            {
                currentStep === 'summary' && pendingValues && (
                    <div className="summary-container" style={{ animation: 'fadeIn 0.2s ease-in-out' }}>
                        <p className="text-[#5f6c7f] dark:text-gray-400 mb-5">
                            Please confirm the adjustments below before applying changes to the dynamic room ledger grid.
                        </p>

                        <Descriptions title="Timeline Matrix Adjustments" bordered column={1} size="small">
                            <Descriptions.Item label="Check-In Window">
                                <span style={{ color: '#94a3b8', textDecoration: 'line-through' }}>
                                    {originalCheckin.format('DD MMM YYYY')}
                                </span>
                                <ArrowRightOutlined style={{ margin: '0 10px', color: '#1677ff' }} />
                                <strong style={{ color: '#1e293b' }} className={textColorDarkMode}>
                                    {pendingValues.checkin.format('DD MMM YYYY')}
                                </strong>
                            </Descriptions.Item>

                            <Descriptions.Item label="Check-Out Window">
                                <span style={{ color: '#94a3b8', textDecoration: 'line-through' }}>
                                    {originalCheckout.format('DD MMM YYYY')}
                                </span>
                                <ArrowRightOutlined style={{ margin: '0 10px', color: '#1677ff' }} />
                                <strong style={{ color: '#1e293b' }} className={textColorDarkMode}>
                                    {pendingValues.checkout.format('DD MMM YYYY')}
                                </strong>
                            </Descriptions.Item>

                            <Descriptions.Item label="Total Night Allocations">
                                <Badge count={`${originalNights} Nights`} color="#94a3b8" />
                                <ArrowRightOutlined style={{ margin: '0 10px', color: '#1677ff' }} />
                                <Badge
                                    count={`${newNights} Nights`}
                                    color={newNights !== originalNights ? "#edf2f7" : "#cbd5e1"}
                                    style={{
                                        color: newNights > originalNights ? '#52c41a' : newNights < originalNights ? '#f5222d' : '#1e293b',
                                        fontWeight: 'bold'
                                    }}
                                />
                                {/* <span style={{ fontSize: '12px', marginLeft: '10px', color: '#64748b' }}> */}
                                <span className="text-xs ml-5 text-[#64748b] dark:text-gray-300">
                                    ({newNights - originalNights >= 0 ? `+${newNights - originalNights}` : `${newNights - originalNights}`} Nights variance)
                                </span>
                            </Descriptions.Item>

                            <Descriptions.Item label="Audit System Notes">
                                <span style={{ fontStyle: 'italic', color: '#475569' }}>
                                    "{pendingValues.reason}"
                                </span>
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                )
            }
        </Modal >
    );
}