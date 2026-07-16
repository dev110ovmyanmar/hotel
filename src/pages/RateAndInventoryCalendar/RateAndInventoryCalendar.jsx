import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { App, Form, Spin, Divider, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { getCalendarData } from '../../api/rateAndInventoryCalendarApi';
import { roomMeta } from '../../api/roomApi';
import useApiQuery from '../../hooks/useApiQuery';
import Loader from '../../component/Loader/Loader';
import { updateStopSell, updateAvailabilityCalendar } from '../../api/availabilityCalendarApi';
import { upsertRoomRestriction, roomRestrictionStopSell } from '../../api/roomrestriction';
import { useApiMutation } from '../../hooks/useApiMutation';
import Toast from '../../component/Toast/Toast';
import { queryClient } from '../../app/queryClient';

import CalendarHeader from './components/CalendarHeader';
import CalendarTableHeader from './components/CalendarTableHeader';
import RoomTypeGroup from './components/RoomTypeGroup';
import CalendarFooter from './components/CalendarFooter';
import RateInventoryModal from './components/RateInventoryModal';
import RestrictionEditModal from './components/RestrictionEditModal';

// ─── Constants ───────────────────────────────────────────────────────────────
const DEFAULT_AVAILABILITY = { totalRooms: 0, sold: 0, available: 0, stopSell: false };
const CELL_WIDTH = 100;
const SIDEBAR_WIDTH = 220;
const STALE_TIME = 5 * 60 * 1000;
const GC_TIME = 10 * 60 * 1000;

// ─── Component ───────────────────────────────────────────────────────────────
const RateAndInventoryCalendar = () => {
    // ── UI state ──────────────────────────────────────────────────────────────
    const { modal } = App.useApp();
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [expandedGroups, setExpandedGroups] = useState(new Set());
    const [keyword, setKeyword] = useState('');
    const [filters, setFilters] = useState({ roomType: null, floor: null, ratePlan: null });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCell, setSelectedCell] = useState(null);
    const [editingCell, setEditingCell] = useState(null);
    const [restrictionEditModal, setRestrictionEditModal] = useState(null);
    const [loadingStates, setLoadingStates] = useState({ stopSell: {}, availability: {} });

    const [restrictionForm] = Form.useForm();
    const gridRef = useRef(null);

    // ── Derived ───────────────────────────────────────────────────────────────
    const month = useMemo(() => currentDate.format('YYYY-MM'), [currentDate]);

    // ── API ───────────────────────────────────────────────────────────────────
    const calendarParams = useMemo(() => ({
        month,
        keyword,
        roomType: filters.roomType ? { uuid: filters.roomType } : null,
        Floor: filters.floor ? { uuid: filters.floor } : null,
        ratePlan: filters.ratePlan ? { uuid: filters.ratePlan } : null,
    }), [month, keyword, filters]);

    const { data: apiData, isLoading, isFetching } = useApiQuery({
        fetchQueryName: 'rateInventoryCalendar',
        fetchQueryFunction: getCalendarData,
        params: calendarParams,
        options: {
            // staleTime: STALE_TIME,
            // gcTime: GC_TIME,
            placeholderData: (prev) => prev,
        },
    });

    const { data: roomMetaData } = useApiQuery({
        fetchQueryName: "room-meta",
        fetchQueryFunction: roomMeta,
    });

    const roomTypeOptions = roomMetaData?.room_types?.map((roomType) => ({
        value: roomType.uuid,
        label: roomType.name,
    }));

    const floorOptions = roomMetaData?.floors?.map((floor) => ({
        value: floor.uuid,
        label: <span>{floor?.name} ({floor?.floorNo})</span>
    }));

    const ratePlanOptions = roomMetaData?.rate_plans?.map((ratePlan) => ({
        value: ratePlan.uuid,
        label: ratePlan.name,
    }));

    const updateStopSelling = useApiMutation({ mutationFn: updateStopSell, invalidateKeys: [] });
    const updateRoomInventory = useApiMutation({ mutationFn: updateAvailabilityCalendar, invalidateKeys: [] });
    const editRoomRestriction = useApiMutation({ mutationFn: upsertRoomRestriction, invalidateKeys: [] });
    const updateRoomRestrictionStopSell = useApiMutation({ mutationFn: roomRestrictionStopSell, invalidateKeys: [] });

    // ── Derived data from API ─────────────────────────────────────────────────
    const roomTypes = useMemo(() => apiData?.roomTypes ?? [], [apiData]);

    /** { [rtId]: { [dateStr]: { availability, rateMap: { [rateId]: rate } } } } */
    const rtDateMap = useMemo(() => {
        const map = {};
        roomTypes.forEach((rt) => {
            map[rt.id] = {};
            (rt.dates ?? []).forEach((d) => {
                const rateMap = {};
                (d.rates ?? []).forEach((r) => { rateMap[r.id] = r; });
                map[rt.id][d.date] = { availability: d.availability, rateMap };
            });
        });
        return map;
    }, [roomTypes]);

    /** { [roomId]: { [dateStr]: { isBooked, isAvailable } } } */
    const roomDateMap = useMemo(() => {
        const map = {};
        roomTypes.forEach((rt) => {
            (rt.rooms ?? []).forEach((room) => {
                map[room.id] = {};
                (room.dates ?? []).forEach((d) => {
                    map[room.id][d.date] = { isBooked: d.isBooked, isAvailable: d.isAvailable };
                });
            });
        });
        return map;
    }, [roomTypes]);

    const todayStr = useMemo(() => dayjs().format('YYYY-MM-DD'), []);

    const days = useMemo(() => {
        const start = currentDate.startOf('month');
        return Array.from({ length: start.daysInMonth() }, (_, i) => start.add(i, 'day'));
    }, [currentDate]);

    /** Pre-computed per-day metadata — avoids repeated format/isBefore calls in cells */
    const daysMeta = useMemo(() => {
        const today = dayjs();
        return days.map((day) => {
            const dateStr = day.format('YYYY-MM-DD');
            return {
                day,
                dateStr,
                isPast: day.isBefore(today, 'day'),
                isToday: dateStr === todayStr,
                cellClass:
                    dateStr === todayStr
                        ? 'bg-[#E6F4FF] border-r-2 border-r-[#91CAFF] border-l-2 border-l-[#91CAFF]'
                        : 'bg-[#fcfcfc] border-r',
            };
        });
    }, [days, todayStr]);

    // ── Effects ───────────────────────────────────────────────────────────────

    // Expand first 2 room types when data loads
    // useEffect(() => {
    //     if (roomTypes.length > 0) {
    //         setExpandedGroups(new Set(roomTypes.slice(0, 2).map((rt) => rt.id)));
    //     }
    // }, [roomTypes]);

    // Auto-scroll to today on initial load
    useEffect(() => {
        if (!isLoading && gridRef.current && currentDate.isSame(dayjs(), 'month')) {
            const todayIdx = dayjs().date() - 1;
            setTimeout(() => {
                gridRef.current?.scrollTo({
                    left: Math.max(0, todayIdx * CELL_WIDTH - CELL_WIDTH),
                    behavior: 'smooth',
                });
            }, 100);
        }
    }, [isLoading, currentDate]);

    // ── Callbacks ─────────────────────────────────────────────────────────────

    const toggleGroup = useCallback((id) => {
        setExpandedGroups((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }, []);

    const getAvailability = useCallback(
        (rtId, dateStr) => rtDateMap[rtId]?.[dateStr]?.availability ?? DEFAULT_AVAILABILITY,
        [rtDateMap]
    );

    const getRateData = useCallback(
        (rtId, ratePlanId, dateStr) => rtDateMap[rtId]?.[dateStr]?.rateMap?.[ratePlanId] ?? null,
        [rtDateMap]
    );

    const handleConfirmStopSell = useCallback(
        (newStopSellValue, availableUuid, rtId) => {
            setLoadingStates((prev) => ({
                ...prev,
                stopSell: { ...prev.stopSell, [availableUuid]: true },
            }));
            updateStopSelling.mutate({ uuid: availableUuid, stopSell: newStopSellValue }, {
                onSuccess: () => {
                    queryClient.setQueriesData({ queryKey: ['rateInventoryCalendar'] }, (old) => {
                        if (!old) return old;
                        return {
                            ...old,
                            roomTypes: old.roomTypes.map((rt) =>
                                rt.id === rtId
                                    ? {
                                        ...rt,
                                        dates: rt.dates.map((d) =>
                                            d.availability?.uuid === availableUuid
                                                ? { ...d, availability: { ...d.availability, stopSell: newStopSellValue } }
                                                : d
                                        ),
                                    }
                                    : rt
                            ),
                        };
                    });
                    Toast.success('Stop Selling Updated Successfully!');
                },
                onSettled: () => {
                    setLoadingStates((prev) => {
                        const { [availableUuid]: _, ...rest } = prev.stopSell;
                        return { ...prev, stopSell: rest };
                    });
                },
            });
        },
        [updateStopSelling, month]
    );

    const handleStopSellToggle = useCallback(
        (rtId, dateStr, stopSellValue, availUuid) => {
            const newStopSellValue = !stopSellValue;
            const roomType = roomTypes.find(r => r.id === rtId);
            const rtName = roomType?.name || 'this room type';
            const formattedDate = dayjs(dateStr).format('D MMM YYYY');

            Modal.confirm({
                rootClassName: "dark-confirm-modal",
                icon: null,
                title: (
                    <div className="flex justify-between items-center w-full">
                        <span className="text-[16px] font-bold dark:!text-gray-100">
                            {stopSellValue ? 'Open sales for this room type?' : 'Stop sell for this room type?'}
                        </span>
                    </div>
                ),
                closable: true,
                content: (
                    <div className="mt-[-20px]">
                        <Divider className="my-3 border-gray-200" />
                        <div className="text-[14px] text-gray-600 dark:!text-gray-100">
                            {stopSellValue
                                ? <span>This will open all availability for <strong>{rtName}</strong> on <strong>{formattedDate}</strong>. Guests will now be able to book this date.</span>
                                : <span>This will remove all availability for <strong>{rtName}</strong> on <strong>{formattedDate}</strong>. Guests will no longer be able to book this date.</span>
                            }
                        </div>
                        <Divider className="my-3 border-gray-200" />
                    </div>
                ),
                okText: 'Save',
                cancelText: 'Cancel',
                okButtonProps: { type: 'primary', className: 'px-6' },
                cancelButtonProps: { className: 'bg-gray-100 border-none' },
                centered: true,
                width: 440,
                onOk: () => handleConfirmStopSell(newStopSellValue, availUuid, rtId),
            });
        },
        [handleConfirmStopSell]
    );

    const handleAvailableUpdate = useCallback(
        (rtId, uuid, value, totalRooms) => {
            const parsed = parseInt(value, 10);
            if (isNaN(parsed) || parsed < 0) {
                setEditingCell(null);
                return;
            }
            if (totalRooms != null && parsed > totalRooms) {
                setEditingCell(null);
                return;
            }
            Modal.confirm({
                rootClassName: "dark-confirm-modal",
                icon: null,
                title: (
                    <div className="flex justify-between items-center w-full">
                        <span className="text-[16px] font-bold">Confirm Availability Change</span>
                    </div>
                ),
                closable: true,
                content: (
                    <div className="mt-[-20px]">
                        <Divider className="my-3 border-gray-200" />
                        <div className="text-[14px] text-gray-600">
                            {`Are you sure you want to update available rooms to `}<strong>{parsed}</strong>{`?`}
                        </div>
                        <Divider className="my-3 border-gray-200" />
                    </div>
                ),
                okText: 'Save',
                cancelText: 'Cancel',
                okButtonProps: { type: 'primary', className: 'px-6' },
                cancelButtonProps: { className: 'bg-gray-100 border-none' },
                centered: true,
                width: 440,
                onOk: () => {
                    setLoadingStates((prev) => ({
                        ...prev,
                        availability: { ...prev.availability, [uuid]: true },
                    }));
                    updateRoomInventory.mutate({ uuid, availableRooms: parsed }, {
                        onSuccess: () => {
                            queryClient.setQueriesData({ queryKey: ['rateInventoryCalendar'] }, (old) => {
                                if (!old) return old;
                                return {
                                    ...old,
                                    roomTypes: old.roomTypes.map((rt) =>
                                        rt.id === rtId
                                            ? {
                                                ...rt,
                                                dates: rt.dates.map((d) =>
                                                    d.availability?.uuid === uuid
                                                        ? { ...d, availability: { ...d.availability, available: parsed } }
                                                        : d
                                                ),
                                            }
                                            : rt
                                    ),
                                };
                            });
                            Toast.success('Availability Updated Successfully!');
                            setEditingCell(null);
                        },
                        onSettled: () => {
                            setLoadingStates((prev) => {
                                const { [uuid]: _, ...rest } = prev.availability;
                                return { ...prev, availability: rest };
                            });
                        },
                    });
                },
                onCancel: () => setEditingCell(null),
            });
        },
        [updateRoomInventory, month]
    );

    const handleCellClick = useCallback(
        (rt, dateStr) => {
            const avail = getAvailability(rt.id, dateStr);
            setSelectedCell({
                roomTypeName: rt.name,
                date: dayjs(dateStr).format('DD.MM.YYYY'),
                dateStr,
                isPast: dayjs(dateStr).isBefore(dayjs(), 'day'),
                rtId: rt.id,
                rtUuid: rt.uuid,
                availability: avail,
                ratePlans: (rt.ratePlans ?? []).map((rp) => {
                    const rateData = getRateData(rt.id, rp.id, dateStr);
                    return {
                        id: rp.id,
                        name: rp.name,
                        ratePlanUuid: rp.uuid,
                        price: rateData?.price ?? null,
                        extraBed: rateData?.extraBed ?? null,
                        restriction: rateData?.restriction ?? null,
                    };
                }),
            });
            setIsModalOpen(true);
        },
        [getAvailability, getRateData]
    );

    const handleRestrictionEditOpen = useCallback(
        (restriction, rp, rt, dateStr, isViewMode = false, isPast = false) => {
            const vals = {
                uuid: restriction?.uuid ?? null,
                roomTypeUuid: rt.uuid,
                ratePlanUuid: rp.uuid,
                roomTypeName: rt.name,
                ratePlanName: rp.name,
                dateStr,
                minStay: restriction?.minStay ?? 0,
                maxStay: restriction?.maxStay ?? 0,
                closedToArrival: !!restriction?.cta,
                closedToDeparture: !!restriction?.ctd,
                stopSell: !!restriction?.stopSell,
                isViewMode,
                isPast,
            };
            setRestrictionEditModal(vals);
            restrictionForm.setFieldsValue({
                minStay: vals.minStay,
                maxStay: vals.maxStay,
                closedToArrival: vals.closedToArrival,
                closedToDeparture: vals.closedToDeparture,
                stopSell: vals.stopSell,
            });
        },
        [restrictionForm]
    );

    const handleRestrictionEditFinish = useCallback(
        (values) => {
            const { roomTypeUuid, ratePlanUuid, dateStr, uuid } = restrictionEditModal;
            const payload = {
                ...values,
                roomType: { uuid: roomTypeUuid },
                ratePlan: { uuid: ratePlanUuid },
                date: dateStr,
                uuid,
            };
            editRoomRestriction.mutate(payload, {
                onSuccess: (responseData) => {
                    queryClient.setQueriesData({ queryKey: ['rateInventoryCalendar'] }, (old) => {
                        if (!old) return old;
                        return {
                            ...old,
                            roomTypes: old.roomTypes.map((rt) =>
                                rt.uuid === roomTypeUuid
                                    ? {
                                        ...rt,
                                        dates: rt.dates.map((d) =>
                                            d.date === dateStr
                                                ? {
                                                    ...d,
                                                    rates: d.rates.map((r) =>
                                                        r.uuid === ratePlanUuid
                                                            ? {
                                                                ...r,
                                                                restriction: {
                                                                    uuid: responseData?.uuid ?? uuid,
                                                                    minStay: values.minStay,
                                                                    maxStay: values.maxStay,
                                                                    cta: values.closedToArrival,
                                                                    ctd: values.closedToDeparture,
                                                                    stopSell: values.stopSell,
                                                                },
                                                            }
                                                            : r
                                                    ),
                                                }
                                                : d
                                        ),
                                    }
                                    : rt
                            ),
                        };
                    });
                    setRestrictionEditModal(null);
                    Toast.success('Room Restriction Updated Successfully!');
                },
            });
        },
        [editRoomRestriction, restrictionEditModal, month]
    );

    const handleRoomRestrictionStopSell = useCallback((roomRestrictionUuid) => {
        const { roomTypeUuid, ratePlanUuid, dateStr, stopSell } = restrictionEditModal || {};
        const targetStopSell = !stopSell;

        const roomTypeName = restrictionEditModal?.roomTypeName || 'this room type';
        const formattedDate = dayjs(dateStr).format('D MMM YYYY');

        Modal.confirm({
            rootClassName: "dark-confirm-modal",
            icon: null,
            title: (
                <div className="flex justify-between items-center w-full">
                    <span className="text-[16px] font-bold dark:!text-gray-100">
                        {restrictionEditModal?.stopSell ? 'Open sales for this rate plan?' : 'Stop sell for this rate plan?'}
                    </span>
                </div>
            ),
            closable: true,
            content: (
                <div className="mt-[-20px]">
                    <Divider className="my-3 border-gray-200" />
                    <div className="text-[14px] text-gray-600">
                        {restrictionEditModal?.stopSell
                            ? <span>This will open all availability for <strong>{roomTypeName}</strong> on <strong>{formattedDate}</strong>. Guests will now be able to book this date.</span>
                            : <span>This will remove all availability for <strong>{roomTypeName}</strong> on <strong>{formattedDate}</strong>. Guests will no longer be able to book this date.</span>
                        }
                    </div>
                    <Divider className="my-3 border-gray-200" />
                </div>
            ),
            okText: 'Save',
            cancelText: 'Cancel',
            okButtonProps: { type: 'primary', className: 'px-6' },
            cancelButtonProps: { className: 'bg-gray-100 border-none' },
            centered: true,
            onOk: () => {
                setLoadingStates((prev) => ({
                    ...prev,
                    stopSell: { ...prev.stopSell, [roomRestrictionUuid]: true },
                }));
                // We perform the optimistic update immediately upon confirm
                setRestrictionEditModal((prev) => prev ? { ...prev, stopSell: targetStopSell } : prev);

                updateRoomRestrictionStopSell.mutate(
                    { uuid: roomRestrictionUuid, stopSell: targetStopSell },
                    {
                        onSuccess: (responseData) => {
                            queryClient.setQueriesData({ queryKey: ['rateInventoryCalendar'] }, (old) => {
                                if (!old) return old;
                                return {
                                    ...old,
                                    roomTypes: old.roomTypes.map((rt) =>
                                        rt.uuid === roomTypeUuid
                                            ? {
                                                ...rt,
                                                dates: rt.dates.map((d) =>
                                                    d.date === dateStr
                                                        ? {
                                                            ...d,
                                                            rates: d.rates.map((r) =>
                                                                r.uuid === ratePlanUuid
                                                                    ? {
                                                                        ...r,
                                                                        restriction: {
                                                                            ...r.restriction,
                                                                            stopSell: targetStopSell,
                                                                        },
                                                                    }
                                                                    : r
                                                            ),
                                                        }
                                                        : d
                                                ),
                                            }
                                            : rt
                                    ),
                                };
                            });
                            Toast.success('Room Restriction Stop Sell Updated Successfully!');
                        },
                        onError: () => {
                            Toast.error('Failed to update Room Restriction Stop Sell!');
                            setRestrictionEditModal((prev) => prev ? { ...prev, stopSell: !prev.stopSell } : prev);
                        },
                        onSettled: () => {
                            setLoadingStates((prev) => {
                                const { [roomRestrictionUuid]: _, ...rest } = prev.stopSell;
                                return { ...prev, stopSell: rest };
                            });
                        },
                    }
                );
            }
        });
    }, [updateRoomRestrictionStopSell, restrictionEditModal, month]);

    // ── Filter options ────────────────────────────────────────────────────────

    /** Footer: total available + occupancy per day */
    const dailyStats = useMemo(
        () =>
            daysMeta.map(({ dateStr }) => {
                let totalAvailable = 0, totalSold = 0, totalRooms = 0;
                roomTypes.forEach((rt) => {
                    const avail = rtDateMap[rt.id]?.[dateStr]?.availability ?? DEFAULT_AVAILABILITY;
                    totalAvailable += avail.available;
                    totalSold += avail.sold;
                    totalRooms += avail.totalRooms ?? 0;
                });
                const occupancy = totalRooms > 0 ? Math.round((totalSold / totalRooms) * 100) : 0;
                return { available: totalAvailable, sold: totalSold, occupancy };
            }),
        [daysMeta, roomTypes, rtDateMap]
    );

    /** Select options for filter popover come from metadata */

    const handleFiltersChange = useCallback(
        (newFilters) => setFilters((prev) => ({ ...prev, ...newFilters })),
        []
    );
    const handleResetFilters = useCallback(
        () => setFilters({ roomType: null, floor: null, ratePlan: null }),
        []
    );

    // ── Loading skeleton ──────────────────────────────────────────────────────
    if (isLoading && !apiData) {
        return (
            <div className="flex flex-col h-screen bg-white overflow-hidden text-[#333]">
                {/* <div className="h-0.5 bg-blue-100 w-full">
                    <div className="h-full bg-blue-500 animate-pulse w-full" />
                </div> */}
                <CalendarHeader
                    currentDate={currentDate}
                    onDateChange={setCurrentDate}
                    keyword=""
                    onKeywordChange={() => { }}
                    filters={filters}
                    filterOptions={roomTypeOptions || []}
                    floorOptions={floorOptions || []}
                    ratePlanOptions={ratePlanOptions || []}
                    onFiltersChange={() => { }}
                    onReset={() => { }}
                    disabled
                />
                <div className="flex-1 relative overflow-hidden">
                    <div className="absolute inset-0 z-[50] flex items-center justify-center bg-white/40 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-3 bg-white rounded-2xl shadow-2xl px-10 py-8">
                            <Loader />
                        </div>
                    </div>
                    <div className="w-full h-full overflow-auto" ref={gridRef}>
                        <table className="border-separate border-spacing-0 table-fixed">
                            <CalendarTableHeader
                                daysMeta={daysMeta}
                                CELL_WIDTH={CELL_WIDTH}
                                SIDEBAR_WIDTH={SIDEBAR_WIDTH}
                            />
                            <tbody>
                                <tr>
                                    <td colSpan={days.length + 1} className="text-center py-20">
                                        <Loader />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    // ── Main render ───────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col h-screen bg-white overflow-hidden text-[#333]">
            {/* Refetch progress bar */}
            {/* {isFetching && (
                <div className="h-0.5 bg-blue-100 w-full">
                    <div className="h-full bg-blue-500 animate-pulse w-full" />
                </div>
            )} */}

            {/* Header */}
            <CalendarHeader
                currentDate={currentDate}
                onDateChange={setCurrentDate}
                keyword={keyword}
                onKeywordChange={setKeyword}
                filters={filters}
                filterOptions={roomTypeOptions || []}
                floorOptions={floorOptions || []}
                ratePlanOptions={ratePlanOptions || []}
                onFiltersChange={handleFiltersChange}
                onReset={handleResetFilters}
            />

            {/* Calendar grid */}
            <div className="flex-1 relative overflow-hidden">
                {/* Loading overlay — covers only the grid area, below the header */}
                {isFetching && (
                    <div className="absolute inset-0 z-[50] flex items-center justify-center">
                        <Loader />
                    </div>
                )}
                <div className="w-full h-full overflow-auto" ref={gridRef}>
                    <table className="border-separate border-spacing-0 table-fixed">
                        <CalendarTableHeader
                            daysMeta={daysMeta}
                            CELL_WIDTH={CELL_WIDTH}
                            SIDEBAR_WIDTH={SIDEBAR_WIDTH}
                        />
                        <tbody>
                            {roomTypes.map((rt) => (
                                <RoomTypeGroup
                                    key={rt.id}
                                    rt={rt}
                                    daysMeta={daysMeta}
                                    isExpanded={expandedGroups.has(rt.id)}
                                    onToggle={() => toggleGroup(rt.id)}
                                    getAvailability={getAvailability}
                                    handleCellClick={handleCellClick}
                                    handleStopSellToggle={handleStopSellToggle}
                                    handleAvailableUpdate={handleAvailableUpdate}
                                    loadingStates={loadingStates}
                                    editingCell={editingCell}
                                    setEditingCell={setEditingCell}
                                    getRateData={getRateData}
                                    handleRestrictionEditOpen={handleRestrictionEditOpen}
                                    roomDateMap={roomDateMap}
                                />
                            ))}
                        </tbody>

                        <CalendarFooter
                            dailyStats={dailyStats}
                            daysMeta={daysMeta}
                            CELL_WIDTH={CELL_WIDTH}
                            SIDEBAR_WIDTH={SIDEBAR_WIDTH}
                        />
                    </table>
                </div>
            </div>

            {/* Modals */}
            <RateInventoryModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedCell={selectedCell}
                loadingStates={loadingStates}
                handleStopSellToggle={handleStopSellToggle}
                handleRestrictionEditOpen={handleRestrictionEditOpen}
            />

            <RestrictionEditModal
                open={!!restrictionEditModal}
                onClose={() => setRestrictionEditModal(null)}
                onOk={() => restrictionForm.submit()}
                form={restrictionForm}
                isPending={editRoomRestriction.isPending}
                onFinish={handleRestrictionEditFinish}
                isViewMode={restrictionEditModal?.isViewMode}
                isPast={restrictionEditModal?.isPast}
                dateStr={restrictionEditModal?.dateStr}
                modalData={restrictionEditModal}
                loadingStates={loadingStates}
                handleRoomRestrictionStopSell={handleRoomRestrictionStopSell}
            />
        </div>
    );
};

export default RateAndInventoryCalendar;
