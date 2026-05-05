import React from 'react';
import { Switch, Input, Tooltip } from 'antd';
import { ExclamationCircleOutlined, UpOutlined, DownOutlined, EyeOutlined } from '@ant-design/icons';
import RatePlanRows from './RatePlanRows';
import RoomRow from './RoomRow';

const CELL_WIDTH = 100;

/**
 * RoomTypeGroup
 * Renders all table rows for one room type:
 *   - Group header row (clickable to expand/collapse)
 *   - Stop Sell toggle row
 *   - Total Rooms row
 *   - Room Available row (inline editable)
 *   - Sold Rooms row
 *   - [Expanded] Rate plan sub-rows (via RatePlanRows)
 *   - [Expanded] Individual room rows (via RoomRow)
 *
 * Props:
 *   rt                      – room type object { id, uuid, name, ratePlans, rooms }
 *   daysMeta                – [{ dateStr, cellClass, isPast, isToday }]
 *   isExpanded              – boolean
 *   onToggle                – () => void
 *   getAvailability         – (rtId, dateStr) => availability
 *   handleCellClick         – (rt, dateStr) => void
 *   handleStopSellToggle    – (rtId, dateStr, stopSell, uuid) => void
 *   handleAvailableUpdate   – (rtId, uuid, value, totalRooms) => void
 *   loadingStates           – { stopSell: {}, availability: {} }
 *   editingCell             – { rtId, dateStr, value } | null
 *   setEditingCell          – setState fn
 *   filteredRatePlansMap    – { [rtId]: rp[] } | null
 *   filteredRoomsMap        – { [rtId]: room[] } | null
 *   getRateData             – (rtId, rpId, dateStr) => rateData | null
 *   handleRestrictionEditOpen – (restriction, rp, rt, dateStr) => void
 *   roomDateMap             – { [roomId]: { [dateStr]: { isBooked, isAvailable } } }
 */
