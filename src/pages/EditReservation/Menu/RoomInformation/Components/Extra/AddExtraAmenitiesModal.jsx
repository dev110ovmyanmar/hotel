import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, Typography, InputNumber, Checkbox, Popconfirm, Tag, Divider } from 'antd';
import { CalendarOutlined, DeleteOutlined, EditOutlined, UserOutlined, HomeOutlined, CheckCircleFilled, ClockCircleOutlined } from '@ant-design/icons';
import { reservationRoomDetails } from '../../../../../../api/reservationSectionApi';
import {
    createExtraBedPersonBabyCot,
    deleteExtraBedPersonBabyCot,
    updateExtraBedPersonBabyCot,
} from '../../../../../../api/extraBedPersonBabyCotApi';
import useApiQuery from '../../../../../../hooks/useApiQuery';
import { useApiMutation } from '../../../../../../hooks/useApiMutation';
import Toast from '../../../../../../component/Toast/Toast';
import Loader from '../../../../../../component/Loader/Loader';
import dayjs from 'dayjs';
import { TbBed } from "react-icons/tb";
import { LiaBabyCarriageSolid } from "react-icons/lia";
import { IoPersonOutline } from "react-icons/io5";
import { darkModeStyle, textColorDarkMode } from '../../../../../../utils';

const { Text } = Typography;

const QUERY_KEY = 'reservation-room-extra-detail';

