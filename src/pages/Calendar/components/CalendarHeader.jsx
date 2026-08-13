import React from 'react';
import { Button, Input, Space, Badge, DatePicker, Popover } from 'antd';
import {
  LeftOutlined, RightOutlined, DoubleLeftOutlined, DoubleRightOutlined,
  SearchOutlined, FilterOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import FilterPopover from './FilterPopover';

const CalendarHeader = ({
  currentDate,
  setCurrentDate,
  isLoading,
  isFetching,
  searchInput,
  setSearchInput,
  setSearchQuery,
  filterOpen,
  setFilterOpen,
  filters,
  setFilters,
  localFilters,
  setLocalFilters,
  roomTypeOptions,
  floorOptions,
  reservationRoomStatus,
}) => {
  const disabled = isLoading || isFetching;

  const filterContent = (
    <FilterPopover
      localFilters={localFilters}
      setLocalFilters={setLocalFilters}
      roomTypeOptions={roomTypeOptions}
      floorOptions={floorOptions}
      reservationRoomStatus={reservationRoomStatus}
      setFilters={setFilters}
      setFilterOpen={setFilterOpen}
    />
  );

  return (
    <div className="bg-white px-6 py-3 flex justify-between items-center border-b border-[#dee2e6] z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <DoubleLeftOutlined
            className={`text-gray-400 cursor-pointer hover:text-blue-500 active:text-blue-700 active:scale-90 transition-all duration-150 ${disabled ? 'pointer-events-none opacity-50' : ''}`}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setCurrentDate(currentDate.subtract(1, 'year'))}
          />
          <LeftOutlined
            className={`text-gray-400 cursor-pointer hover:text-blue-500 active:text-blue-700 active:scale-90 transition-all duration-150 ${disabled ? 'pointer-events-none opacity-50' : ''}`}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))}
          />
          <DatePicker
            picker="date"
            value={currentDate}
            format="MMMM YYYY"
            allowClear={false}
            suffixIcon={null}
            variant="borderless"
            disabled={disabled}
            styles={{ input: { textAlign: 'center' } }}
            className="font-bold text-lg w-44 p-0 cursor-pointer"
            onChange={(date) => date && setCurrentDate(date)}
          />
          <RightOutlined
            className={`text-gray-400 cursor-pointer hover:text-blue-500 active:text-blue-700 active:scale-90 transition-all duration-150 ${disabled ? 'pointer-events-none opacity-50' : ''}`}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setCurrentDate(currentDate.add(1, 'month'))}
          />
          <DoubleRightOutlined
            className={`text-gray-400 cursor-pointer hover:text-blue-500 active:text-blue-700 active:scale-90 transition-all duration-150 ${disabled ? 'pointer-events-none opacity-50' : ''}`}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setCurrentDate(currentDate.add(1, 'year'))}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 text-blue-500">
        <div className="text-lg font-medium w-full text-center">
          {currentDate ? currentDate.format('DD MMMM YYYY') : ''}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Input
          prefix={
            !searchInput ? (
              <SearchOutlined className={`${disabled ? 'text-gray-300' : 'text-gray-400'}`} />
            ) : null
          }
          suffix={
            searchInput ? (
              <SearchOutlined
                className={`cursor-pointer ${disabled ? 'text-gray-300' : 'text-blue-500 hover:text-blue-600'}`}
                onClick={() => !disabled && setSearchQuery(searchInput)}
              />
            ) : null
          }
          placeholder="Search Room No..."
          className="w-64"
          value={searchInput}
          disabled={disabled}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && setSearchQuery(searchInput)}
          allowClear
          onClear={() => { setSearchInput(''); setSearchQuery(''); }}
        />
        <Button type="primary" disabled={disabled} onClick={() => setCurrentDate(dayjs())}>Today</Button>
        <Popover
          content={filterContent}
          title="Filter Rooms"
          trigger="click"
          placement="bottomRight"
          open={filterOpen && !disabled}
          onOpenChange={(v) => {
            if (v) setLocalFilters({ ...filters });
            setFilterOpen(v);
          }}
        >
          <Badge dot={Object.values(filters).some(f => f && f.length > 0)}>
            <Button icon={<FilterOutlined />} disabled={disabled}>Filter</Button>
          </Badge>
        </Popover>
      </div>
    </div>
  );
};

export default CalendarHeader;
