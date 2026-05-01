import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    Button, Input, Space, Badge, DatePicker,
    Modal, Switch, Popover, Select, Divider
} from 'antd';
import {
    LeftOutlined, RightOutlined, DoubleLeftOutlined, DoubleRightOutlined,
    SearchOutlined, UpOutlined, DownOutlined, ExclamationCircleOutlined,
    FilterOutlined, CloseCircleOutlined, EditOutlined, CloseOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { mockCalendarData } from './mockData';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [calendarData, setCalendarData] = useState(mockCalendarData);
    const [expandedGroups, setExpandedGroups] = useState(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({ roomTypes: [] });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCell, setSelectedCell] = useState(null);

    const gridRef = useRef(null);
    const CELL_WIDTH = 100;
    const SIDEBAR_WIDTH = 220;

    console.log("CalendarData", calendarData);

    // Frontend-controlled days — independent of API
    const days = useMemo(() => {
        const start = currentDate.startOf('month');
        return Array.from({ length: start.daysInMonth() }, (_, i) => start.add(i, 'day'));
    }, [currentDate]);

    console.log("Days",days);

    const roomTypes = useMemo(() => calendarData.roomTypes, [calendarData]);

    useEffect(() => {
        if (roomTypes.length > 0) {
            setExpandedGroups(new Set(roomTypes.slice(0, 2).map(rt => rt.id)));
        }
    }, []);

    // Auto scroll to today
    useEffect(() => {
        if (gridRef.current && currentDate.isSame(dayjs(), 'month')) {
            const todayIdx = dayjs().date() - 1;
            setTimeout(() => {
                gridRef.current?.scrollTo({ left: Math.max(0, todayIdx * CELL_WIDTH - CELL_WIDTH), behavior: 'smooth' });
            }, 100);
        }
    }, [currentDate]);

    const toggleGroup = (id) => {
        const next = new Set(expandedGroups);
        next.has(id) ? next.delete(id) : next.add(id);
        setExpandedGroups(next);
    };

    // Helper: get inventory for a date, fallback to defaults if missing
    const getInventory = (rt, dateStr) =>
        rt.inventory.dates[dateStr] ?? { stopSell: false, available: 0, sold: 0 };

    // Helper: get price for a rate plan on a date
    const getPrice = (ratePlan, dateStr) =>
        ratePlan.prices[dateStr] ?? null;

    const handleStopSellToggle = (rtId, dateStr, currentValue) => {
        const newValue = !currentValue;
        Modal.confirm({
            title: 'Confirm Stop Sell Change',
            icon: <ExclamationCircleOutlined />,
            content: `Are you sure you want to ${newValue ? 'enable' : 'disable'} Stop Sell for ${dateStr}?`,
            okText: 'Confirm',
            cancelText: 'Cancel',
            centered: true,
            onOk: () => {
                setCalendarData(prev => ({
                    ...prev,
                    roomTypes: prev.roomTypes.map(rt =>
                        rt.id !== rtId ? rt : {
                            ...rt,
                            inventory: {
                                ...rt.inventory,
                                dates: {
                                    ...rt.inventory.dates,
                                    [dateStr]: {
                                        ...getInventory(rt, dateStr),
                                        stopSell: newValue,
                                    },
                                },
                            },
                        }
                    ),
                }));
            },
        });
    };

    const handleCellClick = (rt, dateStr) => {
        const inv = getInventory(rt, dateStr);
        setSelectedCell({
            roomTypeName: rt.name,
            date: dayjs(dateStr).format('DD.MM.YYYY'),
            dateStr,
            rtId: rt.id,
            inventory: inv,
            ratePlans: rt.ratePlans.map(rp => ({
                id: rp.id,
                name: rp.name,
                price: getPrice(rp, dateStr),
            })),
        });
        setIsModalOpen(true);
    };

    const filteredRoomTypes = useMemo(() =>
        roomTypes.filter(rt => {
            const typeMatch = filters.roomTypes.length === 0 || filters.roomTypes.includes(rt.id);
            const searchMatch = rt.name.toLowerCase().includes(searchQuery.toLowerCase());
            return typeMatch && searchMatch;
        }),
    [roomTypes, filters, searchQuery]);

    // Footer stats: sum across all room types per day
    const dailyStats = useMemo(() =>
        days.map(day => {
            const dateStr = day.format('YYYY-MM-DD');
            let totalAvailable = 0, totalSold = 0, totalRooms = 0;
            roomTypes.forEach(rt => {
                const inv = getInventory(rt, dateStr);
                totalAvailable += inv.available;
                totalSold += inv.sold;
                totalRooms += rt.inventory.totalRooms;
            });
            const occupancy = totalRooms > 0 ? Math.round((totalSold / totalRooms) * 100) : 0;
            return { available: totalAvailable, sold: totalSold, occupancy };
        }),
    [days, roomTypes, calendarData]);

    const todayCellClass = (day) =>
        day.isSame(dayjs(), 'day')
            ? 'bg-[#E6F4FF] border-r-2 border-r-[#91CAFF] border-l-2 border-l-[#91CAFF]'
            : 'bg-[#fcfcfc] border-r';

    const filterContent = (
        <div className="w-64 p-1 flex flex-col gap-4">
            <div>
                <div className="text-[11px] font-bold text-gray-400 uppercase mb-2">Room Type</div>
                <Select
                    mode="multiple" allowClear className="w-full" placeholder="All Types"
                    value={filters.roomTypes}
                    onChange={(v) => setFilters({ roomTypes: v })}
                    options={roomTypes.map(rt => ({ label: rt.name, value: rt.id }))}
                />
            </div>
            <Divider className="my-2" />
            <Button type="text" danger block icon={<CloseCircleOutlined />}
                onClick={() => setFilters({ roomTypes: [] })}>
                Reset Filters
            </Button>
        </div>
    );

    return (
        <div className="flex flex-col h-screen bg-white overflow-hidden text-[#333]">
            {/* HEADER */}
            <div className="bg-white px-6 py-3 flex justify-between items-center border-b border-[#dee2e6] z-50">
                <Space>
                    <DoubleLeftOutlined className="text-gray-400 cursor-pointer" onClick={() => setCurrentDate(d => d.subtract(1, 'year'))} />
                    <LeftOutlined className="text-gray-400 cursor-pointer" onClick={() => setCurrentDate(d => d.subtract(1, 'month'))} />
                    <DatePicker
                        picker="month"
                        value={currentDate}
                        format="MMMM YYYY"
                        allowClear={false}
                        suffixIcon={null}
                        variant="borderless"
                        styles={{ input: { textAlign: 'center' } }}
                        className="font-bold text-lg w-36 p-0 cursor-pointer"
                        onChange={(date) => date && setCurrentDate(date)}
                    />
                    <RightOutlined className="text-gray-400 cursor-pointer" onClick={() => setCurrentDate(d => d.add(1, 'month'))} />
                    <DoubleRightOutlined className="text-gray-400 cursor-pointer" onClick={() => setCurrentDate(d => d.add(1, 'year'))} />
                </Space>

                <div className="flex items-center gap-3">
                    <Input prefix={<SearchOutlined />} placeholder="Search room type..." className="w-64"
                        value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    <Button type="primary" onClick={() => setCurrentDate(dayjs())}>Today</Button>
                    <Popover content={filterContent} title="Filter" trigger="click" placement="bottomRight">
                        <Badge dot={filters.roomTypes.length > 0}>
                            <Button icon={<FilterOutlined />}>Filter</Button>
                        </Badge>
                    </Popover>
                </div>
            </div>

            {/* GRID */}
            <div className="flex-1 overflow-auto relative" ref={gridRef}>
                <table className="border-separate border-spacing-0 table-fixed">
                    <thead>
                        <tr>
                            <th className="sticky top-0 left-0 z-[60] bg-[#f8f9fa] border-b border-r border-[#dee2e6] p-4 text-left font-bold"
                                style={{ width: SIDEBAR_WIDTH, minWidth: SIDEBAR_WIDTH }}>
                                Room Type / Rate Plan
                            </th>
                            {days.map((day, i) => {
                                const isToday = day.isSame(dayjs(), 'day');
                                return (
                                    <th key={i} className={`sticky top-0 z-[50] border-b border-[#dee2e6] text-center p-2
                                        ${isToday ? 'bg-[#E6F4FF] border-r-2 border-r-[#91CAFF] border-l-2 border-l-[#91CAFF]' : 'bg-[#f8f9fa] border-r'}`}
                                        style={{ width: CELL_WIDTH, minWidth: CELL_WIDTH }}>
                                        <div className={`text-[10px] uppercase ${isToday ? 'text-blue-500 font-bold' : 'text-gray-400'}`}>{day.format('MMM')}</div>
                                        <div className={`text-base font-bold ${isToday ? 'text-blue-600' : ''}`}>{day.format('D')}</div>
                                        <div className={`text-[11px] ${isToday ? 'text-blue-500 font-bold' : 'text-gray-500'}`}>{day.format('ddd')}</div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRoomTypes.map((rt) => {
                            const isExpanded = expandedGroups.has(rt.id);
                            return (
                                <React.Fragment key={rt.id}>
                                    {/* GROUP HEADER ROW */}
                                    <tr className="bg-[#fcfcfc] cursor-pointer hover:bg-gray-100 h-10"
                                        onClick={() => toggleGroup(rt.id)}>
                                        <td className="sticky left-0 z-40 bg-[#fcfcfc] border-r border-[#dee2e6] p-3 font-bold">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[12px] truncate">{rt.name}</span>
                                                {isExpanded ? <UpOutlined className="!text-[9px]" /> : <DownOutlined className="!text-[9px]" />}
                                            </div>
                                        </td>
                                        {days.map((day, i) => {
                                            const dateStr = day.format('YYYY-MM-DD');
                                            const inv = getInventory(rt, dateStr);
                                            return (
                                                <td key={i} className={`border-b border-[#dee2e6] text-center p-0 relative ${todayCellClass(day)}`}
                                                    style={{ width: CELL_WIDTH }}>
                                                    <div
                                                        onClick={(e) => { e.stopPropagation(); handleCellClick(rt, dateStr); }}
                                                        className={`mx-auto flex items-center justify-center cursor-pointer transition-all
                                                            w-full h-[40px] text-[11px] font-semibold text-black border-b
                                                            ${inv.stopSell ? 'bg-[#fff1f0] border-[#ffccc7]' : 'bg-[#feffe6] border-[#fffb8f]'}`}
                                                    >
                                                        <ExclamationCircleOutlined className="mr-1 text-xs" />
                                                        {inv.stopSell ? 'Stop Sell' : 'Open'}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>

                                    {/* STOP SELL TOGGLE ROW */}
                                    <tr className="bg-[#fcfcfc] h-8">
                                        <td className="sticky left-0 z-40 bg-[#fcfcfc] border-r border-[#dee2e6] px-3 text-black text-[12px] pl-4">Stop Sell</td>
                                        {days.map((day, i) => {
                                            const dateStr = day.format('YYYY-MM-DD');
                                            const inv = getInventory(rt, dateStr);
                                            return (
                                                <td key={i} className={`border-b border-[#dee2e6] text-center p-0 ${todayCellClass(day)}`}>
                                                    <Switch
                                                        size="small"
                                                        checked={inv.stopSell}
                                                        onChange={() => handleStopSellToggle(rt.id, dateStr, inv.stopSell)}
                                                        style={{ backgroundColor: inv.stopSell ? '#ff4d4f' : '#52c41a' }}
                                                        disabled={day.isBefore(dayjs(), 'day')}
                                                    />
                                                </td>
                                            );
                                        })}
                                    </tr>

                                    {/* TOTAL ROOMS ROW */}
                                    <tr className="bg-[#fcfcfc] h-8">
                                        <td className="sticky left-0 z-40 bg-[#fcfcfc] border-r border-[#dee2e6] px-3 text-black text-[12px] pl-4">Total Rooms</td>
                                        {days.map((_, i) => (
                                            <td key={i} className={`border-b border-[#dee2e6] text-center text-[12px] font-bold ${todayCellClass(days[i])}`}>
                                                {rt.inventory.totalRooms}
                                            </td>
                                        ))}
                                    </tr>

                                    {/* ROOM AVAILABLE ROW */}
                                    <tr className="bg-[#fcfcfc] h-8">
                                        <td className="sticky left-0 z-40 bg-[#fcfcfc] border-r border-[#dee2e6] px-3 text-black text-[12px] pl-4">Room Available</td>
                                        {days.map((day, i) => {
                                            const inv = getInventory(rt, day.format('YYYY-MM-DD'));
                                            return (
                                                <td key={i} className={`border-b border-[#dee2e6] text-center text-[12px] font-bold text-green-600 ${todayCellClass(day)}`}>
                                                    {inv.available}
                                                </td>
                                            );
                                        })}
                                    </tr>

                                    {/* SOLD ROOMS ROW */}
                                    <tr className="bg-[#fcfcfc] h-8">
                                        <td className="sticky left-0 z-40 bg-[#fcfcfc] border-b border-r border-[#dee2e6] px-3 text-black text-[12px] pl-4">Sold Rooms</td>
                                        {days.map((day, i) => {
                                            const inv = getInventory(rt, day.format('YYYY-MM-DD'));
                                            return (
                                                <td key={i} className={`border-b border-[#dee2e6] text-center text-[12px] font-bold text-red-500 ${todayCellClass(day)}`}>
                                                    {inv.sold}
                                                </td>
                                            );
                                        })}
                                    </tr>

                                    {/* EXPANDED: RATE PLAN ROWS */}
                                    {isExpanded && rt.ratePlans.map((rp) => (
                                        <tr key={rp.id} className="h-10 hover:bg-gray-50">
                                            <td className="sticky left-0 z-30 bg-[#f9f9f9] border-b border-r border-[#dee2e6] px-4 py-1">
                                                <div className="text-[11px] text-gray-600 pl-2 border-l-2 border-blue-300">{rp.name}</div>
                                            </td>
                                            {days.map((day, dayIdx) => {
                                                const dateStr = day.format('YYYY-MM-DD');
                                                const price = getPrice(rp, dateStr);
                                                return (
                                                    <td key={dayIdx} className={`border-b border-[#dee2e6] text-center text-[12px] font-semibold p-1 ${todayCellClass(day)}`}>
                                                        <div className={`flex items-center justify-center h-8 rounded text-[11px]
                                                            ${price != null ? 'text-blue-700 bg-blue-50' : 'text-gray-300'}`}>
                                                            {price != null ? price.toLocaleString() : '—'}
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}

                                    {/* EXPANDED: INDIVIDUAL ROOM ROWS */}
                                    {isExpanded && rt.rooms?.map((room) => (
                                        <tr key={room.id} className="h-9 hover:bg-gray-50">
                                            <td className="sticky left-0 z-30 bg-white border-b border-r border-[#dee2e6] px-4 py-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[11px] font-semibold text-gray-700">{room.roomNo}</span>
                                                    <span className="text-[9px] text-gray-400 uppercase">{room.floor}</span>
                                                </div>
                                            </td>
                                            {days.map((day, dayIdx) => {
                                                const dateStr = day.format('YYYY-MM-DD');
                                                const inv = getInventory(rt, dateStr);
                                                const roomAvail = room.availability[dateStr] === true;
                                                return (
                                                    <td key={dayIdx} className={`border-b border-[#dee2e6] text-center p-0 ${todayCellClass(day)}`}>
                                                        <div className="flex justify-center items-center h-full py-1.5">
                                                            <div className={`w-4 h-4 rounded-sm ${inv.stopSell || !roomAvail ? 'bg-red-400' : 'bg-green-400'}`} />
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </React.Fragment>
                            );
                        })}
                    </tbody>

                    <tfoot className="sticky bottom-0 z-[55] bg-white border-t-2 border-gray-200">
                        <tr className="bg-gray-50/80">
                            <td className="sticky left-0 z-40 bg-gray-50 border-b border-r border-[#dee2e6] p-3 font-bold"
                                style={{ width: SIDEBAR_WIDTH, minWidth: SIDEBAR_WIDTH }}>
                                <span className="text-[11px] uppercase text-gray-500">Total Available</span>
                            </td>
                            {dailyStats.map((stat, i) => (
                                <td key={i} className={`border-b border-[#dee2e6] text-center p-2 font-bold
                                    ${days[i].isSame(dayjs(), 'day') ? 'bg-[#E6F4FF] border-r-2 border-r-[#91CAFF] border-l-2 border-l-[#91CAFF]' : 'bg-[#fcfcfc] border-r'}`}
                                    style={{ width: CELL_WIDTH, minWidth: CELL_WIDTH }}>
                                    <div className={`text-sm ${stat.available === 0 ? 'text-red-500' : 'text-green-600'}`}>
                                        {stat.available}
                                    </div>
                                </td>
                            ))}
                        </tr>
                        <tr className="bg-gray-50/80">
                            <td className="sticky left-0 z-40 bg-gray-50 border-b border-r border-[#dee2e6] p-3 font-bold"
                                style={{ width: SIDEBAR_WIDTH, minWidth: SIDEBAR_WIDTH }}>
                                <span className="text-[11px] uppercase text-gray-500">Occupancy %</span>
                            </td>
                            {dailyStats.map((stat, i) => (
                                <td key={i} className={`border-b border-[#dee2e6] text-center p-2
                                    ${days[i].isSame(dayjs(), 'day') ? 'bg-[#E6F4FF] border-r-2 border-r-[#91CAFF] border-l-2 border-l-[#91CAFF]' : 'bg-[#fcfcfc] border-r'}`}
                                    style={{ width: CELL_WIDTH, minWidth: CELL_WIDTH }}>
                                    <div className="flex flex-col items-center">
                                        <div className="text-[11px] font-bold text-gray-700">{stat.occupancy}%</div>
                                        <div className="w-full bg-gray-200 h-1 mt-1 rounded-full overflow-hidden">
                                            <div className={`h-full ${stat.occupancy > 80 ? 'bg-amber-500' : 'bg-blue-500'}`}
                                                style={{ width: `${stat.occupancy}%` }} />
                                        </div>
                                    </div>
                                </td>
                            ))}
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* MODAL */}
            <Modal
                title={<span className="text-[16px] font-bold">Rate & Inventory Details</span>}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                closeIcon={<CloseOutlined />}
                width={480}
                centered
            >
                {selectedCell && (
                    <div className="flex flex-col gap-3 text-[13px] mt-2">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Room Type:</span>
                            <span className="font-bold">{selectedCell.roomTypeName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Date:</span>
                            <span className="font-bold">{selectedCell.date}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Stop Sell:</span>
                            <Switch
                                size="small"
                                checked={selectedCell.inventory?.stopSell}
                                style={{ backgroundColor: selectedCell.inventory?.stopSell ? '#ff4d4f' : '#52c41a' }}
                                onChange={() => {
                                    handleStopSellToggle(selectedCell.rtId, selectedCell.dateStr, selectedCell.inventory?.stopSell);
                                    setIsModalOpen(false);
                                }}
                            />
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Available:</span>
                            <span className="font-bold text-green-600">{selectedCell.inventory?.available}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Sold:</span>
                            <span className="font-bold text-red-500">{selectedCell.inventory?.sold}</span>
                        </div>

                        <Divider className="my-1" />

                        <div className="font-bold text-[12px] text-gray-500 uppercase">Rate Plans</div>
                        {selectedCell.ratePlans?.map(rp => (
                            <div key={rp.id} className="bg-gray-50 rounded p-2 flex justify-between items-center">
                                <span className="font-semibold text-[12px]">{rp.name}</span>
                                <span className="font-bold text-blue-600">
                                    {rp.price != null ? `${rp.price.toLocaleString()} MMK` : '—'}
                                </span>
                            </div>
                        ))}

                        <Divider className="my-1" />
                        <div className="flex justify-end">
                            <EditOutlined className="text-blue-500 text-lg cursor-pointer hover:scale-110 transition-transform" />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Calendar;
