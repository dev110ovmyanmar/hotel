import React, { useState, useMemo, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { getReservationCalendar } from '../../api/reservationCalendarApi';
import Loader from '../../component/Loader/Loader';
import useApiQuery from '../../hooks/useApiQuery';
import { queryClient } from '../../app/queryClient';
import { roomMeta } from '../../api/roomApi';
import { darkModeStyle } from '../../utils';
import CalendarHeader from './components/CalendarHeader';
import GroupRow from './components/GroupRow';
import RoomRow from './components/RoomRow';
import StatsRows from './components/StatsRows';
import StatusLegend from './components/StatusLegend';
import BookingDetailsModal from './components/BookingDetailsModal';

export const STATUS_COLORS = {
  pending: { bg: '#EEC01B', text: '#fff' },
  booked: { bg: '#0958D9', text: '#fff' },
  confirmed: { bg: '#389E0D', text: '#fff' },
  cancelled: { bg: '#CF1322', text: '#fff' },
  checked_in: { bg: '#08979C', text: '#fff' },
  checked_out: { bg: '#FF8D28', text: '#fff' },
  no_show: { bg: '#8c8c8c', text: '#fff' },
};

const todayDarkStyle = `dark:!border-[#3B82F6] dark:!text-gray-200`;
const todayDarkModeStyle = 'dark:!bg-[#1e3a5f] dark:!border-r-[#3B82F6] dark:!border-l-[#3B82F6] dark:!text-gray-200';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [allData, setAllData] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ roomType: null, floor: null, statuses: null });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const gridRef = useRef(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({ roomType: null, floor: null, statuses: null });

  const initData = queryClient.getQueryData(["initData", "authenticated"]);
  const reservationRoomStatus = useMemo(
    () =>
      initData?.statuses?.reservation_room_status?.map((item) => ({
        value: item.uuid,
        label: item.name,
      })) || [],
    [initData],
  );

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

  const month = currentDate.format('YYYY-MM');
  const keyword = searchQuery;

  const calendarParams = useMemo(() => ({
    month,
    keyword,
    roomType: filters.roomType ? { uuid: filters.roomType } : null,
    floor: filters.floor ? { uuid: filters.floor } : null,
    reservationRoomStatus: filters.statuses ? { uuid: filters.statuses } : null,
  }), [month, keyword, filters]);

  const { data: apiData, isLoading, isFetching } = useApiQuery({
    fetchQueryName: 'reservationCalendar',
    fetchQueryFunction: getReservationCalendar,
    params: calendarParams,
    options: {
      placeholderData: (prev) => prev,
    },
  });

  const handleBookingClick = (booking, room) => {
    setSelectedBooking({
      id: booking.reservationRoomUuid,
      reservationNo: booking.reservationNo,
      name: booking.guest?.name || 'Unknown',
      roomId: room.roomNo,
      roomFloor: room.floor,
      checkIn: booking.checkinDate,
      checkOut: booking.checkoutDate,
      nights: dayjs(booking.checkoutDate).startOf('day').diff(dayjs(booking.checkinDate).startOf('day'), 'day') || 1,
      guests: 1,
      price: '',
      status: booking.roomStatus,
      email: '',
      phone: booking.guest?.phone || '',
      specialRequests: ''
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  useEffect(() => {
    if (apiData && apiData.roomTypes) {
      setAllData(apiData.roomTypes);
      setExpandedGroups(new Set(apiData.roomTypes.slice(0, 2).map(g => g.name)));
    } else {
      setAllData([]);
    }
  }, [apiData]);

  const filteredData = useMemo(() => {
    if (searchQuery) return allData;
    return allData;
  }, [allData, searchQuery]);

  const days = useMemo(() => {
    const start = currentDate.startOf('month');
    return Array.from({ length: start.daysInMonth() }, (_, i) => start.add(i, 'day'));
  }, [currentDate]);

  const todayStr = dayjs().format('YYYY-MM-DD');
  const checkIsToday = (day) => day.format('YYYY-MM-DD') === todayStr;

  const dailyStats = useMemo(() => {
    const totalRoomsCount = allData.reduce((acc, g) => acc + g.rooms.length, 0);
    if (totalRoomsCount === 0) return [];

    return days.map(day => {
      let occupiedCount = 0;
      allData.forEach(group => {
        group.rooms.forEach(room => {
          const isOccupied = (room.dates || []).some(b => {
            return day.isSame(dayjs(b.date), 'day') && b.isBooked;
          });
          if (isOccupied) occupiedCount++;
        });
      });

      return {
        available: totalRoomsCount - occupiedCount,
        occupancy: Math.round((occupiedCount / totalRoomsCount) * 100)
      };
    });
  }, [allData, days]);

  const toggleGroup = (type) => {
    const newSet = new Set(expandedGroups);
    if (newSet.has(type)) newSet.delete(type);
    else newSet.add(type);
    setExpandedGroups(newSet);
  };

  const CELL_WIDTH = 85;
  const SIDEBAR_WIDTH = 240;

  useEffect(() => {
    if (!isLoading && !isFetching && gridRef.current) {
      const today = dayjs();
      if (currentDate.isSame(today, 'month')) {
        const todayIdx = today.date() - 1;
        const scrollAmount = (todayIdx * CELL_WIDTH) - CELL_WIDTH;
        setTimeout(() => {
          gridRef.current?.scrollTo({
            left: Math.max(0, scrollAmount),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }, [isLoading, isFetching, currentDate]);

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] bg-white overflow-hidden text-[#333]">
      <CalendarHeader
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        isLoading={isLoading}
        isFetching={isFetching}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        setSearchQuery={setSearchQuery}
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        filters={filters}
        setFilters={setFilters}
        localFilters={localFilters}
        setLocalFilters={setLocalFilters}
        roomTypeOptions={roomTypeOptions}
        floorOptions={floorOptions}
        reservationRoomStatus={reservationRoomStatus}
      />

      <div className="flex-1 relative overflow-hidden flex flex-col">
        {(isLoading || isFetching) && (
          <div className="absolute inset-0 z-[70] flex items-center justify-center">
            <Loader />
          </div>
        )}
        <div className="flex-1 overflow-auto relative pb-[160px]" ref={gridRef}>
          <table className="border-separate border-spacing-0 table-fixed">
            <thead>
              <tr>
                <th className={`sticky top-0 left-0 z-[60] bg-[#f8f9fa] border-b border-r border-[#dee2e6] p-4 text-left font-bold ${darkModeStyle}`} style={{ width: SIDEBAR_WIDTH, minWidth: SIDEBAR_WIDTH, maxWidth: SIDEBAR_WIDTH }}>
                  Room Type
                </th>
                {days.map((day, i) => {
                  const isToday = checkIsToday(day);
                  return (
                    <th key={i} className={`sticky top-0 z-[50] border-b text-center p-2
                      ${isToday
                        ? `bg-[#DBEAFE] dark:!bg-[#1e3a5f] border-r-2 border-r-[#3B82F6] border-l-2 border-l-[#3B82F6] ${todayDarkStyle}`
                        : `bg-[#fcfcfc] border-r border-[#dee2e6] ${darkModeStyle}`
                      }`}
                      style={{ width: CELL_WIDTH, minWidth: CELL_WIDTH, maxWidth: CELL_WIDTH }}>
                      <div className={`text-[10px] uppercase font-semibold ${isToday ? 'text-blue-500' : 'text-gray-400'}`}>{day.format('MMM')}</div>
                      {isToday ? (
                        <>
                          <div
                            style={{
                              width: 30, height: 30,
                              borderRadius: '50%',
                              backgroundColor: '#2563EB',
                              color: '#fff',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 14, fontWeight: 700,
                              margin: '2px auto',
                              boxShadow: '0 2px 8px rgba(37,99,235,0.45)'
                            }}
                          >{day.format('D')}</div>
                          <div className="text-[11px] text-blue-500 font-bold">{day.format('ddd')}</div>
                          <div style={{ fontSize: 9, fontWeight: 700, color: '#2563EB', letterSpacing: 1, textTransform: 'uppercase' }}>Today</div>
                        </>
                      ) : (
                        <>
                          <div className="text-base font-bold ">{day.format('D')}</div>
                          <div className="text-[11px] ">{day.format('ddd')}</div>
                        </>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((group) => (
                <React.Fragment key={group.name}>
                  <GroupRow
                    group={group}
                    days={days}
                    expandedGroups={expandedGroups}
                    toggleGroup={toggleGroup}
                    CELL_WIDTH={CELL_WIDTH}
                    SIDEBAR_WIDTH={SIDEBAR_WIDTH}
                    checkIsToday={checkIsToday}
                    todayDarkStyle={todayDarkStyle}
                  />
                  {expandedGroups.has(group.name) && group.rooms.map((room) => (
                    <RoomRow
                      key={room.uuid}
                      room={room}
                      days={days}
                      CELL_WIDTH={CELL_WIDTH}
                      SIDEBAR_WIDTH={SIDEBAR_WIDTH}
                      checkIsToday={checkIsToday}
                      todayDarkStyle={todayDarkStyle}
                      handleBookingClick={handleBookingClick}
                    />
                  ))}
                </React.Fragment>
              ))}

              <StatsRows
                dailyStats={dailyStats}
                days={days}
                CELL_WIDTH={CELL_WIDTH}
                SIDEBAR_WIDTH={SIDEBAR_WIDTH}
                checkIsToday={checkIsToday}
                todayDarkStyle={todayDarkStyle}
                todayDarkModeStyle={todayDarkModeStyle}
              />
            </tbody>
          </table>
        </div>

        <StatusLegend />
      </div>

      <BookingDetailsModal
        isModalOpen={isModalOpen}
        handleModalClose={handleModalClose}
        selectedBooking={selectedBooking}
      />
    </div >
  );
};

export default Calendar;
