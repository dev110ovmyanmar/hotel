import React, { useState, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { Button, Input, Badge, DatePicker, Popover, Modal } from 'antd';
import {
  LeftOutlined, RightOutlined, DoubleLeftOutlined, DoubleRightOutlined,
  SearchOutlined, FilterOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import FilterPopover from './FilterPopover';

const CalendarHeader = ({
  currentDate,
  setCurrentDate,
  onRefetch,
  isLoading,
  isFetching,
  isChangingDate,
  setIsChangingDate,
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
  const isDisabled = isLoading || isFetching || isChangingDate;
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingDate, setPendingDate] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const confirmDateChange = (newDate) => {
    setPendingDate(newDate);
    setConfirmModalOpen(true);
  };

  const handleConfirmOk = useCallback(() => {
    const dateToApply = pendingDate;
    const isSameMonth = currentDate.isSame(dateToApply, 'month');
    // Step 1: force disabled state to paint immediately
    flushSync(() => {
      setConfirming(true);
      setIsChangingDate(true);
    });
    // Step 2: close modal + fire API (after disabled buttons are painted)
    requestAnimationFrame(() => {
    setConfirmModalOpen(false);
    setCurrentDate(dateToApply);
    if (isSameMonth && onRefetch) {
      onRefetch();
    }
    setPendingDate(null);
    setConfirming(false);
    })
  }, [pendingDate, currentDate, setIsChangingDate, setCurrentDate, onRefetch]);

  const handleConfirmCancel = () => {
    setConfirmModalOpen(false);
    setPendingDate(null);
  };

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
            className={`text-gray-400 cursor-pointer hover:text-blue-500 active:text-blue-700 active:scale-90 transition-all duration-150 ${isDisabled ? 'pointer-events-none opacity-50' : ''}`}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => confirmDateChange(currentDate.subtract(1, 'year'))}
          />
          <LeftOutlined
            className={`text-gray-400 cursor-pointer hover:text-blue-500 active:text-blue-700 active:scale-90 transition-all duration-150 ${isDisabled ? 'pointer-events-none opacity-50' : ''}`}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => confirmDateChange(currentDate.subtract(1, 'month'))}
          />
          <DatePicker
            picker="month"
            value={currentDate}
            format="MMMM YYYY"
            allowClear={false}
            suffixIcon={null}
            variant="borderless"
            disabled={isDisabled}
            styles={{ input: { textAlign: 'center' } }}
            className="font-bold text-lg w-44 p-0 cursor-pointer"
            onChange={(date) => date && confirmDateChange(date)}
          />
          <RightOutlined
            className={`text-gray-400 cursor-pointer hover:text-blue-500 active:text-blue-700 active:scale-90 transition-all duration-150 ${isDisabled ? 'pointer-events-none opacity-50' : ''}`}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => confirmDateChange(currentDate.add(1, 'month'))}
          />
          <DoubleRightOutlined
            className={`text-gray-400 cursor-pointer hover:text-blue-500 active:text-blue-700 active:scale-90 transition-all duration-150 ${isDisabled ? 'pointer-events-none opacity-50' : ''}`}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => confirmDateChange(currentDate.add(1, 'year'))}
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
              <SearchOutlined className={`${isDisabled ? 'text-gray-300' : 'text-gray-400'}`} />
            ) : null
          }
          suffix={
            searchInput ? (
              <SearchOutlined
                className={`cursor-pointer ${isDisabled ? 'text-gray-300' : 'text-blue-500 hover:text-blue-600'}`}
                onClick={() => !isDisabled && setSearchQuery(searchInput)}
              />
            ) : null
          }
          placeholder="Search Room No..."
          className="w-64"
          value={searchInput}
          disabled={isDisabled}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && setSearchQuery(searchInput)}
          allowClear
          onClear={() => { setSearchInput(''); setSearchQuery(''); }}
        />
        <Button
          type="primary"
          disabled={isDisabled}
          style={isDisabled ? { opacity: 0.65, backgroundColor: '#1677ff', borderColor: '#1677ff', color: '#fff', cursor: 'not-allowed' } : {}}
          onClick={() => confirmDateChange(dayjs())}
        >
          Today
        </Button>
        <Popover
          content={filterContent}
          title="Filter Rooms"
          trigger="click"
          placement="bottomRight"
          open={filterOpen && !isDisabled}
          onOpenChange={(v) => {
            if (v) setLocalFilters({ ...filters });
            setFilterOpen(v);
          }}
        >
          <Badge dot={Object.values(filters).some(f => f && f.length > 0)}>
            <Button icon={<FilterOutlined />} disabled={isDisabled}>Filter</Button>
          </Badge>
        </Popover>
      </div>

      <Modal
        title="Confirm Date Change"
        open={confirmModalOpen}
        onOk={handleConfirmOk}
        onCancel={handleConfirmCancel}
        okText="Yes"
        cancelText="No"
        okButtonProps={{
          disabled: isChangingDate || confirming,
          style: (isChangingDate || confirming) ? { opacity: 0.65, backgroundColor: '#1677ff', borderColor: '#1677ff', color: '#fff', cursor: 'not-allowed' } : {}
        }}
        cancelButtonProps={{ disabled: isChangingDate || confirming }}
        transitionName=""
        maskTransitionName=""
      >
        {`Are you sure you want to change to ${pendingDate?.format('MMMM YYYY')}?`}
      </Modal>
    </div>
  );
};

export default CalendarHeader;
