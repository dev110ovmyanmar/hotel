import React, { useState } from 'react';
import { Modal, Form, Input, Descriptions, Button, Divider, Space } from 'antd';
import dayjs from 'dayjs';
import { ArrowRightOutlined, CheckCircleOutlined, PlusOutlined, MinusOutlined, WarningOutlined } from '@ant-design/icons';
import { createRoomAmendment } from '../../../../../../api/roomAmendmentApi';
import { useApiMutation } from '../../../../../../hooks/useApiMutation';
import Toast from '../../../../../../component/Toast/Toast';
import AddRoomExtensionLikeUpgradeDesignModal from './AddRoomExtensionLikeUpgradeDesignModal';

export default function AddRoomWithExtensionDateModal({ 
    isOpen,
    extensionDateonClose,
    record,
    addRoomUuid,
    availabilitySearchs,
    reservation,
    ratePlanUuid
}) {
    const [form] = Form.useForm();

    // States for step navigation and submission
    const [currentStep, setCurrentStep] = useState('form');
    const [daysToAdd, setDaysToAdd] = useState(1);
    const [pendingValues, setPendingValues] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availabilitySearchRoomList, setAvailabilitySearchRoomList] = useState(false);
    const [backToExtensionStayDate,setBackToExtensionStayDate] = useState(false);

    // Parse baseline properties out of your JSON structure
    const reservationNo = reservation?.reservationNo || `ID-${record?.id}`;
    const guestName = reservation?.guest?.name || "Unknown Guest";

    const originalCheckin = record?.checkinDate ? dayjs(record.checkinDate) : "";
    const originalCheckout = record?.checkoutDate ? dayjs(record.checkoutDate) : "";

    const maxDayExtension = record?.maxExtend !== undefined ? Number(record.maxExtend) : 0;

    // Compute live mathematical timeline additions safely
    const newCheckoutDate = originalCheckout ? originalCheckout?.add(daysToAdd, 'day') : dayjs();

    const totalNights = newCheckoutDate.diff(originalCheckout, "day", true);

    const handleAvailabilitySearchs = () => {
        const payload = {
            filter: {
                checkinDate: originalCheckout?.format('YYYY-MM-DD'),
                checkoutDate: newCheckoutDate?.format('YYYY-MM-DD'),
            },
            totalNight: totalNights,
            reservation: {
                uuid: reservation?.uuid
            }
        };
        availabilitySearchs.mutate(payload, {
            onSuccess: () => {
                setAvailabilitySearchRoomList(true);
                // onClose(false)
                setBackToExtensionStayDate(false)
            }
        })
    }

    const handleCloseReset = () => {
        form.resetFields();
        setDaysToAdd(1);
        setCurrentStep('form');
        setPendingValues(null);
        extensionDateonClose(false);
    };

    return (
        <>
            {
                (availabilitySearchRoomList || !backToExtensionStayDate) &&
                <AddRoomExtensionLikeUpgradeDesignModal
                    isOpen={availabilitySearchRoomList}
                    onClose={() => setAvailabilitySearchRoomList(false)}
                    record={record}
                    addRoomUuid={addRoomUuid}
                    roomList={availabilitySearchs?.data}
                    availabilitySearchsPendings={availabilitySearchs?.isPending}
                    originalCheckout={originalCheckout}
                    newCheckoutDate={newCheckoutDate}
                    ratePlanUuid={ratePlanUuid}
                    setBackToExtensionStayDate={setBackToExtensionStayDate}
                    extensionDateonClose={extensionDateonClose}
                />
            }

            {
                (!availabilitySearchRoomList || backToExtensionStayDate) &&
                <Modal
                    title={
                        currentStep === 'form'
                            ? "Extend Stay Duration"
                            : <span className="flex items-center gap-2"><CheckCircleOutlined className="text-green-500" /> Review Stay Extension Summary</span>
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
                                onClick={handleAvailabilitySearchs}
                                disabled={maxDayExtension <= 0}
                                loading={availabilitySearchs?.isPending}
                            >
                                Next
                            </Button>
                        ] : [
                            <Button key="back-to-form" disabled={isSubmitting} onClick={() => setCurrentStep('form')}>Modify Extension</Button>,
                            <Button key="confirm" type="primary" loading={isSubmitting} onClick={handleFinalCommit}>Confirm Extension</Button>
                        ]
                    }
                >
                    {/* Context Target Ribbon Header */}
                    <div className="mb-4 text-slate-500 text-sm font-medium">
                        {reservationNo} — <span className="text-slate-800">{guestName}</span>
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
                                <div className="bg-slate-50 p-4 rounded-lg mb-5">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-medium text-slate-600">
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
                                        <span className="text-sm text-slate-500 font-medium">
                                            Extra Day(s)
                                        </span>
                                    </Space>
                                </div>
                            )}

                            {/* Timeline Data Footer */}
                            <div className="bg-slate-50 p-3 px-4 rounded-lg mb-5 border border-slate-200">
                                <div className="text-xs text-slate-500">
                                    Current Checkout <strong className="text-slate-700">{originalCheckout ? originalCheckout?.format('DD MMM YYYY') : '-'}</strong>
                                </div>
                                {maxDayExtension !== 0 && (
                                    <div className="text-sm text-blue-600 mt-1">
                                        New Checkout <strong className="text-blue-700">{newCheckoutDate.format('DD MMM YYYY')}</strong>
                                    </div>
                                )}
                            </div>

                        </Form>
                    )}
                </Modal>
            }
        </>
    );
}