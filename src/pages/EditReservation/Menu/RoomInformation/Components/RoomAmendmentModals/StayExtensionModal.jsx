import React, { useState } from 'react';
import { Modal, Form, Input, Descriptions, Button, Divider, Space } from 'antd';
import dayjs from 'dayjs';
import { ArrowRightOutlined, CheckCircleOutlined, PlusOutlined, MinusOutlined, WarningOutlined } from '@ant-design/icons';
import { createRoomAmendment } from '../../../../../../api/roomAmendmentApi';
import { useApiMutation } from '../../../../../../hooks/useApiMutation';
import Toast from '../../../../../../component/Toast/Toast';
import { borderDarkMode, darkModeStyle, textColorDarkMode, textWhiteInDarkStyle } from '../../../../../../utils';

export default function StayExtensionModal({
    isOpen,
    onClose,
    record,
    stayExtensionUuid
}) {
    const [form] = Form.useForm();

    const createRoomAmendmentMutation = useApiMutation({
        mutationFn: createRoomAmendment,
        invalidateKeys: [["reservation-room"]],
    });

    // States for step navigation and submission
    const [currentStep, setCurrentStep] = useState('form');
    const [daysToAdd, setDaysToAdd] = useState(1);
    const [pendingValues, setPendingValues] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Parse baseline properties out of your JSON structure
    const reservationNo = record?.reservation?.reservationNo || `ID-${record?.id}`;
    const roomNo = record?.room?.roomNo;

    const originalCheckin = record?.checkinDate ? dayjs(record?.checkinDate) : null;
    const originalCheckout = record?.checkoutDate ? dayjs(record?.checkoutDate) : null;
    // Safely parse maxDayExtension to a number (fallback to 0 if undefined)
    const maxDayExtension = record?.maxExtend !== undefined ? Number(record.maxExtend) : 0;

    // Compute live mathematical timeline additions safely
    const newCheckoutDate = originalCheckout?.isValid() ? originalCheckout?.add(daysToAdd, 'day') : "-";

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
        const checkinDate = record?.checkinDate ? record?.checkinDate.split(" ")[0] : originalCheckin?.format('YYYY-MM-DD');
        const checkoutDate = record?.checkoutDate ? record?.checkoutDate.split(" ")[0] : originalCheckout?.format('YYYY-MM-DD');

        try {
            const payload = {
                amendmentType: { uuid: stayExtensionUuid },
                reservationRoom: { uuid: record?.uuid },
                checkinDate: checkoutDate,
                checkoutDate: newCheckoutDate.format('YYYY-MM-DD'),
                reason: pendingValues?.reason
            };

            createRoomAmendmentMutation.mutate(payload, {
                onSuccess: async () => {
                    Toast.success("Stay Extended Successfully");
                    handleCloseReset();
                },
                onError: (error) => {
                    console.error("API error executing stay extension:", error);
                    Toast.error("Failed to extend stay.");
                },
                onSettled: () => {
                    setIsSubmitting(false);
                }
            });
        } catch (error) {
            console.error("Unexpected error executing stay extension:", error);
            setIsSubmitting(false);
        }
    };

    const handleCloseReset = () => {
        form.resetFields();
        setDaysToAdd(1);
        setCurrentStep('form');
        setPendingValues(null);
        onClose();
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    <div className="h-[18px] w-1 rounded-sm bg-[#1677ff]" />
                    <span className="font-semibold">
                        {currentStep === "form" ? "Extend Guest Stay Duration" : "Review Stay Extension Summary"}
                    </span>
                </div>
            }
            open={isOpen}
            onCancel={handleCloseReset}
            width={currentStep === 'form' ? 520 : 650}
            footer={
                currentStep === 'form' ? [
                    // <Button key="back" onClick={handleCloseReset}>Cancel</Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleProceedToSummary}
                        disabled={maxDayExtension <= 0}
                        className={
                            maxDayExtension <= 0 ? "text-default" : ""
                        }
                    >
                        Review
                    </Button>
                ] : [
                    <Button key="back-to-form" disabled={isSubmitting} onClick={() => setCurrentStep('form')}>Back</Button>,
                    <Button key="confirm" type="primary" loading={isSubmitting} onClick={handleFinalCommit}>Confirm</Button>
                ]
            }
        >
            {/* Context Target Ribbon Header */}
            <div className="text-indigo-700 dark:text-indigo-500 font-semibold">
                {reservationNo}  <span className={`text-slate-800 ${textWhiteInDarkStyle}`}> {roomNo ? `- ${roomNo}` : null}</span>
            </div>

            <Divider className="my-3" />

            {/* --- STEP 1: INCREMENTOR INTERFACE --- */}
            {currentStep === 'form' && (
                <Form form={form} layout="vertical">

                    {/* HIGHLIGHT WARNING BANNER: Visible only when max extension is zero */}
                    {maxDayExtension === 0 ? (
                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-5 flex gap-3 items-start">
                            <WarningOutlined className="text-red-500 text-base mt-0.5" />
                            <div>
                                <div className="font-semibold text-red-600 text-sm mb-0.5">
                                    Extension Limit Reached (0 Days Remaining)
                                </div>
                                <div className="text-xs text-neutral-500 leading-relaxed">
                                    This stay cannot be extended further because the maximum extension allocation for this room is currently zero. This is usually due to upcoming bookings or room restrictions.
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Standard Interactive Incrementer
                        <div className={`bg-slate-50 p-4 rounded-lg mb-5 ${darkModeStyle}`}>
                            <div className="flex justify-between items-center mb-2">
                                <label className={`block text-sm font-medium text-slate-600 ${textWhiteInDarkStyle}`}>
                                    Provision Additional Days
                                </label>
                                {/* MAX EXTENSION BADGE */}
                                <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-100">
                                    Max Extension: {maxDayExtension} Day(s)
                                </span>
                            </div>

                            <Space size="middle" className="flex items-center">
                                <Button
                                    shape="circle"
                                    icon={<MinusOutlined />}
                                    onClick={() => setDaysToAdd(prev => Math.max(1, prev - 1))}
                                    disabled={daysToAdd <= 1}
                                />
                                <span className="text-xl font-bold min-w-[30px] text-center inline-block">
                                    {daysToAdd}
                                </span>

                                <Button
                                    shape="circle"
                                    icon={<PlusOutlined />}
                                    onClick={() => setDaysToAdd(prev => prev + 1)}
                                    disabled={daysToAdd >= maxDayExtension}
                                />
                                <span className={`text-sm text-slate-500 font-medium ${textWhiteInDarkStyle}`}>
                                    Extra Day(s)
                                </span>
                            </Space>
                        </div>
                    )}

                    {/* Timeline Data Footer */}
                    <div className={`bg-slate-50 p-3 px-4 rounded-lg mb-5 border border-slate-200 ${darkModeStyle} ${borderDarkMode}`}>
                        <div className="text-xs">
                            Current Checkout - <strong >{originalCheckout?.isValid() ? originalCheckout.format('DD MMM YYYY') : '-'}</strong>
                        </div>
                        {maxDayExtension !== 0 && (
                            <div className="text-sm mt-1">
                                New Checkout - <strong >{newCheckoutDate.format('DD MMM YYYY')}</strong>
                            </div>
                        )}
                    </div>

                    <Form.Item
                        name="reason"
                        label="Reason for Stay Extension"
                    >
                        <Input.TextArea
                            placeholder={maxDayExtension === 0 ? "Stay extension is currently unavailable." : "Reason for Stay Extension"}
                            rows={3}
                            disabled={maxDayExtension === 0}
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
                            <ArrowRightOutlined className="mx-2.5 text-blue-500" />
                            <strong className={`text-slate-800 ${textColorDarkMode}`}>
                                {newCheckoutDate.format('DD MMM YYYY')}
                            </strong>
                        </Descriptions.Item>

                        <Descriptions.Item label="Extend Days">
                            <span className="text-sm ml-2.5 text-green-500 font-medium">
                                +{daysToAdd} Day(s)
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