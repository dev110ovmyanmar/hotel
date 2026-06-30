import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Button, Input, Space, Badge, Tooltip, DatePicker,
  Popover, Select, Checkbox, Divider, Spin, Modal, Descriptions
} from 'antd';
import {
  LeftOutlined, RightOutlined, DoubleLeftOutlined, DoubleRightOutlined,
  SearchOutlined, FilterOutlined, UpOutlined, DownOutlined, CloseCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { getReservationCalendar } from '../../api/reservationCalendarApi';
import Team from "../../assets/images/Team.png";
import Loader from '../../component/Loader/Loader';
import useApiQuery from '../../hooks/useApiQuery';
import { queryClient } from '../../app/queryClient';
import { roomMeta } from '../../api/roomApi';

const STATUS_COLORS = {
  pending: { bg: '#EEC01B', text: '#fff' },
  booked: { bg: '#0958D9', text: '#fff' },
  confirmed: { bg: '#389E0D', text: '#fff' },
  cancelled: { bg: '#CF1322', text: '#fff' },
  checked_in: { bg: '#08979C', text: '#fff' },
  checked_out: { bg: '#FF8D28', text: '#fff' },
  no_show: { bg: '#8c8c8c', text: '#fff' },
};


const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [allData, setAllData] = useState([]); // Empty state initially
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ roomType: null, floor: null, statuses: null });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const gridRef = useRef(null);
  const statsScrollRef = useRef(null);

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
    Floor: filters.floor ? { uuid: filters.floor } : null,
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

  const handleScroll = (e) => {
    if (statsScrollRef.current) {
      statsScrollRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

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

  // --- DATA TRANSFORMATION ---
  useEffect(() => {
    if (apiData && apiData.roomTypes) {
      setAllData(apiData.roomTypes);
      setExpandedGroups(new Set(apiData.roomTypes.slice(0, 2).map(g => g.name)));
    } else {
      setAllData([]);
    }
  }, [apiData]);


  // --- FILTERING LOGIC ---
  const filteredData = useMemo(() => {
    return allData
      .map(group => {
        const typeMatch = !filters.roomType || group.uuid === filters.roomType;
        const filteredRooms = group.rooms.filter(room => {
          const selectedFloor = roomMetaData?.floors?.find(f => f.uuid === filters.floor);
          const floorMatch = !filters.floor || selectedFloor?.name === room.floor;
          const searchMatch = room.roomNo.toLowerCase().includes(searchQuery.toLowerCase());

          const selectedStatus = reservationRoomStatus.find(s => s.value === filters.statuses);
          const statusMatch = !filters.statuses ||
            (room.dates && room.dates.some(b =>
              b.isBooked && b.booking &&
              b.booking.roomStatus.toLowerCase() === selectedStatus?.label.replace(/\s+/g, '_').toLowerCase()
            ));

          return floorMatch && searchMatch && statusMatch;
        });


        if (typeMatch && filteredRooms.length > 0) {
          return { ...group, rooms: filteredRooms };
        }
        return null;
      })
      .filter(Boolean);
  }, [allData, filters, searchQuery, roomMetaData]);

  console.log("FilteredData", filteredData);


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


  // --- FILTER UI ---
  const filterContent = (
    <div className="w-72 p-1 flex flex-col gap-4">
      <div>
        <div className="text-[11px] font-bold text-gray-400 uppercase mb-2">Room Type</div>
        <Select
          allowClear className="w-full" placeholder="All Types"
          value={filters.roomType}
          onChange={(v) => setFilters(prev => ({ ...prev, roomType: v }))}
          options={roomTypeOptions}
        />
      </div>
      <div>
        <div className="text-[11px] font-bold text-gray-400 uppercase mb-2">Floor</div>
        <Select
          allowClear className="w-full" placeholder="All Floors"
          value={filters.floor}
          onChange={(v) => setFilters(prev => ({ ...prev, floor: v }))}
          options={floorOptions}
        />
      </div>
      <div>
        <div className="text-[11px] font-bold text-gray-400 uppercase mb-2">Booking Status</div>
        <Select
          allowClear className="w-full" placeholder="All Statuses"
          value={filters.statuses}
          onChange={(v) => setFilters(prev => ({ ...prev, statuses: v }))}
          options={reservationRoomStatus}
        />
      </div>
      <Divider className="my-2" />
      <Button type="text" danger block icon={<CloseCircleOutlined />}
        onClick={() => setFilters({ roomType: null, floor: null, statuses: null })}>
        Reset All Filters
      </Button>
    </div>
  );


  const CELL_WIDTH = 85;
  const SIDEBAR_WIDTH = 240;


  // --- AUTO SCROLL TO TODAY ---
  useEffect(() => {
    if (!isLoading && !isFetching && gridRef.current) {
      const today = dayjs();
      // Only scroll if we're viewing the current month
      if (currentDate.isSame(today, 'month')) {
        const todayIdx = today.date() - 1;
        // Scroll so 'today' is visible, keeping 1 column as left padding
        const scrollAmount = (todayIdx * CELL_WIDTH) - CELL_WIDTH;
        // Small timeout ensures the DOM has painted before scrolling
        setTimeout(() => {
          gridRef.current?.scrollTo({
            left: Math.max(0, scrollAmount),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }, [isLoading, isFetching, currentDate]);


  // --- LOADING OVERLAY ---
  if (isLoading || isFetching) {
    return (
      <div className="h-screen w-full flex items-center justify-center flex-col gap-4">
        <Loader />
      </div>
    );
  }


  return (
    <div className="flex flex-col h-[calc(100vh-180px)] bg-white overflow-hidden text-[#333]">
      {/* HEADER */}
      <div className="bg-white px-6 py-3 flex justify-between items-center border-b border-[#dee2e6] z-50">
        <div className="flex items-center gap-4">
          <Space>
            <DoubleLeftOutlined className="text-gray-400 cursor-pointer" onClick={() => setCurrentDate(currentDate.subtract(1, 'year'))} />
            <LeftOutlined className="text-gray-400 cursor-pointer" onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))} />
            <DatePicker
              // picker="month"
              picker="date"
              value={currentDate}
              format="MMMM YYYY"
              allowClear={false}
              suffixIcon={null}
              variant="borderless"
              styles={{ input: { textAlign: 'center' } }}
              className="font-bold text-lg w-30 p-0 cursor-pointer"
              onChange={(date) => date && setCurrentDate(date)}
            />
            <RightOutlined className="text-gray-400 cursor-pointer" onClick={() => setCurrentDate(currentDate.add(1, 'month'))} />
            <DoubleRightOutlined className="text-gray-400 cursor-pointer" onClick={() => setCurrentDate(currentDate.add(1, 'year'))} />
          </Space>
        </div>


        <div className="flex items-center gap-4">
          <div className="text-lg font-medium w-full text-center">
            {currentDate ? currentDate.format('DD MMMM YYYY') : ''}
          </div>
        </div>


        <div className="flex items-center gap-3">
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Search Room ID..."
            className="w-64"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <Button type="primary" onClick={() => setCurrentDate(dayjs())}>Today</Button>
          <Popover content={filterContent} title="Filter Rooms" trigger="click" placement="bottomRight">
            <Badge dot={Object.values(filters).some(f => f && f.length > 0)}>
              <Button icon={<FilterOutlined />}>Filter</Button>
            </Badge>
          </Popover>
        </div>
      </div>


      {/* GRID CONTAINER (Parent for floating logic) */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        {/* SCROLLABLE GRID */}
        <div className="flex-1 overflow-auto relative pb-[160px]" ref={gridRef} onScroll={handleScroll}>
          <table className="border-separate border-spacing-0 table-fixed">
            <thead>
              <tr>
                <th className="sticky top-0 left-0 z-[60] bg-[#f8f9fa] border-b border-r border-[#dee2e6] p-4 text-left font-bold" style={{ width: SIDEBAR_WIDTH, minWidth: SIDEBAR_WIDTH, maxWidth: SIDEBAR_WIDTH }}>
                  Room Type
                </th>
                {days.map((day, i) => {
                  // const isToday = day.isSame(dayjs(), 'day');
                  const isToday = checkIsToday(day);
                  return (
                    <th key={i} className={`sticky top-0 z-[50] border-b border-[#dee2e6] text-center p-2
                      ${isToday
                        ? 'bg-[#E6F4FF] border-r-2 border-r-[#91CAFF] border-l-2 border-l-[#91CAFF]'
                        : 'bg-[#fcfcfc] border-r'
                      }`}
                      style={{ width: CELL_WIDTH, minWidth: CELL_WIDTH, maxWidth: CELL_WIDTH }}>
                      <div className={`text-[10px] uppercase ${isToday ? 'text-blue-500 font-bold' : 'text-gray-400'}`}>{day.format('MMM')}</div>
                      <div className={`text-base font-bold ${isToday ? 'text-blue-600' : ''}`}>{day.format('D')}</div>
                      <div className={`text-[11px] ${isToday ? 'text-blue-500 font-bold' : 'text-gray-500'}`}>{day.format('ddd')}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((group) => (
                <React.Fragment key={group.name}>
                  <tr className="bg-[#fcfcfc] cursor-pointer hover:bg-gray-100 h-15" onClick={() => toggleGroup(group.name)}>
                    <td className="sticky left-0 z-40 bg-[#fcfcfc] border-b border-r border-[#dee2e6] p-3 font-bold" style={{ width: SIDEBAR_WIDTH, minWidth: SIDEBAR_WIDTH, maxWidth: SIDEBAR_WIDTH }}>
                      <div className="flex justify-between items-center">
                        <span className="text-[12px] truncate">{group.name}</span>
                        {expandedGroups.has(group.name) ? <UpOutlined className="!text-[9px] " /> : <DownOutlined className="!text-[9px] " />}
                      </div>
                    </td>
                    {days.map((day, i) => {
                      const isToday = checkIsToday(day);
                      const dayStr = day.format('YYYY-MM-DD');
                      const dateData = (group.dates || []).find(d => d.date === dayStr);
                      const availableRooms = dateData?.availability?.availableRooms;
                      return (
                        <td key={i}
                          className={`border-b border-[#dee2e6] text-center p-1
                                ${isToday
                              ? 'bg-[#E6F4FF] border-r-2 border-r-[#91CAFF] border-l-2 border-l-[#91CAFF]'
                              : 'bg-[#fcfcfc] border-r'
                            }
                          `}
                          style={{ width: CELL_WIDTH, minWidth: CELL_WIDTH, maxWidth: CELL_WIDTH }}>
                          <div className={`flex flex-col items-center justify-center`}>
                            <div className="text-red-500 font-bold flex flex-col items-center">
                              <Input readOnly value={availableRooms} style={{ padding: '0 2px', height: '24px', fontSize: '12px' }} className="!w-5 text-center bg-white" />
                            </div>
                            <div className="text-[12px] text-gray-400">{group.price || ''}</div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                  {expandedGroups.has(group.name) && group.rooms.map((room) => (
                    <tr key={room.uuid} className="h-15 hover:bg-gray-50">
                      <td className="sticky left-0 z-30 bg-[#fcfcfc] border-b border-r border-[#dee2e6] px-4 py-1" style={{ width: SIDEBAR_WIDTH, minWidth: SIDEBAR_WIDTH, maxWidth: SIDEBAR_WIDTH }}>
                        <div className="font-bold text-[12px] text-gray-700">{room.roomNo}</div>
                        <div className="text-[9px] text-gray-400 uppercase">{room.floor}</div>
                      </td>
                      {days.map((day, dayIdx) => {
                        const isToday = checkIsToday(day);
                        return (
                          <td key={dayIdx}
                            className={`border-b border-[#dee2e6] p-0 relative transition-colors
                              ${isToday
                                ? 'bg-[#E6F4FF] border-r-2 border-r-[#91CAFF] border-l-2 border-l-[#91CAFF]'
                                : 'bg-[#fcfcfc] border-r'
                              }`
                            }
                            style={{ width: CELL_WIDTH, minWidth: CELL_WIDTH, maxWidth: CELL_WIDTH }}>
                            {(room.dates || []).map((bookingItem, bIdx) => {
                              if (!bookingItem.isBooked || !bookingItem.booking) return null;

                              const booking = bookingItem.booking;
                              const bookingCheckIn = dayjs(booking.checkinDate);
                              const bookingCheckOut = dayjs(booking.checkoutDate);
                              const bookingDate = dayjs(bookingItem.date);

                              if (day.isSame(bookingDate, 'day') && (day.isSame(bookingCheckIn, 'day') || (day.date() === 1 && bookingCheckIn.isBefore(day, 'day')))) {
                                const endDay = bookingCheckOut.startOf('day');
                                const totalNights = endDay.diff(bookingCheckIn.startOf('day'), 'day') || 1;
                                const nightsToDraw = endDay.diff(day.startOf('day'), 'day') || 1;
                                const remainingCols = days.length - dayIdx;
                                const span = Math.min(nightsToDraw, remainingCols);
                                const width = (span * CELL_WIDTH);
                                const style = STATUS_COLORS[booking.roomStatus];
                                const checkInFmt = bookingCheckIn.format('DD MMM');
                                const checkOutFmt = bookingCheckOut.format('DD MMM');
                                const guestName = booking.guest?.name || 'Unknown';

                                // 1. Check if the booking extends past your current view or specific date
                                const isContinuing = bookingCheckOut.isAfter(days[days.length - 1], 'day');

                                // 2. Define the clip path dynamically
                                // Standard slice:  /____/
                                // Continuing arrow: /____>
                                const clipPathStyle = isContinuing
                                  ? 'polygon(10px 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 0% 100%)'
                                  : 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)';

                                return (
                                  <Tooltip
                                    key={bIdx}
                                    title={
                                      <span>
                                        <strong>{guestName}</strong> · {room.roomNo}<br />
                                        📅 {checkInFmt} → {checkOutFmt} ({totalNights} nights)
                                      </span>
                                    }
                                  >
                                    <div
                                      className="absolute left-[42.5px] z-10 cursor-pointer transition-all hover:brightness-110 select-none"
                                      onClick={() => handleBookingClick(booking, room)}
                                      style={{
                                        width: width,
                                        color: style?.text || '#fff',
                                        height: '25px',
                                        top: '16px',
                                      }}
                                    >
                                      {/* Background with Clip Path */}
                                      <div
                                        className="absolute inset-0"
                                        style={{
                                          backgroundColor: style?.bg || '#ccc',
                                          clipPath: clipPathStyle, // Applies the arrow or the standard slant
                                        }}
                                      />

                                      {/* Text Content */}
                                      <div className="relative z-10 flex items-center gap-1.5 pl-4 pr-5 h-full">
                                        <span className="text-[12px] font-bold whitespace-nowrap overflow-hidden text-ellipsis pr-2">
                                          {guestName}
                                        </span>

                                        {span >= 3 && (
                                          <span className="text-[12px] opacity-80 whitespace-nowrap">
                                            {checkInFmt} → {checkOutFmt}
                                          </span>
                                        )}
                                      </div>

                                      {/* ICON GROUP CONTAINER */}
                                      <div className="absolute -top-3 -right-2 flex gap-1 z-20">

                                        {/* Team Icon */}
                                        {booking.isGroup && (
                                          <span className="bg-gray-100 rounded-full p-0.5 shadow-sm border border-white flex items-center justify-center">
                                            <img src={Team} alt="Team" className="w-3.5 h-3.5" />
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </Tooltip>
                                );
                              }
                              return null;
                            })}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}


              <tr className="bg-transparent">
                <td className="sticky left-0 z-40 bg-gray-50/50 border-b border-r border-[#dee2e6] p-3 font-bold" style={{ width: SIDEBAR_WIDTH, minWidth: SIDEBAR_WIDTH, maxWidth: SIDEBAR_WIDTH }}>
                  <span className="text-[11px] uppercase text-gray-500">Rooms Available</span>
                </td>
                {dailyStats.map((stat, i) => {
                  const isZero = stat.available === 0;
                  // const isToday = days[i].isSame(dayjs(), 'day');
                  const isToday = checkIsToday(days[i]);
                  return (
                    <td key={i} className={`border-b border-[#dee2e6] text-center p-2 font-bold
                        ${isToday
                        ? 'bg-[#E6F4FF] border-r-2 border-r-[#91CAFF] border-l-2 border-l-[#91CAFF]'
                        : 'bg-[#fcfcfc] border-r'
                      }`} style={{ width: CELL_WIDTH, minWidth: CELL_WIDTH, maxWidth: CELL_WIDTH }}>
                      <div className={`text-sm ${isZero ? 'text-red-500' : 'text-green-600'}`}>
                        {stat.available}
                      </div>
                    </td>
                  );
                })}
              </tr>
              <tr className="bg-transparent">
                <td className="sticky left-0 z-40 bg-gray-50/50 border-b border-r border-[#dee2e6] p-3 font-bold" style={{ width: SIDEBAR_WIDTH, minWidth: SIDEBAR_WIDTH, maxWidth: SIDEBAR_WIDTH }}>
                  <span className="text-[11px] uppercase text-gray-500">Occupancy %</span>
                </td>
                {dailyStats.map((stat, i) => {
                  const isToday = checkIsToday(days[i]);
                  return (
                    <td key={i} className={`border-b border-[#dee2e6] text-center p-2
                        ${isToday
                        ? 'bg-[#E6F4FF] border-r-2 border-r-[#91CAFF] border-l-2 border-l-[#91CAFF]'
                        : 'bg-[#fcfcfc] border-r'
                      }`} style={{ width: CELL_WIDTH, minWidth: CELL_WIDTH, maxWidth: CELL_WIDTH }}>
                      <div className="flex flex-col items-center">
                        <div className="text-[11px] font-bold text-gray-700">{stat.occupancy}%</div>
                        <div className="w-full bg-gray-200 h-1 mt-1 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${stat.occupancy > 80 ? 'bg-amber-500' : 'bg-blue-500'}`}
                            style={{ width: `${stat.occupancy}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>


        {/* FLOATING FOOTER CONTAINER */}
        <div className="absolute bottom-0 left-0 right-0 z-[100] flex flex-col bg-white/80 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          {/* STATS FOOTER (Horizontal Scroll synced) */}


          {/* LEGEND FOOTER */}
          <div className="px-6 py-3">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <span className="text-[11px] uppercase font-bold text-gray-400 mr-2 self-center">Reservation Status</span>
              {Object.entries(STATUS_COLORS).map(([status, style]) => (
                <div key={status} className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-sm shadow-sm"
                    style={{ backgroundColor: style.bg }}
                  />
                  <span className="text-[11px] font-medium text-gray-500 capitalize">
                    {status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


      <Modal
        title="Booking Details"
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" type="primary" onClick={handleModalClose}>
            Close
          </Button>
        ]}
      >
        {selectedBooking && (
          <Descriptions column={1} bordered size="small" className="mt-4">
            <Descriptions.Item label="Booking ID">{selectedBooking.reservationNo}</Descriptions.Item>
            <Descriptions.Item label="Guest Name">{selectedBooking.name}</Descriptions.Item>
            <Descriptions.Item label="Phone">{selectedBooking.phone}</Descriptions.Item>
            <Descriptions.Item label="Room">{selectedBooking.roomId} ({selectedBooking.roomFloor})</Descriptions.Item>
            <Descriptions.Item label="Check-in">
              <span style={{ fontWeight: 600, color: '#198754' }}>
                {dayjs(selectedBooking.checkIn).format('DD MMM YYYY')}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Check-out">
              <span style={{ fontWeight: 600, color: '#DC3545' }}>
                {dayjs(selectedBooking.checkOut).format('DD MMM YYYY')}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Nights">{selectedBooking.nights} Night(s)</Descriptions.Item>
            <Descriptions.Item label="Guests">{selectedBooking.guests} Person(s)</Descriptions.Item>
            {/* <Descriptions.Item label="Price">{selectedBooking.price} / night</Descriptions.Item> */}
            <Descriptions.Item label="Status">
              <Badge
                color={STATUS_COLORS[selectedBooking.status]?.bg || '#ccc'}
                text={<span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{selectedBooking.status}</span>}
              />
            </Descriptions.Item>
            {/* <Descriptions.Item label="Special Requests">{selectedBooking.specialRequests}</Descriptions.Item> */}
          </Descriptions>
        )}
      </Modal>
    </div >
  );
};

export default Calendar;