const RoomTypeGroup = ({
    rt,
    daysMeta,
    isExpanded,
    onToggle,
    getAvailability,
    handleCellClick,
    handleStopSellToggle,
    handleAvailableUpdate,
    loadingStates,
    editingCell,
    setEditingCell,
    filteredRatePlansMap,
    filteredRoomsMap,
    getRateData,
    handleRestrictionEditOpen,
    roomDateMap,
}) => {
    const ratePlansToRender = filteredRatePlansMap ? (filteredRatePlansMap[rt.id] ?? []) : (rt.ratePlans ?? []);
    const roomsToRender = filteredRoomsMap ? filteredRoomsMap[rt.id] : (rt.rooms ?? []);

    return (
        <React.Fragment>
            {/* GROUP HEADER ROW */}
            <tr
                className="bg-[#fcfcfc] cursor-pointer hover:bg-gray-100 h-10"
                onClick={onToggle}
            >
                <td className="sticky left-0 z-40 bg-[#fcfcfc] border-r border-[#dee2e6] p-3 font-bold" style={{ borderTop: '3px solid #6b7280' }}>
                    <div className="flex justify-between items-center">
                        <span className="text-[13px] truncate">{rt.name}</span>
                        {isExpanded ? (
                            <UpOutlined className="!text-[9px]" />
                        ) : (
                            <DownOutlined className="!text-[9px]" />
                        )}
                    </div>
                </td>
                {daysMeta.map(({ dateStr, cellClass }, i) => {
                    const avail = getAvailability(rt.id, dateStr);
                    return (
                        <td
                            key={i}
                            className={`border-b border-[#dee2e6] text-center p-0 relative ${cellClass}`}
                            style={{ width: CELL_WIDTH, borderTop: '3px solid #6b7280' }}
                        >
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCellClick(rt, dateStr);
                                }}
                                className={`mx-auto flex items-center justify-center transition-all
                                    w-full h-[40px] text-[11px] font-semibold cursor-pointer
                                     ${avail.stopSell
                                        ? 'bg-red-100'
                                        : 'bg-green-100'
                                    }`
                                }
                            >
                                <EyeOutlined className="mr-1 text-xs" /> Info
                            </div>
                        </td>
                    );
                })}
            </tr>

            {/* STOP SELL TOGGLE ROW */}
            <tr className="bg-[#fcfcfc] h-8">
                <td className="sticky left-0 z-40 bg-[#fcfcfc] border-r border-[#dee2e6] px-3 text-black text-[13px] pl-4">
                    Stop Sell
                </td>
                {daysMeta.map(({ dateStr, cellClass, isPast }, i) => {
                    const avail = getAvailability(rt.id, dateStr);
                    const isLoading = loadingStates.stopSell[avail?.uuid];
                    return (
                        <td key={i} className={`border-b border-[#dee2e6] text-center p-0 ${cellClass}`}>
                            {avail?.uuid ? (
                                <Switch
                                    size="small"
                                    checked={avail.stopSell}
                                    onChange={() =>
                                        handleStopSellToggle(rt.id, dateStr, avail.stopSell, avail.uuid)
                                    }
                                    style={{ backgroundColor: avail.stopSell ? '#ff4d4f' : '#52c41a' }}
                                    disabled={isPast || isLoading}
                                    loading={isLoading}
                                />
                            ) : null}
                        </td>
                    );
                })}
            </tr>

            {/* TOTAL ROOMS ROW */}
            <tr className="bg-[#fcfcfc] h-8">
                <td className="sticky left-0 z-40 bg-[#fcfcfc] border-r border-[#dee2e6] px-3 text-black text-[13px] pl-4">
                    Total Rooms
                </td>
                {daysMeta.map(({ dateStr, cellClass }, i) => {
                    const total = getAvailability(rt.id, dateStr).totalRooms ?? 0;
                    return (
                        <td
                            key={i}
                            className={`border-b border-[#dee2e6] text-center text-[13px] font-bold ${cellClass}`}
                        >
                            {total || '-'}
                        </td>
                    );
                })}
            </tr>

            {/* ROOM AVAILABLE ROW */}
            <tr className="bg-[#fcfcfc] h-8">
                <td className="sticky left-0 z-40 bg-[#fcfcfc] border-r border-[#dee2e6] px-3 text-black text-[13px] pl-4">
                    Room Available
                </td>
                {daysMeta.map(({ dateStr, cellClass, isPast }, i) => {
                    const avail = getAvailability(rt.id, dateStr);
                    const isEditing = editingCell?.rtId === rt.id && editingCell?.dateStr === dateStr;
                    const isLoading = loadingStates.availability[avail?.uuid];
                    const isDisabled = isPast || avail.stopSell || isLoading;
                    const totalRooms = avail.totalRooms ?? null;
                    const editingValue = isEditing ? parseInt(editingCell.value, 10) : NaN;
                    const isOverLimit = isEditing && !isNaN(editingValue) && totalRooms != null && editingValue > totalRooms;
                    return (
                        <td
                            key={i}
                            className={`border-b border-[#dee2e6] text-center text-[13px] font-bold text-green-600 ${cellClass}`}
                        >
                            {avail?.uuid && !isPast ? (
                                <Tooltip
                                    open={isOverLimit}
                                    title={`Max: ${totalRooms}`}
                                    color="red"
                                    placement="top"
                                >
                                    <Input
                                        size="small"
                                        className="text-center text-[12px] font-bold text-green-600 px-1 !w-[50px] !border-gray-200 !rounded"
                                        status={isOverLimit ? 'error' : undefined}
                                        disabled={isDisabled}
                                        value={isEditing ? editingCell.value : avail.stopSell ? 0 : avail.available}
                                        onFocus={() =>
                                            setEditingCell({ rtId: rt.id, dateStr, value: avail.available })
                                        }
                                        onChange={(e) => {
                                            const raw = e.target.value;
                                            // Allow empty string so the user can clear the field
                                            if (raw === '' || raw === '-') {
                                                setEditingCell((prev) => ({ ...prev, value: raw }));
                                                return;
                                            }
                                            // const parsed = parseInt(raw, 10);
                                            // if (!isNaN(parsed) && totalRooms != null && parsed > totalRooms) {
                                            //     // Silently clamp to the maximum allowed
                                            //     setEditingCell((prev) => ({ ...prev, value: totalRooms }));
                                            // } else {
                                            setEditingCell((prev) => ({ ...prev, value: raw }));
                                            // }
                                        }}
                                        onBlur={() => {
                                            if (isEditing && editingCell?.value !== avail.available) {
                                                handleAvailableUpdate(rt.id, avail.uuid, editingCell?.value, totalRooms);
                                            } else {
                                                setEditingCell(null);
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                e.target.blur();
                                            }
                                            if (e.key === 'Escape') {
                                                setEditingCell(null);
                                            }
                                        }}
                                        suffix={
                                            isLoading ? (
                                                <span className="text-blue-500 text-[10px]">...</span>
                                            ) : null
                                        }
                                    />
                                </Tooltip>
                            ) : (
                                <span className={isPast ? 'text-gray-400' : ''}>
                                    {avail.stopSell ? 0 : avail.available}
                                </span>
                            )}
                        </td>
                    );
                })}
            </tr>

            {/* SOLD ROOMS ROW */}
            <tr className="bg-[#fcfcfc] h-8">
                <td className="sticky left-0 z-40 bg-[#fcfcfc] border-b border-r border-[#dee2e6] px-3 text-black text-[13px] pl-4">
                    Sold Rooms
                </td>
                {daysMeta.map(({ dateStr, cellClass }, i) => {
                    const avail = getAvailability(rt.id, dateStr);
                    return (
                        <td
                            key={i}
                            className={`border-b border-[#dee2e6] text-center text-[13px] font-bold text-red-500 ${cellClass}`}
                        >
                            {avail.sold}
                        </td>
                    );
                })}
            </tr>

            {/* EXPANDED: RATE PLAN ROWS */}
            {isExpanded &&
                ratePlansToRender.map((rp) => (
                    <RatePlanRows
                        key={rp.id}
                        rp={rp}
                        rt={rt}
                        daysMeta={daysMeta}
                        getRateData={getRateData}
                        handleRestrictionEditOpen={handleRestrictionEditOpen}
                    />
                ))}

            {/* EXPANDED: INDIVIDUAL ROOM ROWS */}
            {isExpanded &&
                roomsToRender.map((room) => (
                    <RoomRow
                        key={room.id}
                        room={room}
                        daysMeta={daysMeta}
                        getAvailability={getAvailability}
                        roomDateMap={roomDateMap}
                        rtId={rt.id}
                    />
                ))}
        </React.Fragment>
    );
};

export default RoomTypeGroup;
