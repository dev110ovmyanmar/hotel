import React from 'react';
import { darkModeStyle, textWhiteInDarkStyle } from '../../../utils';
import BookingBar from './BookingBar';

const RoomRow = React.memo(({ room, days, CELL_WIDTH, SIDEBAR_WIDTH, checkIsToday, todayDarkStyle, handleBookingClick }) => (
  <tr className="h-15 hover:bg-gray-50">
    <td className={`sticky left-0 z-30 bg-[#fcfcfc] border-b border-r border-[#dee2e6] px-4 py-1 ${darkModeStyle}`} style={{ width: SIDEBAR_WIDTH, minWidth: SIDEBAR_WIDTH, maxWidth: SIDEBAR_WIDTH }}>
      <div className={`font-bold text-[12px] text-gray-700 ${textWhiteInDarkStyle}`}>{room.roomNo}</div>
      <div className="text-[9px] text-gray-400 uppercase">{room.floor}</div>
    </td>
    {days.map((day, dayIdx) => {
      const isToday = checkIsToday(day);
      return (
        <td key={dayIdx}
          className={`border-b border-[#dee2e6] p-0 relative transition-colors
            ${isToday
              ? `bg-[#DBEAFE] dark:!bg-[#1e3a5f] border-r-2 border-r-[#3B82F6] border-l-2 border-l-[#3B82F6] ${todayDarkStyle}`
              : `bg-[#fcfcfc] border-r ${darkModeStyle}`
            }`
          }
          style={{ width: CELL_WIDTH, minWidth: CELL_WIDTH, maxWidth: CELL_WIDTH }}>
          {(room.dates || []).map((bookingItem, bIdx) => (
            <BookingBar
              key={bIdx}
              bookingItem={bookingItem}
              room={room}
              day={day}
              days={days}
              CELL_WIDTH={CELL_WIDTH}
              handleBookingClick={handleBookingClick}
            />
          ))}
        </td>
      );
    })}
  </tr>
));

RoomRow.displayName = 'RoomRow';
export default RoomRow;
