import React, { useState } from 'react';
import { Modal, Form, Input, Button, Radio, Row, Col, Divider, Typography } from 'antd';
import { DoubleRightOutlined, InfoCircleOutlined, WalletOutlined } from '@ant-design/icons';
import { createRoomAmendment } from '../../../../../../api/roomAmendmentApi';
import { useApiMutation } from '../../../../../../hooks/useApiMutation';
import Toast from '../../../../../../component/Toast/Toast';

const { Text, Title } = Typography;

export default function AddExtraBedModal({
    isOpen,
    onClose,
    record,
    extraBedAmendmentUuid
}) {
    const [form] = Form.useForm();
    const [bedQuantity, setBedQuantity] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // API Mutation engine handling state invalidation
    const createRoomAmendmentMutation = useApiMutation({
        mutationFn: createRoomAmendment,
        invalidateKeys: [["reservation-room"]],
    });

    // Baseline property safe fallback metrics extraction
    const reservationNo = record?.reservation?.reservationNo || `ID-${record?.id || 'UNKNOWN'}`;
    const guestName = record?.reservation?.guest?.name || "Unknown Guest";
    const currentRoomType = record?.roomType?.name || record?.room?.roomType?.name || "Standard Room";

    const baseExtraBedRate = record?.extraBedRate || 15000;
    const totalNights = record?.totalNight || 1;
    const computedTotalCost = bedQuantity * baseExtraBedRate * totalNights;

    // Handles absolute clean form execution resets
    const handleCloseReset = () => {
        form.resetFields();
        setBedQuantity(1);
        onClose();
    };

    // Submits data directly using single-pane architectural validation structures
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setIsSubmitting(true);

            const payload = {
                amendmentType: { uuid: extraBedAmendmentUuid },
                reservationRoom: { uuid: record?.uuid },
                quantity: bedQuantity,
                extraBedRate: String(baseExtraBedRate),
                totalExtendedCost: String(computedTotalCost),
                reason: values.reason
            };

            createRoomAmendmentMutation.mutate(payload, {
                onSuccess: () => {
                    Toast.success("Extra Bed configuration added and posted successfully.");
                    handleCloseReset();
                },
                onError: (error) => {
                    console.error("API Error allocating extra bed asset details:", error);
                    Toast.error("Failed to append extra bed allocation.");
                },
                onSettled: () => {
                    setIsSubmitting(false);
                }
            });
        } catch (err) {
            console.error("Form validation requirements missing:", err);
        }
    };

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '18px', background: '#1677ff', borderRadius: '2px' }} />
                    <span style={{ fontWeight: 600 }}>Room Amendment — Add Extra Bed</span>
                </div>
            }
            open={isOpen}
            onCancel={handleCloseReset}
            width={680}
            destroyOnClose
            footer={[
                <Button key="cancel" disabled={isSubmitting} onClick={handleCloseReset} style={{ borderRadius: '6px' }}>
                    Discard
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={isSubmitting}
                    onClick={handleSubmit}
                    style={{ borderRadius: '6px', background: '#1e293b', borderColor: '#1e293b' }}
                >
                    Confirm & Post Charge <DoubleRightOutlined style={{ fontSize: '10px' }} />
                </Button>
            ]}
        >
            {/* Context Header Ribbon Display */}
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
                <Text type="secondary"><strong style={{ color: '#475569' }}>Folio No:</strong> {reservationNo}</Text>
                <Text type="secondary"><strong style={{ color: '#475569' }}>Primary Guest:</strong> {guestName}</Text>
                <Text type="secondary"><strong style={{ color: '#475569' }}>Room Type:</strong> {currentRoomType}</Text>
            </div>

            <Form form={form} layout="vertical">
                <Row gutter={24}>

                    {/* LEFT PANEL: SELECTION & DOCUMENTATION INPUTS */}
                    <Col span={13}>
                        <Form.Item label={<span style={{ fontWeight: 600, color: '#334155' }}>Select Bed Quantity</span>} required>
                            <Radio.Group
                                value={bedQuantity}
                                onChange={(e) => setBedQuantity(e.target.value)}
                                optionType="button"
                                buttonStyle="solid"
                                style={{ width: '100%', display: 'flex', gap: '8px' }}
                            >
                                {[1, 2, 3].map(num => (
                                    <Radio.Button
                                        key={num}
                                        value={num}
                                        style={{
                                            flex: 1,
                                            textAlign: 'center',
                                            borderRadius: '6px',
                                            borderLeft: '1px solid #d9d9d9',
                                            height: '42px',
                                            lineHeight: '40px',
                                            fontWeight: 600
                                        }}
                                    >
                                        {num} {num === 1 ? 'Bed' : 'Beds'}
                                    </Radio.Button>
                                ))}
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            name="reason"
                            label={<span style={{ fontWeight: 600, color: '#334155' }}>Operational Justification Note</span>}
                            rules={[{ required: true, message: 'Please input an amendment log reason note.' }]}
                        >
                            <Input.TextArea
                                placeholder="Type structural reason details here for compliance tracking history..."
                                rows={4}
                                style={{ borderRadius: '6px' }}
                            />
                        </Form.Item>
                    </Col>

                    {/* RIGHT PANEL: LIVE SUMMARY LEDGER CARD */}
                    <Col span={11}>
                        <div style={{
                            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                            borderRadius: '12px',
                            padding: '20px',
                            color: '#ffffff',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.75, marginBottom: '18px' }}>
                                    <WalletOutlined />
                                    <Text style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Live Folio Cost Analysis
                                    </Text>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                        <span style={{ color: '#94a3b8' }}>Unit Price (Per Night):</span>
                                        <span style={{ fontWeight: 500 }}>MMK {baseExtraBedRate.toLocaleString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                        <span style={{ color: '#94a3b8' }}>Stay Duration:</span>
                                        <span style={{ fontWeight: 500 }}>{totalNights} Night(s)</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                        <span style={{ color: '#94a3b8' }}>Requested Assets:</span>
                                        <span style={{ color: '#38bdf8', fontWeight: 600 }}>{bedQuantity} Bed Unit(s)</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '14px 0' }} />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 500 }}>TOTAL PENDING DEBIT CHARGE</span>
                                    <Title level={3} style={{ color: '#34d399', margin: '4px 0 0 0', fontWeight: 700 }}>
                                        MMK {computedTotalCost.toLocaleString()}
                                    </Title>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'start', gap: '6px', marginTop: '14px', opacity: 0.55 }}>
                                    <InfoCircleOutlined style={{ fontSize: '11px', marginTop: '2px' }} />
                                    <span style={{ fontSize: '10px', lineHeight: '14px' }}>
                                        Confirming this room modification will instantly allocate operational bed assets and post the corresponding billing balance directly onto the guest's folio record.
                                    </span>
                                </div>
                            </div>

                        </div>
                    </Col>

                </Row>
            </Form>
        </Modal>
    );
}