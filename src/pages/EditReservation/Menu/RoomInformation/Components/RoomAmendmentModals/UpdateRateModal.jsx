import React, { useState, useEffect } from 'react';
import { Modal, Form, InputNumber, Button, Divider, Input, Row, Col, DatePicker, Descriptions } from 'antd';
import dayjs from 'dayjs';
import { CheckCircleOutlined, ArrowRightOutlined, PlusOutlined, DeleteOutlined, DollarOutlined } from '@ant-design/icons';
import { createRoomAmendment } from '../../../../../../api/roomAmendmentApi';
import { useApiMutation } from '../../../../../../hooks/useApiMutation';
import Toast from '../../../../../../component/Toast/Toast';

export default function UpdateRateModal({
    isOpen,
    onClose,
    record,
    rateChangeUuid
}) {
    const [form] = Form.useForm();

    const createRoomAmendmentMutation = useApiMutation({
        mutationFn: createRoomAmendment,
        invalidateKeys: [["reservation-room"]],
    });

    // Step navigation states
    const [currentStep, setCurrentStep] = useState('form');
    const [pendingValues, setPendingValues] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Context headers
    const reservationNo = record?.reservation?.reservationNo || `ID-${record?.id}`;
    const guestName = record?.reservation?.guest?.name || "Unknown Guest";

    // Establish strict date boundaries from API record
    const boundsStart = record?.checkinDate ? dayjs(record.checkinDate) : null;
    const boundsEnd = record?.checkoutDate ? dayjs(record.checkoutDate) : null;

    // Blocks dates outside check-in and check-out window
    const disabledDateSetting = (current) => {
        if (!boundsStart || !boundsEnd || !current) return false;
        return current.isBefore(boundsStart, 'day') || current.isAfter(boundsEnd, 'day');
    };

    // EFFECT: Map incoming API array data directly into Form.List initial items
    useEffect(() => {
        if (isOpen && record?.rates) {
            // Clean up the strings like "2026-05-27(for only rate_change)"
            const cleanedInitialRates = record.rates.map(item => {
                const cleanDate = item?.date;
                const cleanPrice = item?.price;

                return {
                    date: cleanDate ? dayjs(cleanDate) : null, // Convert to dayjs object for DatePicker
                    price: isNaN(cleanPrice) ? null : cleanPrice
                };
            });

            form.setFieldsValue({
                rates: cleanedInitialRates
            });
        } else if (isOpen) {
            // Fallback if no initial rates are supplied by API
            form.setFieldsValue({ rates: [{ date: null, price: null }] });
        }
    }, [isOpen, record, form]);

    // Proceed from form inputs to summary review screen
    const handleProceedToSummary = async () => {
        try {
            const values = await form.validateFields();
            setPendingValues(values);
            setCurrentStep('summary');
        } catch (err) {
            console.error("Form validation failed:", err);
        }
    };

    // Construct and submit the clean updated array payload
    const handleFinalCommit = async () => {
        setIsSubmitting(true);
        try {
            const dynamicRatesPayload = pendingValues.rates.map(item => ({
                date: dayjs(item.date).format('YYYY-MM-DD'),
                price: String(item.price)
            }));

            const payload = {
                amendmentType: { uuid: rateChangeUuid },
                reservationRoom: { uuid: record?.uuid },
                rates: dynamicRatesPayload,
                reason: pendingValues?.reason
            };

            createRoomAmendmentMutation.mutate(payload, {
                onSuccess: async () => {
                    Toast.success("Daily Rates Updated Successfully");
                    handleCloseReset();
                },
                onError: (error) => {
                    console.error("API error updating ledger rates:", error);
                    Toast.error("Failed to update rates.");
                },
                onSettled: () => {
                    setIsSubmitting(false);
                }
            });
        } catch (error) {
            console.error("Unexpected error executing mutation:", error);
            setIsSubmitting(false);
        }
    };

    const handleCloseReset = () => {
        form.resetFields();
        setCurrentStep('form');
        setPendingValues(null);
        onClose();
    };

    return (
        <Modal
            title={
                currentStep === 'form'
                    ? "Modify Daily Room Rates"
                    : <span><CheckCircleOutlined style={{ color: '#1677ff' }} /> Review Updated Rates Summary</span>
            }
            open={isOpen}
            onCancel={handleCloseReset}
            destroyOnClose
            width={currentStep === 'form' ? 600 : 650}
            footer={
                currentStep === 'form' ? [
                    <Button key="back" onClick={handleCloseReset}>Cancel</Button>,
                    <Button key="submit" type="primary" onClick={handleProceedToSummary}>Review Summary</Button>
                ] : [
                    <Button key="back-to-form" disabled={isSubmitting} onClick={() => setCurrentStep('form')}>Modify Input</Button>,
                    <Button key="confirm" type="primary" loading={isSubmitting} onClick={handleFinalCommit}>Apply Rate Updates</Button>
                ]
            }
        >
            {/* Header Identity Information */}
            <div style={{ marginBottom: 4, color: '#64748b', fontSize: '13px', fontWeight: 500 }}>
                {reservationNo} — <span style={{ color: '#1e293b' }}>{guestName}</span>
            </div>

            {/* Context window visual helper */}
            {boundsStart && boundsEnd && (
                <div style={{ fontSize: '12px', color: '#0284c7', background: '#e0f2fe', display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>
                    Valid Booking Windows: {boundsStart.format('DD MMM YYYY')} – {boundsEnd.format('DD MMM YYYY')}
                </div>
            )}

            <Divider style={{ margin: '12px 0' }} />

            {/* --- STEP 1: DYNAMIC INPUT UPDATE INTERFACE --- */}
            {currentStep === 'form' && (
                <Form form={form} layout="vertical">

                    <Form.List name="rates">
                        {(fields, { add, remove }) => (
                            <>
                                <Row gutter={16} style={{ marginBottom: '8px' }}>
                                    <Col span={11}><span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>TARGET DATE</span></Col>
                                    <Col span={11}><span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>NIGHTLY RATE (MMK)</span></Col>
                                    <Col span={2}></Col>
                                </Row>

                                <div style={{ maxHeight: '280px', overflowY: 'auto', marginBottom: '16px', paddingRight: '4px' }}>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Row key={key} gutter={16} align="middle" style={{ marginBottom: '12px', background: '#f8fafc', padding: '12px 8px', borderRadius: '6px' }}>

                                            {/* DYNAMIC EDITABLE DATE PICKER (PRE-FILLED) */}
                                            <Col span={11}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'date']}
                                                    rules={[{ required: true, message: 'Select Date' }]}
                                                    style={{ margin: 0 }}
                                                >
                                                    <DatePicker
                                                        style={{ width: '100%' }}
                                                        format="YYYY-MM-DD"
                                                        disabledDate={disabledDateSetting}
                                                    />
                                                </Form.Item>
                                            </Col>

                                            {/* DYNAMIC EDITABLE RATE PRICE INPUT (PRE-FILLED) */}
                                            <Col span={11}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'price']}
                                                    rules={[{ required: true, message: 'Enter Price' }]}
                                                    style={{ margin: 0 }}
                                                >
                                                    <InputNumber
                                                        style={{ width: '100%' }}
                                                        placeholder="Rate Amount"
                                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                        parser={value => value.replace(/\s?|(,*)/g, '')}
                                                        min={0}
                                                        addonBefore={<DollarOutlined style={{ fontSize: '11px' }} />}
                                                    />
                                                </Form.Item>
                                            </Col>

                                            {/* DELETE ROW */}
                                            <Col span={2} style={{ textAlign: 'center' }}>
                                                <Button
                                                    type="text"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => remove(name)}
                                                    disabled={fields.length === 1}
                                                />
                                            </Col>
                                        </Row>
                                    ))}
                                </div>

                                {/* <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Add Extra Date Adjustment Row
                                    </Button>
                                </Form.Item> */}
                            </>
                        )}
                    </Form.List>

                    <Form.Item
                        name="reason"
                        label="Reason for Rate Modification"
                        rules={[{ required: true, message: 'Please provide reason documentation for updating prices.' }]}
                    >
                        <Input.TextArea placeholder="Provide business justification details explaining rate variations..." rows={3} />
                    </Form.Item>
                </Form>
            )}

            {/* --- STEP 2: POST PAYLOAD SUMMARY REVIEW --- */}
            {currentStep === 'summary' && pendingValues && (
                <div style={{ animation: 'fadeIn 0.2s ease-in-out' }}>
                    <p style={{ color: '#475569', marginBottom: '12px' }}>
                        Please verify your modified schedule below before saving.
                    </p>

                    <div style={{ maxHeight: '220px', overflowY: 'auto', marginBottom: '16px', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead style={{ background: '#f1f5f9', textAlign: 'left', position: 'sticky', top: 0 }}>
                                <tr>
                                    <th style={{ padding: '10px' }}>Target Date</th>
                                    <th style={{ padding: '10px' }}>Status Execution</th>
                                    <th style={{ padding: '10px' }}>Updated Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingValues.rates.map((item, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '10px', fontWeight: 500 }}>
                                            {dayjs(item.date).format('DD MMM YYYY')}
                                        </td>
                                        <td style={{ padding: '10px', color: '#52c41a', fontSize: '12px' }}>
                                            <ArrowRightOutlined style={{ marginRight: '6px' }} /> Push Rate State
                                        </td>
                                        <td style={{ padding: '10px', fontWeight: 600, color: '#1e293b' }}>
                                            MMK {parseFloat(item.price).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Descriptions bordered column={1} size="small">
                        <Descriptions.Item label="Active Record Targets">
                            <strong>{pendingValues.rates.length} Schedules Set</strong>
                        </Descriptions.Item>
                        <Descriptions.Item label="Audit System Notes">
                            <span style={{ fontStyle: 'italic', color: '#475569' }}>
                                "{pendingValues?.reason}"
                            </span>
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            )}
        </Modal>
    );
}