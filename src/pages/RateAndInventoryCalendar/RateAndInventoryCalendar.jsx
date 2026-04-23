import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    Button, Input, Space, Badge, DatePicker,
    Spin, Modal, Switch, App, Popover, Select, Divider
} from 'antd';
import {
    LeftOutlined, RightOutlined, DoubleLeftOutlined, DoubleRightOutlined,
    SearchOutlined, UpOutlined, DownOutlined, ExclamationCircleOutlined,
    FilterOutlined, CloseCircleOutlined, EditOutlined, CloseOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { fetchCalendarData } from './data';
import Loader from '../../component/Loader/Loader';

const Calendar = () => {
    // --- STATE ---
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [allData, setAllData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedGroups, setExpandedGroups] = useState(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({ roomTypes: [], floors: [] });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    const [dailyStatus, setDailyStatus] = useState({});

    const gridRef = useRef(null);
    const CELL_WIDTH = 85;
    const SIDEBAR_WIDTH = 200;

    const handleModalClick = (group, day) => {
        const dateStr = day.format('DD.MM.YYYY');
        const statusKey = `${group.type}-${day.format('YYYY-MM-DD')}`;

        // Get existing data or defaults
        const current = dailyStatus[statusKey] || {
            stopSell: false,
            minStay: 2,
            maxStay: 4,
            closeArrival: true,
            closeDeparture: false
        };

        setSelectedData({ ...current, date: dateStr, groupType: group.type, key: statusKey });
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    // --- FETCH DATA ---
    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const result = await fetchCalendarData();
                setAllData(result);
                setExpandedGroups(new Set(result.slice(0, 2).map(g => g.type)));

                // Initialize dailyStatus based on initial data if needed
                const initialStatus = {};
                result.forEach(group => {
                    // Logic to fill initialStatus from API would go here
                });
                setDailyStatus(initialStatus);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    // --- HANDLERS ---
    const toggleGroup = (type) => {
        const newSet = new Set(expandedGroups);
        if (newSet.has(type)) newSet.delete(type);
        else newSet.add(type);
        setExpandedGroups(newSet);
    };

    // NEW: Handle Toggle with Confirmation Modal
    const handleSwitchChange = (checked, groupType, dateStr) => {
        const statusKey = `${groupType}-${dateStr}`;
        const actionText = checked ? "Open" : "Close";

        Modal.confirm({
            title: 'Confirm Status Change',
            icon: <ExclamationCircleOutlined />,
            content: `Are you sure you want to ${actionText} the status for ${groupType} on ${dateStr}?`,
            okText: 'Confirm',
            cancelText: 'Cancel',
            centered: true,
            onOk: () => {
                setDailyStatus(prev => ({
                    ...prev,
                    [statusKey]: checked
                }));
            },
        });
    };

    const days = useMemo(() => {
        const start = currentDate.startOf('month');
        return Array.from({ length: start.daysInMonth() }, (_, i) => start.add(i, 'day'));
    }, [currentDate]);

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

    const filteredData = useMemo(() => {
        return allData
            .map(group => {
                const typeMatch = filters.roomTypes.length === 0 || filters.roomTypes.includes(group.type);
                const filteredRooms = group.rooms.filter(room => {
                    const floorMatch = filters.floors.length === 0 || filters.floors.includes(room.floor);
                    const searchMatch = room.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        group.type.toLowerCase().includes(searchQuery.toLowerCase());
                    return floorMatch && searchMatch;
                });

                if (typeMatch && filteredRooms.length > 0) {
                    return { ...group, rooms: filteredRooms };
                }
                return null;
            })
            .filter(Boolean);
    }, [allData, filters, searchQuery]);

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
            <Divider className="my-2" />
            <Button type="text" danger block icon={<CloseCircleOutlined />}
                onClick={() => setFilters({ roomTypes: [], floors: [] })}>
                Reset All Filters
            </Button>
        </div>
    );

    if (loading) return <div className="h-screen w-full flex items-center justify-center"><Loader /></div>;

    return (
        <div className="flex flex-col h-screen bg-white overflow-hidden text-[#333]">
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
                    <Input prefix={<SearchOutlined />} placeholder="Search..." className="w-64" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    <Button type="primary" onClick={() => setCurrentDate(dayjs())}>Today</Button>
                    <Popover content={filterContent} title="Filter Rooms" trigger="click" placement="bottomRight">
                        <Badge dot={Object.values(filters).some(f => f.length > 0)}>
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
                            <th className="sticky top-0 left-0 z-[60] bg-[#f8f9fa] border-b border-r border-[#dee2e6] p-4 text-left font-bold" style={{ width: SIDEBAR_WIDTH }}>Room Type</th>
                            {days.map((day, i) => {
                                const isToday = day.isSame(dayjs(), 'day');
                                return (
                                    <th key={i} className={`sticky top-0 z-[50] border-b border-[#dee2e6] text-center p-2 
                                        ${isToday
                                            ? 'bg-[#E6F4FF] border-r-2 border-r-[#91CAFF] border-l-2 border-l-[#91CAFF]'
                                            : 'bg-[#f8f9fa] border-r'
                                        }`} style={{ width: CELL_WIDTH, minWidth: CELL_WIDTH }}>
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
                                <tr className="bg-[#fcfcfc] cursor-pointer hover:bg-gray-100 h-10" onClick={() => toggleGroup(group.type)}>
                                    <td className="sticky left-0 z-40 bg-[#fcfcfc] border-r border-[#dee2e6] p-3 font-bold">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[12px] truncate">{group.type}</span>
                                            {expandedGroups.has(group.type) ? <UpOutlined className="!text-[9px]" /> : <DownOutlined className="!text-[9px]" />}
                                        </div>
                                    </td>
                                    {days.map((day, i) => {
                                        const statusKey = `${group.type}-${day.format('YYYY-MM-DD')}`;
                                        const isStopSell = dailyStatus[statusKey]?.stopSell;
                                        const isToday = day.isSame(dayjs(), 'day');

                                        return (
                                            <td key={i} className={`border-b border-[#dee2e6] text-center p-0 relative
                                                ${isToday
                                                    ? 'bg-[#E6F4FF] border-r-2 border-r-[#91CAFF] border-l-2 border-l-[#91CAFF]'
                                                    : 'bg-[#fcfcfc] border-r'
                                                }`} style={{ width: CELL_WIDTH }}>
                                                <div
                                                    onClick={() => handleModalClick(group, day)}
                                                    className={`
                                                    mx-auto flex items-center justify-center cursor-pointer transition-all relative
                                                    hover:brightness-95 active:scale-95
                                                    w-[85px] h-[80px] rounded-[4px] text-[11px] font-semibold text-black border
                                                    ${isStopSell
                                                            ? "bg-[#fff1f0] border-[#ffccc7]"
                                                            : "bg-[#feffe6] border-[#fffb8f]"
                                                        }
                                                `}
                                                >
                                                    <ExclamationCircleOutlined className="absolute top-1 right-1 text-xs" />
                                                    {group.price}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>

                                {/* ROW 2: DAILY TOGGLES */}
                                <tr className="bg-[#fcfcfc] h-8">
                                    <td className="sticky left-0 z-40 bg-[#fcfcfc] border-r border-[#dee2e6] px-3 text-black text-[12px] pl-4">Dynamic Rate</td>
                                    {days.map((day, i) => {
                                        const dateStr = day.format('YYYY-MM-DD');
                                        const isChecked = dailyStatus[`${group.type}-${dateStr}`] || false;
                                        const isToday = day.isSame(dayjs(), 'day');
                                        return (
                                            <td key={i} className={`border-b border-[#dee2e6] text-center p-0 relative
                                                ${isToday
                                                    ? 'bg-[#E6F4FF] border-r-2 border-r-[#91CAFF] border-l-2 border-l-[#91CAFF]'
                                                    : 'bg-[#fcfcfc] border-r'
                                                }`}>
                                                <Switch
                                                    size="small"
                                                    checked={isChecked}
                                                    onChange={(checked) => handleSwitchChange(checked, group.type, dateStr)}
                                                    style={{ backgroundColor: isChecked ? '#ff4d4f' : '#52c41a' }}
                                                    disabled={day.isBefore(dayjs(), 'day')}
                                                />
                                            </td>
                                        );
                                    })}
                                </tr>

                                <tr className="bg-[#fcfcfc] h-8">
                                    <td className="sticky left-0 z-40 bg-[#fcfcfc] border-r border-[#dee2e6] px-3 text-black text-[12px] pl-4">Total Rooms</td>
                                    {days.map((day, i) => {
                                        const isToday = day.isSame(dayjs(), 'day');
                                        return (
                                            <td key={i} className={`border-b border-[#dee2e6] text-center font-bold
                                                ${isToday
                                                    ? 'bg-[#E6F4FF] border-r-2 border-r-[#91CAFF] border-l-2 border-l-[#91CAFF]'
                                                    : 'bg-[#fcfcfc] border-r'
                                                }`}>
                                                <Input readOnly value={group.rooms.length} style={{ padding: '0 2px', height: '24px', fontSize: '12px' }} className="!w-5 text-center bg-white" />
                                            </td>
                                        )
                                    })}
                                </tr>

                                <tr className="bg-[#fcfcfc] h-8">
                                    <td className="sticky left-0 z-40 bg-[#fcfcfc] border-r border-[#dee2e6] px-3 text-black text-[12px] pl-4">Room Available</td>
                                    {days.map((day, i) => {
                                        const isToday = day.isSame(dayjs(), 'day');
                                        return (
                                            <td key={i} className={`border-b border-[#dee2e6] text-center font-bold
                                                ${isToday
                                                    ? 'bg-[#E6F4FF] border-r-2 border-r-[#91CAFF] border-l-2 border-l-[#91CAFF]'
                                                    : 'bg-[#fcfcfc] border-r'
                                                }`}>{group.rooms.length}</td>
                                        )
                                    })}
                                </tr>

                                {/* ROW 3 & 4: INFO ROWS (Simplified for brevity) */}
                                <tr className="bg-[#fcfcfc] h-8">
                                    <td className="sticky left-0 z-40 bg-[#fcfcfc] border-b border-r border-[#dee2e6] px-3 text-black text-[12px] pl-4">Sold Rooms</td>
                                    {days.map((day, i) => {
                                        const isToday = day.isSame(dayjs(), 'day');
                                        return (
                                            <td key={i} className={`border-b border-[#dee2e6] text-center font-bold
                                                ${isToday
                                                    ? 'bg-[#E6F4FF] border-r-2 border-r-[#91CAFF] border-l-2 border-l-[#91CAFF]'
                                                    : 'bg-[#fcfcfc] border-r'
                                                }`}>0</td>
                                        )
                                    })}
                                </tr>

                                {/* EXPANDED ROOM ROWS WITH DAILY SQUARE BOXES */}
                                {expandedGroups.has(group.type) && group.rooms.map((room) => (
                                    <tr key={room.id} className="h-12 hover:bg-gray-50">
                                        <td className="sticky left-0 z-30 bg-[#fcfcfc] border-b border-r border-[#dee2e6] px-4 py-1">
                                            <div className="font-bold text-[12px] text-gray-700">{room.id}</div>
                                            <div className="text-[9px] text-gray-400 uppercase">{room.floor}</div>
                                        </td>
                                        {days.map((day, dayIdx) => {
                                            const dateStr = day.format('YYYY-MM-DD');
                                            const isChecked = dailyStatus[`${group.type}-${dateStr}`] || false;
                                            const isToday = day.isSame(dayjs(), 'day');
                                            return (
                                                <td key={dayIdx} className={`border-b border-[#dee2e6] p-0 relative text-center
                                                    ${isToday
                                                        ? 'bg-[#E6F4FF] border-r-2 border-r-[#91CAFF] border-l-2 border-l-[#91CAFF]'
                                                        : 'bg-[#fcfcfc] border-r'
                                                    }`}>
                                                    <div className="flex justify-center items-center h-full w-full py-3">
                                                        <div
                                                            className="w-5 h-5 rounded-sm shadow-sm transition-colors duration-300"
                                                            style={{ backgroundColor: isChecked ? '#ff4d4f' : '#52c41a' }}
                                                        ></div>
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>

                    <tfoot className="sticky bottom-0 z-[55] bg-white border-t-2 border-gray-200">
                        {/* ROOMS AVAILABLE ROW */}
                        <tr className="bg-gray-50/80">
                            <td className="sticky left-0 z-40 bg-gray-50 border-b border-r border-[#dee2e6] p-3 font-bold" style={{ width: SIDEBAR_WIDTH, minWidth: SIDEBAR_WIDTH, maxWidth: SIDEBAR_WIDTH }}>
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
                        {/* OCCUPANCY ROW */}
                        <tr className="bg-gray-50/80">
                            <td className="sticky left-0 z-40 bg-gray-50 border-b border-r border-[#dee2e6] p-3 font-bold" style={{ width: SIDEBAR_WIDTH, minWidth: SIDEBAR_WIDTH, maxWidth: SIDEBAR_WIDTH }}>
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
                    </tfoot>
                </table>
            </div>

            {/* MODAL BOX - Matching Figma Design */}
            <Modal
                title={<span className="text-[16px] font-bold">Room Inventory Restriction</span>}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                closeIcon={<CloseOutlined />}
                width={420}
                centered
            >
                {selectedData && (
                    <div className="flex flex-col gap-4 text-[13px]">
                        <div className="flex flex-col gap-1.5 mt-2">
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Date:</span>
                                <span className="font-bold">{selectedData.date}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 font-medium">Stop Sell:</span>
                                <Switch
                                    size="small"
                                    checked={selectedData.stopSell}
                                    style={{ backgroundColor: selectedData.stopSell ? '#ff4d4f' : '#52c41a' }}
                                    onChange={(checked) => {
                                        setDailyStatus(prev => ({
                                            ...prev,
                                            [selectedData.key]: { ...selectedData, stopSell: checked }
                                        }));
                                        setSelectedData(prev => ({ ...prev, stopSell: checked }));
                                    }}
                                />
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Min-Stay:</span>
                                <span className="font-bold">{selectedData.minStay} days</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Max-Stay:</span>
                                <span className="font-bold">{selectedData.maxStay} days</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Close to Arrival:</span>
                                <span className="text-green-600 font-bold">{selectedData.closeArrival ? 'True' : 'False'}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Close to Departure:</span>
                                <span className="text-red-500 font-bold">{selectedData.closeDeparture ? 'True' : 'False'}</span>
                            </div>
                        </div>

                        <Divider className="my-1" />

                        <div className="flex justify-between items-center text-gray-500">
                            <span className="text-[11px] leading-tight max-w-[250px]">
                                Update Availability, Stop Sell And Setting Minimum/Maximum Lengths Of Stay In Real-Time
                            </span>
                            <EditOutlined className="text-blue-500 text-lg cursor-pointer hover:scale-110 transition-transform" />
                        </div>
                    </div>
                )}
            </Modal>
        </div >
    );
};

export default Calendar;
