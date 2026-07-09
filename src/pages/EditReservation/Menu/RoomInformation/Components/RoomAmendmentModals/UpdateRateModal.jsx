import React, { useState, useEffect } from 'react';
import { Modal, Form, InputNumber, Button, Divider, Input, Descriptions } from 'antd';
import dayjs from 'dayjs';
import { CheckCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { createRoomAmendment } from '../../../../../../api/roomAmendmentApi';
import { useApiMutation } from '../../../../../../hooks/useApiMutation';
import { darkModeStyle, textColorDarkMode, textWhiteInDarkStyle } from '../../../../../../utils';

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
                    handleCloseReset();
                },
                onSettled: () => {
                    setIsSubmitting(false);
                }
            });
        } catch (error) {
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
                    : <span className="flex items-center gap-1.5"><CheckCircleOutlined className="text-blue-500" /> Review Updated Rates Summary</span>
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
            <div className="mb-1 text-slate-500 text-xs font-medium">
                {reservationNo} — <span className={`text-slate-800 ${textWhiteInDarkStyle}`}>{guestName}</span>
            </div>

            {/* Context window visual helper */}
            {boundsStart && boundsEnd && (
                <div className="text-xs text-sky-600 bg-sky-100 inline-block px-2 py-0.5 rounded font-medium">
                    Valid Booking Windows: {boundsStart.format('DD MMM YYYY')} – {boundsEnd.format('DD MMM YYYY')}
                </div>
            )}

            <Divider className="my-3" />

            {/* --- STEP 1: DYNAMIC INPUT UPDATE INTERFACE --- */}
            {currentStep === 'form' && (
                <Form form={form} layout="vertical">

                    <Form.List name="rates">
                        {(fields) => (
                            <>
                                <div className="grid grid-cols-12 gap-4 mb-2">
                                    <div className="col-span-6">
                                        <span className={`text-xs font-semibold text-slate-600 ${textColorDarkMode}`}>TARGET DATE</span>
                                    </div>
                                    <div className="col-span-6">
                                        <span className={`text-xs font-semibold text-slate-600 ${textColorDarkMode}`}>NIGHTLY RATE (MMK)</span>
                                    </div>
                                </div>

                                <div className='max-h-[280px] overflow-y-auto mb-4 pr-1'>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <div key={key} className={`grid grid-cols-12 gap-4 items-center mb-3 bg-slate-50 p-3 rounded-md ${darkModeStyle}`}>

                                            {/* DYNAMIC EDITABLE DATE PICKER (PRE-FILLED) */}
                                            <div className="col-span-6">
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'date']}
                                                    className="m-0"
                                                    getValueProps={(value) => ({
                                                        value: value ? value.format('YYYY-MM-DD') : ''
                                                    })}
                                                >
                                                    <Input
                                                        readOnly
                                                        className="w-full border-none bg-transparent pointer-events-none font-medium text-slate-700 shadow-none focus:shadow-none"
                                                    />
                                                </Form.Item>
                                            </div>

                                            {/* DYNAMIC EDITABLE RATE PRICE INPUT (PRE-FILLED) */}
                                            <div className="col-span-6">
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'price']}
                                                    rules={[{ required: true, message: 'Enter Price' }]}
                                                    className="m-0"
                                                >
                                                    <InputNumber
                                                        className="!w-full"
                                                        placeholder="Rate Amount"
                                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                        parser={value => value.replace(/[\s,]/g, '')}
                                                        min={0}
                                                        addonBefore={<span className="text-xs font-semibold text-slate-500">MMK</span>}
                                                    />
                                                </Form.Item>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </Form.List>

                    <Form.Item
                        name="reason"
                        label="Reason for Rate Modification"
                    >
                        <Input.TextArea placeholder="Provide business justification details explaining rate variations..." rows={3} />
                    </Form.Item>
                </Form>
            )}

            {/* --- STEP 2: POST PAYLOAD SUMMARY REVIEW --- */}
            {currentStep === 'summary' && pendingValues && (
                <div className="animate-[fadeIn_0.2s_ease-in-out]">
                    <p className="text-slate-600 mb-3">
                        Please verify your modified schedule below before saving. Highlighted lines indicate changed prices.
                    </p>

                    <div className="max-h-[220px] overflow-y-auto mb-4 border border-slate-200 rounded-md">
                        <table className={`w-full border-collapse text-xs ${darkModeStyle}`}>
                            <thead className={`bg-slate-100 text-left sticky top-0 z-10 ${darkModeStyle}`}>
                                <tr>
                                    <th className="p-2.5">Target Date</th>
                                    <th className="p-2.5">Status Execution</th>
                                    <th className="p-2.5">Price Summary (MMK)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingValues.rates.map((item, index) => {
                                    const formattedDate = dayjs(item.date).format('YYYY-MM-DD');

                                    // Match against the original values fed into the component
                                    const originalRateObj = record?.rates?.find(
                                        orig => dayjs(orig?.date).format('YYYY-MM-DD') === formattedDate
                                    );

                                    const originalPrice = originalRateObj ? parseFloat(originalRateObj.price) : null;
                                    const currentPrice = parseFloat(item.price);
                                    const isChanged = originalPrice !== null && originalPrice !== currentPrice;

                                    return (
                                        <tr
                                            key={index}
                                            className={`border-b border-slate-200 last:border-b-0 transition-colors ${isChanged ? 'bg-amber-50 hover:bg-amber-100/70' : 'hover:bg-slate-50'
                                                }`}
                                        >
                                            <td className="p-2.5 font-medium text-slate-700">
                                                {dayjs(item.date).format('DD MMM YYYY')}
                                            </td>
                                            <td className="p-2.5 text-xs">
                                                {isChanged ? (
                                                    <span className="text-amber-600 font-medium">Rate Adjusted</span>
                                                ) : (
                                                    <span className="text-slate-400">Unchanged</span>
                                                )}
                                            </td>
                                            <td className="p-2.5">
                                                {isChanged ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-slate-400 line-through">
                                                            {originalPrice.toLocaleString()}
                                                        </span>
                                                        <ArrowRightOutlined className="text-amber-500 text-[10px]" />
                                                        <span className="font-semibold text-slate-900">
                                                            {currentPrice.toLocaleString()}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-600">
                                                        {currentPrice.toLocaleString()}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <Descriptions bordered column={1} size="small">
                        <Descriptions.Item label="Active Record Targets">
                            <strong>{pendingValues.rates.length} Schedules Set</strong>
                        </Descriptions.Item>
                        <Descriptions.Item label="Audit System Notes">
                            <span className="italic text-slate-600">
                                "{pendingValues?.reason}"
                            </span>
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            )}
        </Modal>
    );
}