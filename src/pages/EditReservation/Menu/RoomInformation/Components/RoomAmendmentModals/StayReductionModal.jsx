import React, { useState } from 'react';
import { Modal, Form, Input, Descriptions, Button, Divider, Space } from 'antd';
import dayjs from 'dayjs';
import { ArrowRightOutlined, CheckCircleOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { createRoomAmendment } from '../../../../../../api/roomAmendmentApi';
import { useApiMutation } from '../../../../../../hooks/useApiMutation';
import Toast from '../../../../../../component/Toast/Toast';

export default function StayReductionModal({
    isOpen,
    onClose,
    record,
    stayReductionUuid // Expecting the reduction configuration UUID here
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

    // Fallback limit configuration to ensure we don't reduce the stay to <= 0 days
    // const maxDaysToSubtract = record?.totalDates;

    // Compute live mathematical timeline subtractions
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
                    : <span><CheckCircleOutlined style={{ color: '#faad14' }} /> Review Stay Reduction Summary</span>
            }
            open={isOpen}
            onCancel={handleCloseReset}
            width={currentStep === 'form' ? 520 : 650}
            footer={
                currentStep === 'form' ? [
                    <Button key="back" onClick={handleCloseReset}>Cancel</Button>,
                    <Button key="submit" type="primary" danger onClick={handleProceedToSummary}>Review Summary</Button>
                ] : [
                    <Button key="back-to-form" disabled={isSubmitting} onClick={() => setCurrentStep('form')}>Modify Reduction</Button>,
                    <Button key="confirm" type="primary" danger loading={isSubmitting} onClick={handleFinalCommit}>Confirm Reduction</Button>
                ]
            }
        >
            {/* Context Target Ribbon Header */}
            <div style={{ marginBottom: 16, color: '#64748b', fontSize: '13px', fontWeight: 500 }}>
                {reservationNo} — <span style={{ color: '#1e293b' }}>{guestName}</span>
            </div>

            <Divider style={{ margin: '12px 0' }} />

            {/* --- STEP 1: INCREMENTOR INTERFACE --- */}
            {currentStep === 'form' && (
                <Form form={form} layout="vertical">
                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#475569', marginBottom: '8px' }}>
                            Reduce Stay Duration By
                        </label>

                        <Space size="middle" style={{ display: 'flex', alignItems: 'center' }}>
                            <Button
                                shape="circle"
                                icon={<MinusOutlined />}
                                onClick={() => setDaysToSubtract(prev => Math.max(1, prev - 1))}
                                disabled={daysToSubtract <= 1}
                            />
                            <span style={{ fontSize: '20px', fontWeight: 'bold', minWidth: '30px', textAlign: 'center', display: 'inline-block' }}>
                                {daysToSubtract}
                            </span>

                            <Button
                                shape="circle"
                                icon={<PlusOutlined />}
                                onClick={() => setDaysToSubtract(prev => prev + 1)}
                            />
                            <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>
                                Day(s) Less
                            </span>
                        </Space>

                        <div style={{ marginTop: '16px', borderTop: '1px dashed #cbd5e1', paddingTop: '12px' }}>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>
                                Current Checkout <strong>{originalCheckout.isValid() ? originalCheckout.format('DD MMM YYYY') : '-'}</strong>
                            </div>
                            <div style={{ fontSize: '13px', color: '#ff4d4f', marginTop: '4px' }}>
                                New Checkout <strong>{newCheckoutDate.isValid() ? newCheckoutDate.format('DD MMM YYYY') : '-'}</strong>
                            </div>
                        </div>
                    </div>

                    <Form.Item
                        name="reason"
                        label="Reason for Stay Reduction"
                        rules={[{ required: true, message: 'Please input a reason for stay reduction.' }]}
                    >
                        <Input.TextArea placeholder="Provide business justification for early checkout / stay reduction..." rows={3} />
                    </Form.Item>
                </Form>
            )}

            {/* --- STEP 2: METRIC COMPARISON SUMMARY --- */}
            {currentStep === 'summary' && pendingValues && (
                <div style={{ animation: 'fadeIn 0.2s ease-in-out' }}>
                    <Descriptions title="" bordered column={1} size="small">
                        <Descriptions.Item label="Checkout Changes">
                            <span style={{ color: '#94a3b8', textDecoration: 'line-through' }}>
                                {originalCheckout.isValid() ? originalCheckout.format('DD MMM YYYY') : '-'}
                            </span>
                            <ArrowRightOutlined style={{ margin: '0 10px', color: '#ff4d4f' }} />
                            <strong style={{ color: '#1e293b' }}>
                                {newCheckoutDate.isValid() ? newCheckoutDate.format('DD MMM YYYY') : '-'}
                            </strong>
                        </Descriptions.Item>

                        <Descriptions.Item label="Reduced Days">
                            <span style={{ fontSize: '15px', marginLeft: '10px', color: '#ff4d4f', fontWeight: 500 }}>
                                -{daysToSubtract} Day(s)
                            </span>
                        </Descriptions.Item>

                        <Descriptions.Item label="Reason">
                            <span style={{ color: '#475569' }}>
                                {pendingValues?.reason}
                            </span>
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            )}
        </Modal>
    );
}