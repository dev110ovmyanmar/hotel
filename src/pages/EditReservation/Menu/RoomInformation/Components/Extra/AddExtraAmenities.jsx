import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Row, Col, Divider, Typography, InputNumber, Tag, Space, Alert, Checkbox } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import { reservationRoomDetails } from '../../../../../../api/reservationSectionApi';
import { createExtraBedPersonBabyCot } from '../../../../../../api/extraBedPersonBabyCotApi';
import { useApiMutation } from '../../../../../../hooks/useApiMutation';
import Toast from '../../../../../../component/Toast/Toast';

const { Text } = Typography;

const AddExtraAmenities = ({
    isOpen,
    onClose,
    record,
}) => {
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [zeroQtyErrors, setZeroQtyErrors] = useState({});

    // Arrays tracking multiple highlighted active dates per amenity type
    const [selectedBedDates, setSelectedBedDates] = useState([]);
    const [selectedPersonDates, setSelectedPersonDates] = useState([]);
    const [selectedCotDates, setSelectedCotDates] = useState([]);

    const formValues = Form.useWatch([], form) || {};

    const createExtraBedPersonBabyCotMutation = useApiMutation({
        mutationFn: createExtraBedPersonBabyCot,
        invalidateKeys: [["reservation-room"]],
    });

    const reservationRoomsDetails = useApiMutation({
        mutationFn: reservationRoomDetails,
    });

    useEffect(() => {
        if (record?.uuid) {
            reservationRoomsDetails.mutate({ uuid: record?.uuid });
        }
    }, [record, isOpen]);

    const sourceData = reservationRoomsDetails?.data;
    console.log("Record", record);

    const reservationNo = sourceData?.reservation?.reservationNo || 'UNKNOWN';
    const guestName = record?.guest?.name || "Unknown";
    const currentRoomType = sourceData?.roomType?.name || "Standard Room";

    const dailySchedule = sourceData?.reservationRoomRates?.map(rate => ({
        date: rate.date,
    })) || [];

    useEffect(() => {
        if (isOpen && dailySchedule.length > 0) {
            const bedDefaults = {};
            const personDefaults = {};
            const cotDefaults = {};

            const activeBedDates = [];
            const activePersonDates = [];
            const activeCotDates = [];

            let hasAnyExtras = false;

            dailySchedule.forEach(day => {
                const rateDay = sourceData?.reservationRoomRates?.find(r => r.date === day.date);

                let bQty = 0;
                let pQty = 0;
                let cQty = 0;

                if (rateDay && rateDay.reservationRoomExtras) {
                    rateDay.reservationRoomExtras.forEach(extra => {
                        if (extra.extraType === 'extra_bed') { bQty += extra.quantity; hasAnyExtras = true; }
                        if (extra.extraType === 'extra_person') { pQty += extra.quantity; hasAnyExtras = true; }
                        if (extra.extraType === 'baby_cot') { cQty += extra.quantity; hasAnyExtras = true; }
                    });
                }

                bedDefaults[day.date] = bQty;
                personDefaults[day.date] = pQty;
                cotDefaults[day.date] = cQty;

                if (bQty > 0) activeBedDates.push(day.date);
                if (pQty > 0) activePersonDates.push(day.date);
                if (cQty > 0) activeCotDates.push(day.date);
            });

            // Only select dates that already have an active quantity
            setSelectedBedDates(activeBedDates);
            setSelectedPersonDates(activePersonDates);
            setSelectedCotDates(activeCotDates);

            form.setFieldsValue({
                extraBedDays: bedDefaults,
                extraPersonDays: personDefaults,
                babyCotDays: cotDefaults,
            });
        }
    }, [isOpen, sourceData]);

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Toggle logic for handling multi-selection clicks
    const handleDateTagClick = (date, currentSelection, setSelection, formFieldName, extraType) => {
        if (date < todayStr) return; // Prevent interaction with past dates

        const rateDay = sourceData?.reservationRoomRates?.find(r => r.date === date);
        const alreadyExists = rateDay?.reservationRoomExtras?.some(extra => extra.extraType === extraType);

        if (alreadyExists) return; // Disable toggling if it already exists

        const currentGroupValues = form.getFieldValue(formFieldName) || {};
        const updatedGroupValues = { ...currentGroupValues };

        if (currentSelection.includes(date)) {
            setSelection(currentSelection.filter(d => d !== date));
            updatedGroupValues[date] = 0;
            setZeroQtyErrors(prev => ({ ...prev, [formFieldName]: false }));
        } else {
            setSelection([...currentSelection, date]);
        }
        form.setFieldsValue({ [formFieldName]: updatedGroupValues });
    };

    // Global bulk modification helper applying quantity values to focused selections
    const applyBulkQuantityToSelected = (formFieldName, selectedDates, quantity) => {
        if (selectedDates.length === 0 || quantity === undefined || quantity === null) return;

        const currentGroupValues = form.getFieldValue(formFieldName) || {};
        const updatedGroupValues = { ...currentGroupValues };

        let extraType = 'extra_bed';
        if (formFieldName === 'extraPersonDays') extraType = 'extra_person';
        if (formFieldName === 'babyCotDays') extraType = 'baby_cot';

        selectedDates.forEach(dateStr => {
            const rateDay = sourceData?.reservationRoomRates?.find(r => r.date === dateStr);
            const alreadyExists = rateDay?.reservationRoomExtras?.some(extra => extra.extraType === extraType);
            const isPastDate = dateStr < todayStr;

            if (!alreadyExists && !isPastDate) {
                updatedGroupValues[dateStr] = quantity;
            }
        });

        form.setFieldsValue({ [formFieldName]: updatedGroupValues });

        if (quantity > 0) {
            setZeroQtyErrors(prev => ({ ...prev, [formFieldName]: false }));
        }
    };


    const handleCloseReset = () => {
        form.resetFields();
        onClose();
    };

    // 4. PARALLEL PAYLOAD BATCH TRANSMISSION PIPELINE
    const handleSubmit = async () => {
        try {
            await form.validateFields();

            let hasZeroQuantityError = false;
            let errorFields = {};

            const checkZeroQuantity = (selectedDates, formFieldName) => {
                const groupValues = form.getFieldValue(formFieldName) || {};
                let extraType = 'extra_bed';
                if (formFieldName === 'extraPersonDays') extraType = 'extra_person';
                if (formFieldName === 'babyCotDays') extraType = 'baby_cot';

                for (const dateStr of selectedDates) {
                    const rateDay = sourceData?.reservationRoomRates?.find(r => r.date === dateStr);
                    const alreadyExists = rateDay?.reservationRoomExtras?.some(extra => extra.extraType === extraType);

                    if (!alreadyExists) {
                        const qty = groupValues[dateStr] || 0;
                        if (qty <= 0) {
                            hasZeroQuantityError = true;
                            errorFields[formFieldName] = true;
                            break;
                        }
                    }
                }
            };

            checkZeroQuantity(selectedBedDates, 'extraBedDays');
            checkZeroQuantity(selectedPersonDates, 'extraPersonDays');
            checkZeroQuantity(selectedCotDates, 'babyCotDays');

            if (hasZeroQuantityError) {
                setZeroQtyErrors(errorFields);
                return;
            } else {
                setZeroQtyErrors({});
            }

            const values = form.getFieldsValue(true);
            const extras = [];

            const processAmenity = (formFieldName, type) => {
                const groupValues = form.getFieldValue(formFieldName) || {};
                const qtyMap = {};
                dailySchedule.forEach(day => {
                    const qty = groupValues[day.date] || 0;
                    if (qty > 0) {
                        const rateDay = sourceData?.reservationRoomRates?.find(r => r.date === day.date);
                        let alreadyExists = false;

                        if (rateDay && rateDay.reservationRoomExtras) {
                            alreadyExists = rateDay.reservationRoomExtras.some(extra => extra.extraType === type);
                        }

                        if (!alreadyExists) {
                            if (!qtyMap[qty]) qtyMap[qty] = [];
                            qtyMap[qty].push(day.date);
                        }
                    }
                });

                Object.keys(qtyMap).forEach(qtyStr => {
                    extras.push({
                        type: type,
                        quantity: parseInt(qtyStr, 10),
                        dates: qtyMap[qtyStr]
                    });
                });
            };

            processAmenity('extraBedDays', 'extra_bed');
            processAmenity('extraPersonDays', 'extra_person');
            processAmenity('babyCotDays', 'baby_cot');

            const finalPayload = {
                reservationRoom: {
                    uuid: sourceData?.uuid
                },
                extras: extras
            };

            setIsSubmitting(true);

            createExtraBedPersonBabyCotMutation.mutate(finalPayload, {
                onSuccess: () => {
                    Toast.success("Extra amenities posted successfully.");
                    handleCloseReset();
                },
                onError: (err) => {
                    console.error("Batch deployment failed:", err);
                    Toast.error("Failed to append daily modifications.");
                },
                onSettled: () => {
                    setIsSubmitting(false);
                }
            });
        } catch (err) {
            console.error("Form validation or batch deployment failed:", err);
            Toast.error("Failed to append modifications.");
            setIsSubmitting(false);
        }
    };

    // Sub-renderer rendering dynamic badge matrices paired with a unified input trigger
    const renderMultiSelectionBlock = (formFieldName, selectedDatesArray, setDatesArray, themeColor, sectionLabel) => {
        let extraType = 'extra_bed';
        if (formFieldName === 'extraPersonDays') extraType = 'extra_person';
        if (formFieldName === 'babyCotDays') extraType = 'baby_cot';

        const hasEditableDates = selectedDatesArray.filter(dateStr => {
            const rateDay = sourceData?.reservationRoomRates?.find(r => r.date === dateStr);
            const alreadyExists = rateDay?.reservationRoomExtras?.some(extra => extra.extraType === extraType);
            const isPastDate = dateStr < todayStr;
            return !alreadyExists && !isPastDate;
        }).length > 0;

        return (
            <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }} className={darkModeStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <Text strong style={{ fontSize: '14px', color: '#0f172a' }} className='dark:!text-gray-100'>{sectionLabel}</Text>
                    <Checkbox
                        checked={selectedDatesArray.length === dailySchedule.length && dailySchedule.length > 0}
                        indeterminate={selectedDatesArray.length > 0 && selectedDatesArray.length < dailySchedule.length}
                        onChange={(e) => {
                            const currentGroupValues = form.getFieldValue(formFieldName) || {};
                            const updatedGroupValues = { ...currentGroupValues };

                            if (e.target.checked) {
                                const newSelected = [];
                                dailySchedule.forEach(d => {
                                    const isPastDate = d.date < todayStr;
                                    const rateDay = sourceData?.reservationRoomRates?.find(r => r.date === d.date);
                                    const alreadyExists = rateDay?.reservationRoomExtras?.some(extra => extra.extraType === extraType);

                                    if (alreadyExists || !isPastDate) {
                                        newSelected.push(d.date);
                                    }
                                });
                                setDatesArray(newSelected);
                            } else {
                                const newSelected = [];
                                dailySchedule.forEach(d => {
                                    const rateDay = sourceData?.reservationRoomRates?.find(r => r.date === d.date);
                                    const alreadyExists = rateDay?.reservationRoomExtras?.some(extra => extra.extraType === extraType);

                                    if (alreadyExists) {
                                        newSelected.push(d.date);
                                    } else {
                                        updatedGroupValues[d.date] = 0;
                                    }
                                });
                                setDatesArray(newSelected);
                            }
                            form.setFieldsValue({ [formFieldName]: updatedGroupValues });
                            setZeroQtyErrors(prev => ({ ...prev, [formFieldName]: false }));
                        }}
                        style={{ fontSize: '13px' }}
                    >
                        Select All
                    </Checkbox>
                </div>

                {/* Clickable Date Array Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                    {dailySchedule.map(day => {
                        const isSelected = selectedDatesArray.includes(day.date);
                        const currentQty = formValues?.[formFieldName]?.[day.date] || 0;
                        const rateDay = sourceData?.reservationRoomRates?.find(r => r.date === day.date);
                        const alreadyExists = rateDay?.reservationRoomExtras?.some(extra => extra.extraType === extraType);
                        const isPastDate = day.date < todayStr;
                        const isDisabled = alreadyExists || isPastDate;

                        return (
                            <>
                                <Tag
                                    key={day.date}
                                    color={isSelected ? themeColor : 'default'}
                                    onClick={() => handleDateTagClick(day.date, selectedDatesArray, setDatesArray, formFieldName, extraType)}
                                    style={{
                                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                                        opacity: isDisabled ? 0.6 : 1,
                                        padding: '5px 10px',
                                        fontSize: '12px',
                                        borderRadius: '4px',
                                        userSelect: 'none',
                                        border: isSelected ? `1px solid ${themeColor}` : currentQty > 0 ? '1px dashed #1677ff' : '1px solid #d9d9d9',
                                        fontWeight: isSelected || currentQty > 0 ? 600 : 400
                                    }}
                                >
                                    <CalendarOutlined style={{ marginRight: '4px' }} />
                                    {day.date} {currentQty > 0 && `[${currentQty}]`}
                                </Tag>
                            </>
                        );
                    })}
                </div>

                {/* Single Quantity Input Box applying values directly across chosen subset arrays */}
                {hasEditableDates && (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            background: '#f8fafc',
                            padding: '10px 10px 0px 10px',
                            borderRadius: '6px',
                            border: '1px dashed #e2e8f0',
                            width: "240px",
                            marginLeft: 'auto'
                        }}
                        className={darkModeStyle}
                    >
                        <Form.Item
                            label={<Text style={{ fontSize: '12px', color: '#64748b' }} className='dark:!text-gray-200'>Set Quantity</Text>}
                            validateStatus={zeroQtyErrors[formFieldName] ? 'error' : ''}
                            help={zeroQtyErrors[formFieldName] ? 'Quantity is required' : ''}
                            required={true}
                            style={{ marginBottom: '10px', width: '100%' }}
                        >
                            <InputNumber
                                min={0}
                                placeholder="Set Qty"
                                style={{ width: '100%', borderRadius: '4px' }}
                                onChange={(val) => applyBulkQuantityToSelected(formFieldName, selectedDatesArray, val)}
                            />
                        </Form.Item>
                    </div>
                )}
            </div>
        );
    };

    const hasAnyNewDate = (datesArray, extraType) => {
        return datesArray.some(dateStr => {
            const rateDay = sourceData?.reservationRoomRates?.find(r => r.date === dateStr);
            const alreadyExists = rateDay?.reservationRoomExtras?.some(extra => extra.extraType === extraType);
            const isPastDate = dateStr < todayStr;
            return !alreadyExists && !isPastDate;
        });
    };

    const isSaveEnabled = hasAnyNewDate(selectedBedDates, 'extra_bed') ||
        hasAnyNewDate(selectedPersonDates, 'extra_person') ||
        hasAnyNewDate(selectedCotDates, 'baby_cot');

    const darkModeStyle = `
        dark:!bg-[#141414] 
        dark:border 
        dark:!border-gray-500
        dark:!text-gray-100
    `;

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '18px', background: '#1677ff', borderRadius: '2px' }} />
                    <span style={{ fontWeight: 600 }}>Add Extra Bed, Person & Baby Cot</span>
                </div>
            }
            open={isOpen}
            onCancel={handleCloseReset}
            width={700}
            destroyOnClose
            footer={[
                <Button key="cancel" disabled={isSubmitting} onClick={handleCloseReset} style={{ borderRadius: '6px' }}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    disabled={!isSaveEnabled || isSubmitting}
                    loading={isSubmitting}
                    onClick={handleSubmit}
                    style={{ borderRadius: '6px', background: (!isSaveEnabled || isSubmitting) ? undefined : '#0b59c5ff', borderColor: (!isSaveEnabled || isSubmitting) ? undefined : '#0b59c5ff' }}
                >
                    Save
                </Button>
            ]}
        >
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                background: '#f8fafc',
                padding: '10px 14px',
                borderRadius: '6px',
                margin: '12px 0 16px 0',
                border: '1px solid #e2e8f0',
                fontSize: '13px'
            }}
                className={darkModeStyle}
            >
                {/* <Text type="secondary"><strong style={{ color: '#475569' }}>Reservation No:</strong> {reservationNo}</Text> */}
                <Text type="secondary"><strong style={{ color: '#475569' }} className='dark:!text-gray-300'>Primary Guest:</strong> <span className='dark:!text-gray-500'>{guestName}</span></Text>
                <Text type="secondary"><strong style={{ color: '#475569' }} className='dark:!text-gray-300'>Room Type:</strong> {currentRoomType}</Text>
            </div>

            <Form form={form} layout="vertical">
                <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '460px', overflowY: 'auto', paddingRight: '4px' }}>
                    {renderMultiSelectionBlock('extraBedDays', selectedBedDates, setSelectedBedDates, '#1677ff', 'Extra Bed Allocations')}
                    {renderMultiSelectionBlock('extraPersonDays', selectedPersonDates, setSelectedPersonDates, '#13c2c2', 'Extra Person Allocations')}
                    {renderMultiSelectionBlock('babyCotDays', selectedCotDates, setSelectedCotDates, '#722ed1', 'Baby Cot Allocations')}
                </div>
            </Form>
        </Modal>
    );
};

export default AddExtraAmenities;