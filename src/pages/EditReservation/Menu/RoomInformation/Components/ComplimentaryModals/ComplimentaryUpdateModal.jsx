import React, { useEffect, useState, useMemo } from 'react';
import { useApiMutation } from '../../../../../../hooks/useApiMutation';
import { complimentaryUpdate } from '../../../../../../api/reservationSectionApi';
import { queryClient } from '../../../../../../app/queryClient';
import { Button, Checkbox, Form, Select } from 'antd';
import Modal from 'antd/es/modal/Modal';
import Toast from '../../../../../../component/Toast/Toast';
import useApiQuery from '../../../../../../hooks/useApiQuery';
import { reservationRoomList } from '../../../../../../api/reservationSectionApi';
import { darkModeStyle, textColorDarkMode, textWhiteInDarkStyle } from '../../../../../../utils';

const ComplimentaryUpdateModal = ({
    open,
    onCancel,
    bookingUuid,
}) => {
    const initData = queryClient.getQueryData(["initData", "authenticated"]);
    const complimentaryStatuses = initData?.statuses?.complimentary_status;
    const [reservationRooms, setReservationRooms] = useState([]);
    const [roomAllocations, setRoomAllocations] = useState([]);
    const [selectedStatusUuid, setSelectedStatusUuid] = useState("");
    const [form] = Form.useForm();

    const { data: reservationRoomsForComplimentary, isLoading: complimentaryLoading } = useApiQuery({
        fetchQueryName: "reservation-room-comp",
        fetchQueryFunction: reservationRoomList,
        params: {
            reservationRoom: {
                uuid: bookingUuid,
            },
        },
        options: {
            enabled: !!bookingUuid && open,
        },
    });

    const upcomingReservations = useMemo(() => {
        return (reservationRoomsForComplimentary?.data || []).filter((item) => {
            const checkin = new Date(item.checkinDate);
            checkin.setHours(0, 0, 0, 0);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            return checkin >= today && (item.roomStatus?.code == "confirmed" || item.roomStatus?.code == "checked_in");
        });
    }, [reservationRoomsForComplimentary?.data]);

    useEffect(() => {
        if (open && !complimentaryLoading && Array.isArray(complimentaryStatuses) && complimentaryStatuses.length > 0 && !selectedStatusUuid) {
            if (upcomingReservations?.[0]?.complimentaryStatus) {
                const currentStatus = complimentaryStatuses.find(s => s.uuid === upcomingReservations?.[0]?.complimentaryStatus?.uuid);
                if (currentStatus) {
                    setSelectedStatusUuid(currentStatus.uuid);
                    form.setFieldsValue({ statusUuid: currentStatus.uuid });
                }
            } else {
                const defaultStatus = complimentaryStatuses[0];
                setSelectedStatusUuid(defaultStatus.uuid);
                form.setFieldsValue({ statusUuid: defaultStatus.uuid });
            }
        }
    }, [open, complimentaryLoading, complimentaryStatuses, selectedStatusUuid, form, upcomingReservations]);

    // Centralized Clean Up and Close Handler
    const handleClose = () => {
        setRoomAllocations([]);
        setSelectedStatusUuid("");
        form.resetFields();
        onCancel(); // Trigger original parent onCancel action
    };

    useEffect(() => {
        if (open) {
            const reservationRoomListing = upcomingReservations || [];
            setReservationRooms(reservationRoomListing);

            const initialAllocations = reservationRoomListing.map(roomData => {
                const nights = roomData.rates || [];
                const initialCompDates = nights.filter(n => n.isComplimentary).map(n => n.date);

                return {
                    roomInfo: {
                        id: roomData.id,
                        uuid: roomData.uuid,
                        number: roomData.room?.roomNo || "-",
                        type: roomData.roomType?.name || "Unknown Room Type",
                        isComplimentary: roomData?.isComplimentary,
                    },
                    ratePlan: roomData.ratePlan || { name: 'Unknown', code: 'N/A', channelVisibility: {} },
                    nights: nights,
                    compDates: initialCompDates
                };
            });
            setRoomAllocations(initialAllocations);
        }
    }, [upcomingReservations, open]);

    // Toggle specific date within a specific room sequence block
    const handleToggleDate = (roomIndex, dateString) => {
        setRoomAllocations(prev => prev.map((item, idx) => {
            if (idx !== roomIndex) return item;

            const isComp = item.compDates.includes(dateString);
            const updatedCompDates = isComp
                ? item.compDates.filter(d => d !== dateString)
                : [...item.compDates, dateString];

            return { ...item, compDates: updatedCompDates };
        }));
    };

    // Toggle all eligible dates for a specific room
    const handleToggleAllDates = (roomIndex, checked) => {
        setRoomAllocations(prev => prev.map((item, idx) => {
            if (idx !== roomIndex) return item;

            if (checked) {
                const allDates = item.nights.map(n => n.date);
                return { ...item, compDates: allDates };
            } else {
                return { ...item, compDates: [] };
            }
        }));
    };

    const calculateRowTotal = (nights = [], compDates = []) => {
        let gross = 0;
        let savings = 0;

        nights.forEach(n => {
            const priceVal = parseFloat(n?.originalPrice) || 0;
            gross += priceVal;
            if (compDates.includes(n.date)) {
                savings += priceVal;
            }
        });

        return { gross, savings, net: gross - savings };
    };

    const updateComplimentaryMutation = useApiMutation({
        mutationFn: complimentaryUpdate,
        invalidateKeys: [["reservation-room"], ["reservation-room-comp"]],
    });

    const handleSave = async () => {
        try {
            await form.validateFields();
        } catch (error) {
            return;
        }

        const payload = {
            complimentaryStatus: {
                uuid: selectedStatusUuid
            },
            reservationRooms: (roomAllocations || []).map(room => ({
                uuid: room.roomInfo.uuid,
                dates: room.compDates
            }))
        };

        updateComplimentaryMutation.mutate(payload, {
            onSuccess: (data) => {
                Toast.success(data?.response || "Complimentary updated successfully.");
                handleClose(); // Use handleClose here to execute state resets cleanly
            },
            onError: (error) => {
                Toast.error("Failed to update complimentary status.");
                console.error(error);
            }
        });
    };

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            footer={[
                <Button key="back" onClick={handleClose}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={updateComplimentaryMutation.isPending}
                    onClick={handleSave}
                >
                    Save Updates
                </Button>
            ]}
            width={800}
            styles={{
                content: { backgroundColor: '#f1f5f9', borderRadius: '1rem', padding: '24px' }
            }}
        >
            <div className="text-slate-800 font-sans">
                <div className="mb-6 flex flex-col gap-3">
                    <div>
                        <h2 className="text-base font-bold text-slate-900 dark:!text-gray-200">Complimentary Offer</h2>
                    </div>

                    {Array.isArray(complimentaryStatuses) && complimentaryStatuses.length > 0 && (
                        <Form form={form} layout="vertical">
                            <Form.Item
                                name="statusUuid"
                                className='!mt-5 mb-0'
                                label={<span className={`text-sm font-semibold text-slate-700 ${textWhiteInDarkStyle}`}>Complimentary Reason:</span>}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select a status",
                                    },
                                ]}
                            >
                                <Select
                                    options={complimentaryStatuses.map(status => ({
                                        value: status.uuid,
                                        label: status.name
                                    }))}
                                    onChange={(value) => setSelectedStatusUuid(value)}
                                    placeholder="Select Status"
                                    style={{ minWidth: 200 }}
                                />
                            </Form.Item>
                        </Form>
                    )}
                </div>

                <div className="space-y-6 max-h-[55vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300">
                    {(roomAllocations || []).map((allocation, roomIdx) => {
                        const { gross, savings, net } = calculateRowTotal(allocation.nights, allocation.compDates);
                        const allNights = allocation.nights || [];
                        const isAllSelected = allNights.length > 0 && allNights.every(n => allocation.compDates.includes(n.date));
                        const isIndeterminate = !isAllSelected && allocation.compDates.length > 0;

                        return (
                            <div key={allocation.roomInfo.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                                {/* Header section */}
                                <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-slate-100 mb-4">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`bg-slate-100 font-mono text-xs px-2 py-0.5 rounded text-slate-700 border border-slate-200 font-bold ${darkModeStyle}`}>
                                                Room - {allocation.roomInfo.number}
                                            </span>
                                            <h3 className={`text-sm font-bold text-slate-900 ${textWhiteInDarkStyle}`}>{allocation.roomInfo.type}</h3>
                                        </div>
                                        <div className="flex items-center">
                                            <span className={`text-[10px] bg-slate-50 text-slate-500 border border-slate-100 px-2 py-0.5 rounded font-medium ${darkModeStyle}`}>
                                                🏷️ {allocation.ratePlan.name} ({allocation.ratePlan.code})
                                            </span>
                                        </div>
                                    </div>

                                    {/* Subtotal metrics display */}
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-tight">Net Amount</span>
                                        <span className="text-lg font-black text-emerald-600 leading-none">
                                            {net.toLocaleString()} MMK
                                        </span>
                                    </div>
                                </div>

                                {/* Date Selection Header */}
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                        🗓️ Stay Dates
                                    </h4>
                                    {allNights.length > 0 && (
                                        <div className={`bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors px-3 py-1.5 rounded-md flex items-center ${darkModeStyle}`}>
                                            <Checkbox
                                                checked={isAllSelected}
                                                indeterminate={isIndeterminate}
                                                onChange={(e) => handleToggleAllDates(roomIdx, e.target.checked)}
                                                className="text-xs font-semibold text-slate-700"
                                            >
                                                Mark All Dates as Complimentary
                                            </Checkbox>
                                        </div>
                                    )}
                                </div>

                                {/* Horizontal scroll grid loop */}
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300">
                                    {allNights.map((night) => {
                                        const isComp = allocation.compDates.includes(night.date);
                                        const displayValue = isComp ? 0 : parseFloat(night.originalPrice);

                                        return (
                                            <button
                                                type="button"
                                                key={night.date}
                                                onClick={() => handleToggleDate(roomIdx, night.date)}
                                                className={`flex-none w-28 p-2.5 rounded-lg border text-left transition-all ${isComp
                                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-xs'
                                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100/70'
                                                    }
                                                    ${darkModeStyle}
                                                    `}
                                            >
                                                <span className="text-[9px] block text-slate-400 font-semibold">
                                                    {night.date}
                                                </span>
                                                <span className={`text-xs font-bold block mt-0.5 ${isComp ? `text-emerald-600` : `text-slate-800 ${textWhiteInDarkStyle}`}`}>
                                                    {displayValue.toLocaleString()} MMK
                                                </span>
                                                <span className="text-[8px] block mt-1 font-medium opacity-70">
                                                    {isComp ? '🎁 Waived' : 'Available'}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Modal>
    );
}

export default ComplimentaryUpdateModal;