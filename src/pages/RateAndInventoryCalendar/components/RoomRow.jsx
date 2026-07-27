import React from 'react';
import { darkModeStyle, textWhiteInDarkStyle } from '../../../utils';

const todayDarkModeStyle = 'dark:!bg-[#1e3a5f] dark:!border-r-[#3B82F6] dark:!border-l-[#3B82F6] dark:!text-gray-200';

/**
 * RoomRow
 * A single individual room row showing availability dots per day.
 * Props:
 *   room            – { id, roomNo }
 *   daysMeta        – [{ dateStr, cellClass }]
 *   getAvailability – (rtId, dateStr) => availability object
 *   roomDateMap     – { [roomId]: { [dateStr]: { isBooked, isAvailable } } }
 *   rtId            – room type id
 */


const RoomRow = ({ room, daysMeta, getAvailability, roomDateMap, rtId }) => (
    <tr key={room.id} className="h-9  hover:bg-gray-50">
        <td className={`sticky left-0 z-30 border-b border-r border-[#dee2e6] bg-[#fcfcfc]  px-4 py-1 ${darkModeStyle}`}>
            <div className={`font-bold text-[12px] text-gray-700 ${textWhiteInDarkStyle}`}>{room.roomNo}</div>
            <div className="text-[9px] text-gray-400 uppercase">{room.floor}</div>
        </td>
        {daysMeta.map(({ dateStr, cellClass, isToday }, dayIdx) => {
            const avail = getAvailability(rtId, dateStr);
            const roomDay = roomDateMap[room.id]?.[dateStr];
            const isAvailable = roomDay?.isAvailable === true && !roomDay?.isBooked;
            return (
                <td key={dayIdx} className={`border-b border-[#dee2e6] text-center p-0 ${cellClass} ${isToday ? todayDarkModeStyle : darkModeStyle}`}>
                    <div className="flex justify-center items-center h-full py-1.5">
                        <div
                            className={`w-4 h-4 rounded-sm ${avail.stopSell || !isAvailable ? 'bg-red-400' : 'bg-green-400'
                                }`}
                        />
                    </div>
                </td>
            );
        })}
    </tr>
);

export default RoomRow;