const formatPrice = (num) => num ? `${num}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0';

const SECTION_CONFIG = {
    extraBedDays: {
        label: <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><TbBed style={{ fontSize: '18px' }} /> Extra Bed</span>,
        extraType: 'extra_bed', color: '#1677ff', bg: '#eff6ff', border: '#bfdbfe'
    },
    extraPersonDays: {
        label: <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><IoPersonOutline style={{ fontSize: '18px' }} /> Extra Person</span>,
        extraType: 'extra_person', color: '#1677ff', bg: '#eff6ff', border: '#bfdbfe'
    },
    babyCotDays: {
        label: <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><LiaBabyCarriageSolid style={{ fontSize: '18px' }} /> Baby Cot</span>,
        extraType: 'baby_cot', color: '#1677ff', bg: '#eff6ff', border: '#bfdbfe'
    }
};

const AddExtraAmenitiesModal = ({
    isOpen,
    onClose,
    record,
}) => {
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [zeroQtyErrors, setZeroQtyErrors] = useState({});

    const [selectedBedDates, setSelectedBedDates] = useState([]);
    const [selectedPersonDates, setSelectedPersonDates] = useState([]);
    const [selectedCotDates, setSelectedCotDates] = useState([]);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null);

    const formValues = Form.useWatch([], form) || {};

    // ── Data fetching ─────────────────────────────────────────────────────────
    const { data: sourceData, isLoading } = useApiQuery({
        fetchQueryName: "reservation-room",
        fetchQueryFunction: reservationRoomDetails,
        params: { uuid: record?.uuid },
        options: {
            enabled: !!record?.uuid && isOpen,
        },
    });

    // ── Mutations ─────────────────────────────────────────────────────────────
    const deleteExtraMutation = useApiMutation({
        mutationFn: deleteExtraBedPersonBabyCot,
        invalidateKeys: [['reservation-room'],
            // [QUERY_KEY, { uuid: record?.uuid }]
        ],
    });

    const updateExtraMutation = useApiMutation({
        mutationFn: updateExtraBedPersonBabyCot,
        invalidateKeys: [['reservation-room'],
            //  [QUERY_KEY, { uuid: record?.uuid }]
        ],
    });

    const createExtraMutation = useApiMutation({
        mutationFn: createExtraBedPersonBabyCot,
        invalidateKeys: [['reservation-room'],
            // [QUERY_KEY, { uuid: record?.uuid }]
        ],
    });

    // ── Derived state ─────────────────────────────────────────────────────────
    const guestName = record?.guest?.name || 'Unknown';
    const currentRoomType = sourceData?.roomType?.name || 'Standard Room';
    const dailySchedule = sourceData?.reservationRoomRates?.map(rate => ({ date: rate.date })) || [];

    // ── Populate form when data loads ─────────────────────────────────────────
    useEffect(() => {
        if (isOpen && dailySchedule.length > 0) {
            const bedDefaults = {};
            const personDefaults = {};
            const cotDefaults = {};
            const activeBedDates = [];
            const activePersonDates = [];
            const activeCotDates = [];

            dailySchedule.forEach(day => {
                const rateDay = sourceData?.reservationRoomRates?.find(r => r.date === day.date);
                let bQty = 0, pQty = 0, cQty = 0;

                rateDay?.reservationRoomExtras?.forEach(extra => {
                    if (extra.extraType === 'extra_bed') bQty += extra.quantity;
                    if (extra.extraType === 'extra_person') pQty += extra.quantity;
                    if (extra.extraType === 'baby_cot') cQty += extra.quantity;
                });

                bedDefaults[day.date] = bQty;
                personDefaults[day.date] = pQty;
                cotDefaults[day.date] = cQty;

                if (bQty > 0) activeBedDates.push(day.date);
                if (pQty > 0) activePersonDates.push(day.date);
                if (cQty > 0) activeCotDates.push(day.date);
            });

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

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleDateTagClick = (date, currentSelection, setSelection, formFieldName, extraType, matchedAsset, alreadyExists) => {
        if (alreadyExists && matchedAsset) {
            setEditingAsset(matchedAsset);
            editForm.setFieldsValue({
                quantity: matchedAsset.quantity,
                unitPrice: matchedAsset.unitPrice || matchedAsset.price || 0,
            });
            setIsEditModalOpen(true);
            return;
        }

        if (dayjs(date).isBefore(dayjs(), 'day')) return;

        const currentGroupValues = form.getFieldValue(formFieldName) || {};
        const updatedGroupValues = { ...currentGroupValues };

        if (currentSelection.includes(date)) {
            setSelection(currentSelection.filter(d => d !== date));
            updatedGroupValues[date] = 0;
            setZeroQtyErrors(prev => ({ ...prev, [formFieldName]: false }));
        } else {
            setSelection([...currentSelection, date]);
            updatedGroupValues[date] = 1;
        }
        form.setFieldsValue({ [formFieldName]: updatedGroupValues });
    };

    const handleDeleteExtra = (extraUuid) => {
        deleteExtraMutation.mutate({ uuid: extraUuid }, {
            onSuccess: () => Toast.success('Extra deleted successfully.'),
            onError: (err) => {
                console.error('Failed to delete extra', err);
                Toast.error('Failed to delete extra');
            },
        });
    };

    const handleUpdateExtraDetails = async () => {
        try {
            const values = await editForm.validateFields();
            updateExtraMutation.mutate(
                { uuid: editingAsset.uuid, quantity: values.quantity, unitPrice: values.unitPrice },
                {
                    onSuccess: () => {
                        Toast.success('Extra updated successfully.');
                        setIsEditModalOpen(false);
                        setEditingAsset(null);
                    },
                    onError: (err) => {
                        console.error('Failed to update extra:', err);
                        Toast.error('Failed to update extra');
                    },
                },
            );
        } catch {
            // validation errors are shown inline
        }
    };

    const applyBulkQuantityToSelected = (formFieldName, selectedDates, quantity) => {
        if (selectedDates.length === 0 || quantity === undefined || quantity === null) return;

        let extraType = 'extra_bed';
        if (formFieldName === 'extraPersonDays') extraType = 'extra_person';
        if (formFieldName === 'babyCotDays') extraType = 'baby_cot';

        const currentGroupValues = form.getFieldValue(formFieldName) || {};
        const updatedGroupValues = { ...currentGroupValues };

        selectedDates.forEach(dateStr => {
            const rateDay = sourceData?.reservationRoomRates?.find(r => r.date === dateStr);
            const alreadyExists = rateDay?.reservationRoomExtras?.some(extra => extra.extraType === extraType);
            const isPastDate = dayjs(dateStr).isBefore(dayjs(), 'day');
            if (!alreadyExists && !isPastDate) updatedGroupValues[dateStr] = quantity;
        });

        form.setFieldsValue({ [formFieldName]: updatedGroupValues });
        if (quantity > 0) setZeroQtyErrors(prev => ({ ...prev, [formFieldName]: false }));
    };

    const handleCloseReset = () => {
        form.resetFields();
        setZeroQtyErrors({});
        setSelectedBedDates([]);
        setSelectedPersonDates([]);
        setSelectedCotDates([]);
        onClose();
    };

    const handleSubmit = async () => {
        try {
            await form.validateFields();

            let hasZeroQuantityError = false;
            const errorFields = {};

            const checkZeroQuantity = (selectedDates, formFieldName) => {
                const groupValues = form.getFieldValue(formFieldName) || {};
                let extraType = 'extra_bed';
                if (formFieldName === 'extraPersonDays') extraType = 'extra_person';
                if (formFieldName === 'babyCotDays') extraType = 'baby_cot';

                for (const dateStr of selectedDates) {
                    const rateDay = sourceData?.reservationRoomRates?.find(r => r.date === dateStr);
                    const alreadyExists = rateDay?.reservationRoomExtras?.some(extra => extra.extraType === extraType);
                    if (!alreadyExists && (groupValues[dateStr] || 0) <= 0) {
                        hasZeroQuantityError = true;
                        errorFields[formFieldName] = true;
                        break;
                    }
                }
            };

            checkZeroQuantity(selectedBedDates, 'extraBedDays');
            checkZeroQuantity(selectedPersonDates, 'extraPersonDays');
            checkZeroQuantity(selectedCotDates, 'babyCotDays');

            if (hasZeroQuantityError) { setZeroQtyErrors(errorFields); return; }
            setZeroQtyErrors({});

            const extras = [];
            const processAmenity = (formFieldName, type) => {
                const groupValues = form.getFieldValue(formFieldName) || {};
                const qtyMap = {};
                dailySchedule.forEach(day => {
                    const qty = groupValues[day.date] || 0;
                    if (qty > 0) {
                        const rateDay = sourceData?.reservationRoomRates?.find(r => r.date === day.date);
                        const alreadyExists = rateDay?.reservationRoomExtras?.some(extra => extra.extraType === type);
                        if (!alreadyExists) {
                            if (!qtyMap[qty]) qtyMap[qty] = [];
                            qtyMap[qty].push(day.date);
                        }
                    }
                });
                Object.keys(qtyMap).forEach(qtyStr => {
                    extras.push({ type, quantity: parseInt(qtyStr, 10), dates: qtyMap[qtyStr] });
                });
            };

            processAmenity('extraBedDays', 'extra_bed');
            processAmenity('extraPersonDays', 'extra_person');
            processAmenity('babyCotDays', 'baby_cot');

            const finalPayload = {
                reservationRoom: { uuid: sourceData?.uuid },
                extras,
            };

            createExtraMutation.mutate(finalPayload, {
                onSuccess: () => {
                    Toast.success('Extra amenities posted successfully.');
                    handleCloseReset();
                },
                onError: (err) => {
                    console.error('Batch deployment failed:', err);
                    Toast.error('Failed to append daily modifications.');
                },
            });
        } catch (err) {
            console.error('Form validation failed:', err);
        }
    };

    // ── Render helpers ────────────────────────────────────────────────────────
    const renderMultiSelectionBlock = (formFieldName, selectedDatesArray, setDatesArray) => {
        const { label, extraType, color, bg, border } = SECTION_CONFIG[formFieldName];

        const hasEditableDates = selectedDatesArray.some(dateStr => {
            const rateDay = sourceData?.reservationRoomRates?.find(r => r.date === dateStr);
            const alreadyExists = rateDay?.reservationRoomExtras?.some(extra => extra.extraType === extraType);
            return !alreadyExists && !dayjs(dateStr).isBefore(dayjs(), 'day');
        });

        const existingCount = dailySchedule.filter(d => {
            const rateDay = sourceData?.reservationRoomRates?.find(r => r.date === d.date);
            return rateDay?.reservationRoomExtras?.some(e => e.extraType === extraType);
        }).length;

        const eligibleDates = dailySchedule.filter(d => {
            const isPastDate = dayjs(d.date).isBefore(dayjs(), 'day');
            const rateDay = sourceData?.reservationRoomRates?.find(r => r.date === d.date);
            const alreadyExists = rateDay?.reservationRoomExtras?.some(extra => extra.extraType === extraType);
            return alreadyExists || !isPastDate;
        });

        return (
            <div style={{
                background: '#ffffff',
                borderRadius: '10px',
                border: '1px solid #e8edf3',
                marginBottom: '16px',
                overflow: 'hidden',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
                {/* Section Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    background: bg,
                    borderBottom: `1px solid ${border}`,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '3px', height: '16px', background: color, borderRadius: '2px' }} />
                        <Text strong style={{ fontSize: '13px', color: '#1e293b' }}>{label}</Text>
                        {existingCount > 0 && (
                            <span style={{
                                fontSize: '10px',
                                fontWeight: 600,
                                color: '#92400e',
                                background: '#fef3c7',
                                border: '1px solid #fde68a',
                                padding: '1px 7px',
                                borderRadius: '10px',
                                letterSpacing: '0.3px',
                            }}>
                                {existingCount}　Days
                            </span>
                        )}
                    </div>
                    <Checkbox
                        checked={selectedDatesArray.length === eligibleDates.length && eligibleDates.length > 0}
                        indeterminate={selectedDatesArray.length > 0 && selectedDatesArray.length < eligibleDates.length}
                        onChange={(e) => {
                            const currentGroupValues = form.getFieldValue(formFieldName) || {};
                            const updatedGroupValues = { ...currentGroupValues };

                            if (e.target.checked) {
                                const newSelected = [];
                                dailySchedule.forEach(d => {
                                    const isPastDate = dayjs(d.date).isBefore(dayjs(), 'day');
                                    const rateDay = sourceData?.reservationRoomRates?.find(r => r.date === d.date);
                                    const alreadyExists = rateDay?.reservationRoomExtras?.some(extra => extra.extraType === extraType);
                                    if (alreadyExists || !isPastDate) {
                                        newSelected.push(d.date);
                                        if (!alreadyExists && !updatedGroupValues[d.date]) {
                                            updatedGroupValues[d.date] = 1;
                                        }
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
                        style={{ fontSize: '12px', color: '#64748b' }}
                    >
                        Select All
                    </Checkbox>
                </div>

                {/* Date Tags & Actions Area */}
                <div style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: hasEditableDates ? '12px' : '0' }}>
                        {dailySchedule.map(day => {
                            const isSelected = selectedDatesArray.includes(day.date);
                            const currentQty = formValues?.[formFieldName]?.[day.date] || 0;
                            const rateDay = sourceData?.reservationRoomRates?.find(r => r.date === day.date);
                            const matchedAsset = rateDay?.reservationRoomExtras?.find(extra => extra.extraType === extraType);
                            const alreadyExists = !!matchedAsset;
                            const isPastDate = dayjs(day.date).isBefore(dayjs(), 'day');
                            const isDisabled = isPastDate || (!alreadyExists && isPastDate);

                            let tagBg, tagBorder, tagColor;
                            if (alreadyExists) {
                                tagBg = '#fffbeb'; tagBorder = '#fbbf24'; tagColor = '#92400e';
                            } else if (isSelected) {
                                tagBg = bg; tagBorder = color; tagColor = color;
                            } else if (currentQty > 0) {
                                tagBg = '#f0f9ff'; tagBorder = '#93c5fd'; tagColor = '#1d4ed8';
                            } else if (isPastDate) {
                                tagBg = '#f9fafb'; tagBorder = '#e5e7eb'; tagColor = '#9ca3af';
                            } else {
                                tagBg = '#ffffff'; tagBorder = '#e2e8f0'; tagColor = '#475569';
                            }

                            return (
                                <div
                                    key={day.date}
                                    onClick={() => !isDisabled && handleDateTagClick(day.date, selectedDatesArray, setDatesArray, formFieldName, extraType, matchedAsset, alreadyExists)}
                                    style={{
                                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                                        opacity: isDisabled ? 0.5 : 1,
                                        userSelect: 'none',
                                        display: 'inline-flex',
                                        flexDirection: 'column',
                                        alignItems: 'stretch',
                                        borderRadius: '8px',
                                        fontSize: '11.5px',
                                        minWidth: alreadyExists ? '148px' : '110px',
                                        border: `1.5px solid ${tagBorder}`,
                                        background: tagBg,
                                        color: tagColor,
                                        fontWeight: alreadyExists || isSelected ? 600 : 400,
                                        overflow: 'hidden',
                                        transition: 'box-shadow 0.15s ease, transform 0.1s ease',
                                        boxShadow: isSelected || alreadyExists ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '5px 9px',
                                        gap: '6px',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            {alreadyExists
                                                ? <CheckCircleFilled style={{ color: '#f59e0b', fontSize: '12px' }} />
                                                : isPastDate
                                                    ? <ClockCircleOutlined style={{ fontSize: '11px', color: '#9ca3af' }} />
                                                    : <CalendarOutlined style={{ fontSize: '11px' }} />
                                            }
                                            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{day.date}</span>
                                            {!alreadyExists && currentQty > 0 && (
                                                <span style={{
                                                    marginLeft: '2px',
                                                    background: color,
                                                    color: '#fff',
                                                    borderRadius: '10px',
                                                    padding: '0 5px',
                                                    fontSize: '10px',
                                                    fontWeight: 700,
                                                }}>
                                                    ×{currentQty}
                                                </span>
                                            )}
                                        </div>

                                        {alreadyExists && !isPastDate && (
                                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                                <EditOutlined
                                                    style={{ color: '#1677ff', cursor: 'pointer', fontSize: '12px' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDateTagClick(day.date, selectedDatesArray, setDatesArray, formFieldName, extraType, matchedAsset, alreadyExists);
                                                    }}
                                                />
                                                <Popconfirm
                                                    title="Delete Extra"
                                                    description="Are you sure to delete this extra?"
                                                    onConfirm={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteExtra(matchedAsset.uuid);
                                                    }}
                                                    onCancel={(e) => e.stopPropagation()}
                                                    okText="Yes"
                                                    cancelText="No"
                                                >
                                                    <DeleteOutlined
                                                        style={{ color: '#ef4444', cursor: 'pointer', fontSize: '12px' }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </Popconfirm>
                                            </div>
                                        )}
                                    </div>

                                    {alreadyExists ? (
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '4px 9px 6px',
                                            borderTop: '1px dashed #fde68a',
                                            gap: '6px',
                                        }}>
                                            <span style={{
                                                background: '#fef3c7',
                                                color: '#b45309',
                                                padding: '1px 6px',
                                                borderRadius: '4px',
                                                fontSize: '10.5px',
                                                fontWeight: 700,
                                                border: '1px solid #fde68a',
                                            }}>
                                                ×{matchedAsset.quantity}
                                            </span>
                                            <span style={{ color: '#b45309', fontSize: '10.5px', fontWeight: 600 }}>
                                                {formatPrice(matchedAsset.unitPrice || matchedAsset.price)} MMK
                                            </span>
                                        </div>
                                    ) : (
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '4px 9px 6px',
                                            borderTop: `1px dashed ${tagBorder}`,
                                            opacity: currentQty > 0 ? 1 : 0.55,
                                            gap: '6px',
                                        }}>
                                            <span style={{ fontSize: '10px', color: currentQty > 0 ? tagColor : undefined, fontWeight: currentQty > 0 ? 600 : 400 }}>
                                                Qty: {currentQty > 0 ? currentQty : '—'}
                                            </span>
                                            <span style={{ fontSize: '10px' }}>MMK: —</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Bulk qty setter */}
                    {hasEditableDates && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            gap: '10px',
                            background: '#f8fafc',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1px dashed #cbd5e1',
                            marginTop: '4px',
                        }}>
                            <div style={{ flex: 1 }}>
                                <Text style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                                    Bulk set quantity for selected dates
                                </Text>
                                <Form.Item
                                    validateStatus={zeroQtyErrors[formFieldName] ? 'error' : ''}
                                    help={zeroQtyErrors[formFieldName] ? '⚠ Quantity is required for selected dates' : ''}
                                    style={{ marginBottom: 0 }}
                                >
                                    <InputNumber
                                        min={1}
                                        defaultValue={1}
                                        placeholder="Enter quantity"
                                        style={{ width: '180px', borderRadius: '6px' }}
                                        onChange={(val) => applyBulkQuantityToSelected(formFieldName, selectedDatesArray, val)}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const hasAnyNewDate = (datesArray, extraType) =>
        datesArray.some(dateStr => {
            const rateDay = sourceData?.reservationRoomRates?.find(r => r.date === dateStr);
            const alreadyExists = rateDay?.reservationRoomExtras?.some(extra => extra.extraType === extraType);
            return !alreadyExists && !dayjs(dateStr).isBefore(dayjs(), 'day');
        });

    const isSaveEnabled =
        hasAnyNewDate(selectedBedDates, 'extra_bed') ||
        hasAnyNewDate(selectedPersonDates, 'extra_person') ||
        hasAnyNewDate(selectedCotDates, 'baby_cot');

    const isAnythingPending =
        createExtraMutation.isPending ||
        updateExtraMutation.isPending ||
        deleteExtraMutation.isPending;

    // ── JSX ───────────────────────────────────────────────────────────────────
    return (
        <>
            {/* Primary Modal */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '4px', height: '20px', background: 'linear-gradient(180deg,#1677ff,#6366f1)', borderRadius: '3px' }} />
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a', lineHeight: 1.3 }} className={textColorDarkMode}>
                                Extra Bed, Person & Baby Cot
                            </div>
                            <div style={{ fontWeight: 400, fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>
                                Select dates and set quantities per type
                            </div>
                        </div>
                    </div>
                }
                open={isOpen}
                onCancel={handleCloseReset}
                width={780}
                destroyOnClose
                styles={{
                    header: { paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' },
                    body: {
                        maxHeight: 'calc(100vh - 260px)',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        paddingRight: '8px',
                        paddingBottom: '8px'
                    }
                }}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '4px 0' }}>
                        <Button
                            disabled={isAnythingPending}
                            onClick={handleCloseReset}
                            style={{ borderRadius: '7px', padding: '0 18px' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            disabled={!isSaveEnabled || isAnythingPending}
                            loading={createExtraMutation.isPending}
                            onClick={handleSubmit}
                            style={{
                                borderRadius: '7px',
                                padding: '0 22px',
                                background: (!isSaveEnabled || isAnythingPending) ? undefined : '#1677ff',
                                fontWeight: 600,
                            }}
                        >
                            Save Changes
                        </Button>
                    </div>
                }
            >
                {/* Guest & Room info bar */}
                <div
                    style={{
                        display: 'flex',
                        gap: '16px',
                        background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        margin: '4px 0 16px 0',
                        border: '1px solid #e0e7ff',
                        fontSize: '12.5px',
                    }}
                    className={darkModeStyle}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#3730a3' }}>
                        <UserOutlined style={{ fontSize: '13px' }} />
                        <span style={{ color: '#64748b' }}>Guest:</span>
                        <strong style={{ color: '#1e293b' }}>{guestName}</strong>
                    </div>
                    <div style={{ width: '1px', background: '#c7d2fe' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#3730a3' }}>
                        <HomeOutlined style={{ fontSize: '13px' }} />
                        <span style={{ color: '#64748b' }}>Room Type:</span>
                        <strong style={{ color: '#1e293b' }}>{currentRoomType}</strong>
                    </div>
                </div>

                <Form form={form} layout="vertical">
                    {isLoading ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0' }}>
                            <Loader />
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {renderMultiSelectionBlock('extraBedDays', selectedBedDates, setSelectedBedDates)}
                            {renderMultiSelectionBlock('extraPersonDays', selectedPersonDates, setSelectedPersonDates)}
                            {renderMultiSelectionBlock('babyCotDays', selectedCotDates, setSelectedCotDates)}
                        </div>
                    )}
                </Form>
            </Modal>

            {/* Edit Modal */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '4px', height: '18px', background: '#f59e0b', borderRadius: '3px' }} />
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>Modify Extra</div>
                            <div style={{ fontWeight: 400, fontSize: '11px', color: '#94a3b8' }}>Update quantity and unit price</div>
                        </div>
                    </div>
                }
                open={isEditModalOpen}
                width={380}
                zIndex={1050}
                onCancel={() => { setIsEditModalOpen(false); setEditingAsset(null); }}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <Button disabled={updateExtraMutation.isPending} onClick={() => setIsEditModalOpen(false)} style={{ borderRadius: '7px' }}>
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            loading={updateExtraMutation.isPending}
                            onClick={handleUpdateExtraDetails}
                            style={{ borderRadius: '7px', fontWeight: 600, background: '#f59e0b', borderColor: '#f59e0b' }}
                        >
                            Update
                        </Button>
                    </div>
                }
            >
                <div style={{ padding: '12px 0' }}>
                    <Form form={editForm} layout="vertical">
                        <Form.Item
                            label={<Text style={{ fontSize: '13px', fontWeight: 600 }}>Quantity</Text>}
                            name="quantity"
                            rules={[{ required: true, message: 'Quantity is required' }]}
                        >
                            <InputNumber min={1} style={{ width: '100%', borderRadius: '7px' }} placeholder="Enter quantity" />
                        </Form.Item>
                        <Form.Item
                            label={<Text style={{ fontSize: '13px', fontWeight: 600 }}>Unit Price <span style={{ color: '#94a3b8', fontWeight: 400 }}>(MMK)</span></Text>}
                            name="unitPrice"
                            rules={[{ required: true, message: 'Unit price is required' }]}
                        >
                            <InputNumber min={0} style={{ width: '100%', borderRadius: '7px' }} placeholder="Enter unit price" />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </>
    );
};

export default AddExtraAmenitiesModal;