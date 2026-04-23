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
import { fetchCalendarData } from './data';
import bookingIcon from "../../assets/images/bookingIcon.png";
import Dollar from "../../assets/images/Dollar.png";
import Team from "../../assets/images/Team.png";
import Loader from '../../component/Loader/Loader';

const STATUS_COLORS = {
  pending: { bg: '#EEC01B', text: '#fff' },
  booked: { bg: '#0958D9', text: '#fff' },
  confirmed: { bg: '#389E0D', text: '#fff' },
  cancelled: { bg: '#CF1322', text: '#fff' },
  checkin: { bg: '#08979C', text: '#fff' },
  inhouse: { bg: '#08979C', text: '#fff' },
  checkout: { bg: '#FF8D28', text: '#fff' },
};

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [allData, setAllData] = useState([]); // Empty state initially
  const [loading, setLoading] = useState(true); // Loading state
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ roomTypes: [], floors: [], statuses: [] });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const gridRef = useRef(null);
  const statsScrollRef = useRef(null);

  const handleScroll = (e) => {
    if (statsScrollRef.current) {
      statsScrollRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  const handleBookingClick = (booking, room) => {
    setSelectedBooking({ ...booking, roomId: room.id, roomFloor: room.floor });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  // --- MOCK API CALL ---
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const result = await fetchCalendarData();
        console.log("Result", result);
        setAllData(result);
        // Expand first two groups by default once data arrives
        setExpandedGroups(new Set(result.slice(0, 2).map(g => g.type)));
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  // --- FILTERING LOGIC ---
  const filteredData = useMemo(() => {
    return allData
      .map(group => {
        const typeMatch = filters.roomTypes.length === 0 || filters.roomTypes.includes(group.type);
        const filteredRooms = group.rooms.filter(room => {
          const floorMatch = filters.floors.length === 0 || filters.floors.includes(room.floor);
          const searchMatch = room.id.toLowerCase().includes(searchQuery.toLowerCase());
          const statusMatch = filters.statuses.length === 0 ||
            room.bookings.some(b => filters.statuses.includes(b.status));
          return floorMatch && searchMatch && statusMatch;
        });

        if (typeMatch && filteredRooms.length > 0) {
          return { ...group, rooms: filteredRooms };
        }
        return null;
      })
      .filter(Boolean);
  }, [allData, filters, searchQuery]);

  const days = useMemo(() => {
    const start = currentDate.startOf('month');
    return Array.from({ length: start.daysInMonth() }, (_, i) => start.add(i, 'day'));
  }, [currentDate]);

  const dailyStats = useMemo(() => {
    const totalRoomsCount = allData.reduce((acc, g) => acc + g.rooms.length, 0);
    if (totalRoomsCount === 0) return [];

    return days.map(day => {
      let occupiedCount = 0;
      allData.forEach(group => {
        group.rooms.forEach(room => {
          const isOccupied = room.bookings.some(b => {
            const start = dayjs(b.checkIn);
            const end = dayjs(b.checkOut);
            // Occupied from check-in up to (but not including) check-out
            return (day.isSame(start, 'day') || day.isAfter(start, 'day')) && day.isBefore(end, 'day');
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
          mode="multiple" allowClear className="w-full" placeholder="All Types"
          value={filters.roomTypes}
          onChange={(v) => setFilters(prev => ({ ...prev, roomTypes: v }))}
          options={allData.map(g => ({ label: g.type, value: g.type }))}
        />
      </div>
      <div>
        <div className="text-[11px] font-bold text-gray-400 uppercase mb-2">Floor</div>
        <Select
          mode="multiple" allowClear className="w-full" placeholder="All Floors"
          value={filters.floors}
          onChange={(v) => setFilters(prev => ({ ...prev, floors: v }))}
          options={Array.from(new Set(allData.flatMap(g => g.rooms.map(r => r.floor)))).sort().map(f => ({ label: f, value: f }))}
        />
      </div>
      <div>
        <div className="text-[11px] font-bold text-gray-400 uppercase mb-2">Booking Status</div>
        <Select
          mode="multiple" allowClear className="w-full" placeholder="All Statuses"
          value={filters.statuses}
          onChange={(v) => setFilters(prev => ({ ...prev, statuses: v }))}
          options={Object.keys(STATUS_COLORS).map(s => ({
            label: s.charAt(0).toUpperCase() + s.slice(1),
            value: s
          }))}
        />
      </div>
      <Divider className="my-2" />
      <Button type="text" danger block icon={<CloseCircleOutlined />}
        onClick={() => setFilters({ roomTypes: [], floors: [], statuses: [] })}>
        Reset All Filters
      </Button>
    </div>
  );

  const CELL_WIDTH = 85;
  const SIDEBAR_WIDTH = 240;

  // --- AUTO SCROLL TO TODAY ---
  useEffect(() => {
    if (!loading && gridRef.current) {
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
  }, [loading, currentDate]);

  // --- LOADING OVERLAY ---
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center flex-col gap-4">
        {/* <Spin size="large" /> */}
        <Loader />
        {/* <span className="text-gray-400">Loading Calendar Data...</span> */}
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
            <Badge dot={Object.values(filters).some(f => f.length > 0)}>
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
                  const isToday = day.isSame(dayjs(), 'day');
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
                <React.Fragment key={group.type}>
                  <tr className="bg-[#fcfcfc] cursor-pointer hover:bg-gray-100 h-15" onClick={() => toggleGroup(group.type)}>
                    <td className="sticky left-0 z-40 bg-[#fcfcfc] border-b border-r border-[#dee2e6] p-3 font-bold" style={{ width: SIDEBAR_WIDTH, minWidth: SIDEBAR_WIDTH, maxWidth: SIDEBAR_WIDTH }}>
                      <div className="flex justify-between items-center">
                        <span className="text-[12px] truncate">{group.type}</span>
                        {expandedGroups.has(group.type) ? <UpOutlined className="!text-[9px] " /> : <DownOutlined className="!text-[9px] " />}
                      </div>
                    </td>
                    {days.map((day, i) => {
                      const isToday = day.isSame(dayjs(), 'day');
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
                              <Input readOnly value={group.rooms.length} style={{ padding: '0 2px', height: '24px', fontSize: '12px' }} className="!w-5 text-center bg-white" />
                            </div>
                            <div className="text-[12px] text-gray-400">{group.price}</div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                  {expandedGroups.has(group.type) && group.rooms.map((room) => (
                    <tr key={room.id} className="h-15 hover:bg-gray-50">
                      <td className="sticky left-0 z-30 bg-[#fcfcfc] border-b border-r border-[#dee2e6] px-4 py-1" style={{ width: SIDEBAR_WIDTH, minWidth: SIDEBAR_WIDTH, maxWidth: SIDEBAR_WIDTH }}>
                        <div className="font-bold text-[12px] text-gray-700">{room.id}</div>
                        <div className="text-[9px] text-gray-400 uppercase">{room.floor}</div>
                      </td>
                      {days.map((day, dayIdx) => {
                        const isToday = day.isSame(dayjs(), 'day');
                        return (
                          <td key={dayIdx}
                            className={`border-b border-[#dee2e6] p-0 relative transition-colors
                              ${isToday
                                ? 'bg-[#E6F4FF] border-r-2 border-r-[#91CAFF] border-l-2 border-l-[#91CAFF]'
                                : 'bg-[#fcfcfc] border-r'
                              }`
                            }
                            style={{ width: CELL_WIDTH, minWidth: CELL_WIDTH, maxWidth: CELL_WIDTH }}>
                            {room.bookings.map((booking, bIdx) => {
                              const bookingCheckIn = dayjs(booking.checkIn);
                              const bookingCheckOut = dayjs(booking.checkOut);
                              if (day.isSame(bookingCheckIn, 'day')) {
                                const nights = bookingCheckOut.diff(bookingCheckIn, 'day');
                                const remainingCols = days.length - dayIdx;
                                const span = Math.min(nights, remainingCols);
                                const width = (span * CELL_WIDTH);
                                const style = STATUS_COLORS[booking.status];
                                const checkInFmt = bookingCheckIn.format('DD MMM');
                                const checkOutFmt = bookingCheckOut.format('DD MMM');
                                return (
                                  <Tooltip
                                    key={bIdx}
                                    title={
                                      <span>
                                        <strong>{booking.name}</strong> · {room.id}<br />
                                        📅 {checkInFmt} → {checkOutFmt} ({booking.nights} nights)
                                      </span>
                                    }
                                  >
                                    <div
                                      className="absolute top-4 left-[42.5px] bottom-3 z-10 rounded shadow-sm flex items-center gap-1.5 px-2 cursor-pointer transition-all hover:brightness-110 hover:shadow-md"
                                      onClick={() => handleBookingClick(booking, room)}
                                      style={{
                                        width: width,
                                        backgroundColor: style.bg,
                                        color: style.text,
                                        height: '25px',
                                      }}
                                    >
                                      <span className="text-[12px] font-bold whitespace-nowrap overflow-hidden text-ellipsis pr-2">
                                        {booking.name}
                                      </span>

                                      {span >= 3 && (
                                        <span className="text-[12px] opacity-80 whitespace-nowrap">
                                          {checkInFmt} → {checkOutFmt}
                                        </span>
                                      )}

                                      {/* ICON GROUP CONTAINER */}
                                      <div className="absolute -top-3 -right-2 flex gap-1 z-20">
                                        {/* Booking Icon */}
                                        <span className="bg-gray-100 rounded-full p-0.5 shadow-sm border border-white flex items-center justify-center">
                                          <img src={bookingIcon} alt="booking" className="w-3.5 h-3.5" />
                                        </span>

                                        {/* Dollar Icon */}
                                        <span className="bg-gray-100 rounded-full p-0.5 shadow-sm border border-white flex items-center justify-center">
                                          <img src={Dollar} alt="Dollar" className="w-3.5 h-3.5" />
                                        </span>

                                        {/* Team Icon */}
                                        <span className="bg-gray-100 rounded-full p-0.5 shadow-sm border border-white flex items-center justify-center">
                                          <img src={Team} alt="Team" className="w-3.5 h-3.5" />
                                        </span>
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
            </tbody>
          </table>
        </div>

        {/* FLOATING FOOTER CONTAINER */}
        <div className="absolute bottom-0 left-0 right-0 z-[100] flex flex-col bg-white/80 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          {/* STATS FOOTER (Horizontal Scroll synced) */}
          <div className="overflow-hidden border-b border-gray-100" ref={statsScrollRef}>
            <table className="border-separate border-spacing-0 table-fixed">
              <tbody>
                <tr className="bg-transparent">
                  <td className="sticky left-0 z-40 bg-gray-50/50 border-b border-r border-[#dee2e6] p-3 font-bold" style={{ width: SIDEBAR_WIDTH, minWidth: SIDEBAR_WIDTH, maxWidth: SIDEBAR_WIDTH }}>
                    <span className="text-[11px] uppercase text-gray-500">Rooms Available</span>
                  </td>
                  {dailyStats.map((stat, i) => {
                    const isZero = stat.available === 0;
                    const isToday = days[i].isSame(dayjs(), 'day');
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
                    const isToday = days[i].isSame(dayjs(), 'day');
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
            <Descriptions.Item label="Booking ID">{selectedBooking.id}</Descriptions.Item>
            <Descriptions.Item label="Guest Name">{selectedBooking.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedBooking.email}</Descriptions.Item>
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
            <Descriptions.Item label="Price">{selectedBooking.price} / night</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Badge
                color={STATUS_COLORS[selectedBooking.status]?.bg || '#ccc'}
                text={<span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{selectedBooking.status}</span>}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Special Requests">{selectedBooking.specialRequests}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div >
  );
};

export default Calendar;