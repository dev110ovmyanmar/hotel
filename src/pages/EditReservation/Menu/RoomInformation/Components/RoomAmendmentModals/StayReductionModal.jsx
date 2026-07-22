import React, { useState } from 'react';
import { Modal, Form, Input, Descriptions, Button, Divider, Space } from 'antd';
import dayjs from 'dayjs';
import { ArrowRightOutlined, CheckCircleOutlined, PlusOutlined, MinusOutlined, WarningOutlined } from '@ant-design/icons';
import { createRoomAmendment } from '../../../../../../api/roomAmendmentApi';
import { useApiMutation } from '../../../../../../hooks/useApiMutation';
import Toast from '../../../../../../component/Toast/Toast';
import { borderDarkMode, darkModeStyle, textColorDarkMode, textWhiteInDarkStyle } from '../../../../../../utils';

export default function StayReductionModal({
    isOpen,
    onClose,
    record,
    stayReductionUuid
}) {
    const [form] = Form.useForm();

    const createRoomAmendmentMutation = useApiMutation({
        mutationFn: createRoomAmendment,
        invalidateKeys: [["reservation-room"]],
    });

    // States for step navigation and submission
    const [currentStep, setCurrentStep] = useState('form');
    const [daysToSubtract, setDaysToSubtract] = useState(1);
    const [pendingValues, setPendingValues] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Parse baseline properties out of your JSON structure
    const reservationNo = record?.reservation?.reservationNo || `ID-${record?.id}`;
    const guestName = record?.reservation?.guest?.name || "Unknown Guest";

    const originalCheckin = record?.checkinDate ? dayjs(record.checkinDate) : "";
    const originalCheckout = record?.checkoutDate ? dayjs(record.checkoutDate) : "";

    // Safely parse maxReduction to a number (fallback to 0 if undefined)
    const maxReduction = record?.maxReduce !== undefined ? Number(record.maxReduce) : 0;

    // Compute live mathematical timeline subtractions safely
    const newCheckoutDate = originalCheckout.isValid() ? originalCheckout.subtract(daysToSubtract, 'day') : dayjs();

    // Step 1: Force field validation before pushing to screen state matrix
    const handleProceedToSummary = async () => {
        try {
            const values = await form.validateFields();
            setPendingValues(values);
            setCurrentStep('summary');
        } catch (err) {
            console.error("Form metrics validation failed:", err);
        }
    };

    // Step 2: Fire backend server mutations
    const handleFinalCommit = async () => {
        setIsSubmitting(true);
        const checkinDate = record?.checkinDate ? record.checkinDate.split(" ")[0] : originalCheckin.format('YYYY-MM-DD');
        try {
            const payload = {
                amendmentType: { uuid: stayReductionUuid },
                reservationRoom: { uuid: record?.uuid },
                checkinDate: checkinDate,
                checkoutDate: newCheckoutDate.format('YYYY-MM-DD'),
                reason: pendingValues?.reason
            };

            createRoomAmendmentMutation.mutate(payload, {
                onSuccess: async () => {
                    Toast.success("Stay Shortened Successfully");
                    handleCloseReset();
                },
                onError: (error) => {
                    console.error("API error executing stay reduction:", error);
                    Toast.error("Failed to shorten stay.");
                },
                onSettled: () => {
                    setIsSubmitting(false);
                }
            });
        } catch (error) {
            console.error("Unexpected error executing stay reduction:", error);
            setIsSubmitting(false);
        }
    };

    const handleCloseReset = () => {
        form.resetFields();
        setDaysToSubtract(1);
        setCurrentStep('form');
        setPendingValues(null);
        onClose();
    };

    return (
        <Modal
            title={
                currentStep === 'form'
                    ? "Shorten Guest Stay Duration"
                    : <span className="flex items-center gap-2"><CheckCircleOutlined className="text-amber-500" /> Review Stay Reduction Summary</span>
            }
            open={isOpen}
            onCancel={handleCloseReset}
            width={currentStep === 'form' ? 520 : 650}
            footer={
                currentStep === 'form' ? [
                    <Button key="back" onClick={handleCloseReset}>Cancel</Button>,
                    <Button
                        key="submit"
                        type="primary"
                        danger
                        onClick={handleProceedToSummary}
                        disabled={maxReduction <= 0} // Blocks moving forward if reduction limit is 0
                    >
                        Review Summary
                    </Button>
                ] : [
                    <Button key="back-to-form" disabled={isSubmitting} onClick={() => setCurrentStep('form')}>Modify Reduction</Button>,
                    <Button key="confirm" type="primary" danger loading={isSubmitting} onClick={handleFinalCommit}>Confirm Reduction</Button>
                ]
            }
        >
            {/* Context Target Ribbon Header */}
            <div className="mb-4 text-slate-500 text-sm font-medium">
                {reservationNo} — <span className={`text-slate-800 ${textWhiteInDarkStyle}`}>{guestName}</span>
            </div>

            <Divider className="my-3" />

            {/* --- STEP 1: INCREMENTOR INTERFACE --- */}
            {currentStep === 'form' && (
                <Form form={form} layout="vertical">

                    {/* HIGHLIGHT WARNING BANNER: Visible only when maxReduction is zero */}
                    {maxReduction === 0 ? (
                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-5 flex gap-3 items-start">
                            <WarningOutlined className="text-red-500 text-base mt-0.5" />
                            <div>
                                <div className="font-semibold text-red-600 text-sm mb-0.5">
                                    Reduction Limit Reached (0 Days Allowed)
                                </div>
                                <div className="text-xs text-neutral-500 leading-relaxed">
                                    This stay cannot be shortened further because the maximum reduction allocation for this room is currently zero. This occurs when the reservation is already at its minimum required length of stay or checking out early is restricted.
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Standard Interactive Decrementer
                        <div className={`bg-slate-50 p-4 rounded-lg mb-5 ${darkModeStyle}`}>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium">
                                    Reduce Stay Duration By
                                </label>
                                {/* MAX REDUCTION BADGE */}
                                <span className="bg-amber-50 text-amber-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-100">
                                    Max Reduction: {maxReduction} Day(s)
                                </span>
                            </div>

                            <Space size="middle" className="flex items-center">
                                <Button
                                    shape="circle"
                                    icon={<MinusOutlined />}
                                    onClick={() => setDaysToSubtract(prev => Math.max(1, prev - 1))}
                                    disabled={daysToSubtract <= 1}
                                />
                                <span className="text-xl font-bold min-w-[30px] text-center inline-block">
                                    {daysToSubtract}
                                </span>

                                <Button
                                    shape="circle"
                                    icon={<PlusOutlined />}
                                    onClick={() => setDaysToSubtract(prev => prev + 1)}
                                    disabled={daysToSubtract >= maxReduction}
                                />
                                <span className="text-sm text-slate-500 font-medium">
                                    Day(s) Less
                                </span>
                            </Space>
                        </div>
                    )}

                    {/* Timeline Data Footer */}
                    <div className={`bg-slate-50 p-3 px-4 rounded-lg mb-5 border border-slate-200 ${darkModeStyle} ${borderDarkMode}`}>
                        <div className="text-xs ">
                            Current Checkout - <strong >{originalCheckout.isValid() ? originalCheckout.format('DD MMM YYYY') : '-'}</strong>
                        </div>
                        {maxReduction !== 0 && (
                            <div className="text-sm text-red-600 mt-1">
                                New Checkout - <strong className="text-red-700">{newCheckoutDate.isValid() ? newCheckoutDate.format('DD MMM YYYY') : '-'}</strong>
                            </div>
                        )}
                    </div>

                    <Form.Item
                        name="reason"
                        label="Reason for Stay Reduction"
                    >
                        <Input.TextArea
                            placeholder={maxReduction === 0 ? "Stay reduction is currently unavailable." : "Provide business justification for early checkout / stay reduction..."}
                            rows={3}
                            disabled={maxReduction === 0}
                        />
                    </Form.Item>
                </Form>
            )}

            {/* --- STEP 2: METRIC COMPARISON SUMMARY --- */}
            {currentStep === 'summary' && pendingValues && (
                <div className="animate-fadeIn">
                    <Descriptions title="" bordered column={1} size="small">
                        <Descriptions.Item label="Checkout Changes">
                            <span className="text-slate-400 line-through">
                                {originalCheckout.isValid() ? originalCheckout.format('DD MMM YYYY') : '-'}
                            </span>
                            <ArrowRightOutlined className="mx-2.5 text-red-500" />
                            <strong className={`text-slate-800 ${textColorDarkMode}`}>
                                {newCheckoutDate.isValid() ? newCheckoutDate.format('DD MMM YYYY') : '-'}
                            </strong>
                        </Descriptions.Item>

                        <Descriptions.Item label="Reduced Days">
                            <span className="text-sm ml-2.5 text-red-500 font-medium">
                                -{daysToSubtract} Day(s)
                            </span>
                        </Descriptions.Item>

                        <Descriptions.Item label="Reason">
                            <span className="text-slate-600">
                                {pendingValues?.reason}
                            </span>
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            )}
        </Modal>
    );
}