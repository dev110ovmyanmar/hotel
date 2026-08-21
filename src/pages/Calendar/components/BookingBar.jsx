import React from 'react';
import dayjs from 'dayjs';
import { STATUS_COLORS } from '../Calendar';
import Team from '../../../assets/images/Team.png';

const BookingBar = ({ bookingItem, room, day, days, CELL_WIDTH, handleBookingClick }) => {
  if (!bookingItem.isBooked || !bookingItem.booking) return null;

  const booking = bookingItem.booking;
  const bookingCheckIn = dayjs(booking.checkinDate).startOf('day');
  const bookingCheckOut = dayjs(booking.checkoutDate).startOf('day');
  const firstVisibleDay = days[0].startOf('day');
  const lastVisibleDay = days[days.length - 1].startOf('day');

  const isContinuingLeft = bookingCheckIn.isBefore(firstVisibleDay);
  const isContinuingRight = bookingCheckOut.isAfter(lastVisibleDay);

  const entryDay = isContinuingLeft ? firstVisibleDay : bookingCheckIn;
  const exitDay = isContinuingRight ? lastVisibleDay : bookingCheckOut;

  // Only render on the entry day cell
  if (!day.isSame(entryDay, 'day')) return null;

  let span = exitDay.diff(entryDay, 'day');

  if (isContinuingLeft && !isContinuingRight) {
    span = exitDay.diff(firstVisibleDay, 'day') + 1;
  } else if (!isContinuingLeft && isContinuingRight) {
    span = exitDay.diff(entryDay, 'day') + 1;
  } else if (isContinuingLeft && isContinuingRight) {
    span = days.length;
  }

  if (span <= 0) return null;

  const totalNights = bookingCheckOut.diff(bookingCheckIn, 'day') || 1;
  const style = STATUS_COLORS[booking.roomStatus];
  const checkInFmt = bookingCheckIn.format('DD MMM');
  const checkOutFmt = bookingCheckOut.format('DD MMM');
  const guestName = booking.guest?.fullName || 'Unknown';

  const leftOffset = isContinuingLeft ? '0px' : '42.5px';
  let dynamicWidth = span * CELL_WIDTH;

  if (!isContinuingLeft && !isContinuingRight) {
    dynamicWidth = span * CELL_WIDTH;
  } else if (isContinuingLeft && !isContinuingRight) {
    dynamicWidth = (span * CELL_WIDTH) - 42.5;
  } else if (!isContinuingLeft && isContinuingRight) {
    dynamicWidth = (span * CELL_WIDTH) - 42.5;
  } else {
    dynamicWidth = span * CELL_WIDTH;
  }

  let clipPathStyle = 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)';

  if (isContinuingLeft && isContinuingRight) {
    clipPathStyle = 'polygon(0% 50%, 10px 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 10px 100%)';
  } else if (isContinuingLeft) {
    clipPathStyle = 'polygon(0% 50%, 10px 0%, 100% 0%, calc(100% - 10px) 100%, 10px 100%)';
  } else if (isContinuingRight) {
    clipPathStyle = 'polygon(10px 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 0% 100%)';
  }

  return (
    <div
      className="absolute z-10 cursor-pointer transition-all hover:brightness-110 select-none"
      onClick={() => handleBookingClick(booking, room)}
      style={{
        left: leftOffset,
        width: dynamicWidth,
        color: style?.text || '#fff',
        height: '25px',
        top: '16px',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: style?.bg || '#ccc',
          clipPath: clipPathStyle,
        }}
      />

      <div className={`relative z-10 flex items-center gap-1.5 h-full ${isContinuingLeft ? 'pl-6' : 'pl-4'} pr-5`}>
        <span className="text-[12px] font-bold whitespace-nowrap overflow-hidden text-ellipsis pr-2">
          {guestName}
        </span>
        {span >= 3 && (
          <span className="text-[12px] opacity-80 whitespace-nowrap">
            {checkInFmt} → {checkOutFmt}
          </span>
        )}
      </div>

      <div className="absolute -top-3 -right-2 flex gap-1 z-20">
        {booking.isGroup && (
          <span className="bg-gray-100 rounded-full p-0.5 shadow-sm border border-white flex items-center justify-center">
            <img src={Team} alt="Team" className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
    </div>
  );
};

export default BookingBar;
