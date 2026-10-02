import React from 'react';
import { Button, Input, Space, Badge, DatePicker, Popover, Modal } from 'antd';
import {
    LeftOutlined, RightOutlined, DoubleLeftOutlined, DoubleRightOutlined,
    SearchOutlined, FilterOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import FilterPopover from './FilterPopover';

/**
 * CalendarHeader
 * Top bar: month navigation, search input, Today button, Filter button.
 * Props:
 *   currentDate           – dayjs object
 *   onDateChange          – (dayjsDate) => void
 *   searchQuery           – string
 *   onSearchChange        – (value: string) => void
 *   filters               – { roomTypes, ratePlans }
 *   filterOptions         – [{ label, value }] for room types
 *   ratePlanOptions       – [{ label, value }] for rate plans
 *   onFiltersChange       – (partialUpdate) => void
 *   onReset               – () => void
 *   disabled              – boolean (show skeleton/disabled state during initial load)
 *   isChangingDate        – boolean (true while date change is loading)
 *   setIsChangingDate     – (value: boolean) => void
 */
const CalendarHeader = ({
    currentDate,
    onDateChange,
    keyword,
    onKeywordChange,
    filters,
    filterOptions,
    floorOptions,
    ratePlanOptions,
    onFiltersChange,
    onReset,
    disabled = false,
    isChangingDate = false,
    setIsChangingDate,
    onRefetch,
}) => {
    const hasActiveFilter =
        !!filters.roomType ||
        !!filters.floor ||
        !!filters.ratePlan;

    const [localKeyword, setLocalKeyword] = React.useState(keyword);

    // Sync local state if parent keyword changes (e.g. on reset)
    React.useEffect(() => {
        setLocalKeyword(keyword);
    }, [keyword]);

    const isDisabled = disabled || isChangingDate;
    const [filterOpen, setFilterOpen] = React.useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = React.useState(false);
    const [pendingDate, setPendingDate] = React.useState(null);

    const confirmDateChange = (newDate) => {
        setPendingDate(newDate);
        setConfirmModalOpen(true);
    };

    const handleConfirmOk = () => {
        const dateToApply = pendingDate;
        const isSameMonth = currentDate.isSame(dateToApply, 'month');
        setConfirmModalOpen(false);
        setIsChangingDate(true);
        onDateChange(dateToApply);
        // Force refetch when same month (query key doesn't change)
        if (isSameMonth && onRefetch) {
            onRefetch();
        }
        setPendingDate(null);
    };

    const handleConfirmCancel = () => {
        setConfirmModalOpen(false);
        setPendingDate(null);
    };

    return (
        <div className="bg-white px-6 py-3 flex justify-between items-center border-b border-[#dee2e6] z-50">
            {/* Month navigation */}
            <Space>
                <DoubleLeftOutlined
                    className={`text-gray-400 cursor-pointer hover:text-blue-500 active:text-blue-700 active:scale-90 transition-all duration-150 ${isDisabled ? 'pointer-events-none opacity-50' : ''}`}
                    onClick={() => confirmDateChange(currentDate.subtract(1, 'year'))}
                />
                <LeftOutlined
                    className={`text-gray-400 cursor-pointer hover:text-blue-500 active:text-blue-700 active:scale-90 transition-all duration-150 ${isDisabled ? 'pointer-events-none opacity-50' : ''}`}
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
                    className="font-bold text-lg w-36 p-0 cursor-pointer"
                    onChange={(date) => date && confirmDateChange(date)}
                />
                <RightOutlined
                    className={`text-gray-400 cursor-pointer hover:text-blue-500 active:text-blue-700 active:scale-90 transition-all duration-150 ${isDisabled ? 'pointer-events-none opacity-50' : ''}`}
                    onClick={() => confirmDateChange(currentDate.add(1, 'month'))}
                />
                <DoubleRightOutlined
                    className={`text-gray-400 cursor-pointer hover:text-blue-500 active:text-blue-700 active:scale-90 transition-all duration-150 ${isDisabled ? 'pointer-events-none opacity-50' : ''}`}
                    onClick={() => confirmDateChange(currentDate.add(1, 'year'))}
                />
            </Space>


            <div className="flex items-center gap-4 text-blue-500">
                <div className="text-lg font-medium w-full text-center">
                    {currentDate ? currentDate.format('DD MMMM YYYY') : ''}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                {/* <Input
                    prefix={<SearchOutlined />}
                    placeholder="Enter keyword"
                    className="w-64"
                    value={localKeyword}
                    onChange={(e) => setLocalKeyword(e.target.value)}
                    onPressEnter={() => onKeywordChange(localKeyword)}
                    disabled={isDisabled}
                /> */}
                <Button type="primary" disabled={isDisabled} onClick={() => confirmDateChange(dayjs())}>
                    Today
                </Button>
                {isDisabled ? (
                    <Button icon={<FilterOutlined />} disabled>
                        Filter
                    </Button>
                ) : (
                    <Popover
                        content={
                            <FilterPopover
                                filters={filters}
                                filterOptions={filterOptions}
                                floorOptions={floorOptions}
                                ratePlanOptions={ratePlanOptions}
                                onFiltersChange={onFiltersChange}
                                onReset={onReset}
                                onClose={() => setFilterOpen(false)}
                            />
                        }
                        title="Filter"
                        trigger="click"
                        placement="bottomRight"
                        open={filterOpen}
                        onOpenChange={setFilterOpen}
                    >
                        <Badge dot={hasActiveFilter}>
                            <Button icon={<FilterOutlined />}>Filter</Button>
                        </Badge>
                    </Popover>
                )}
            </div>

            <Modal
                title="Date Change Confirmation"
                open={confirmModalOpen}
                onOk={handleConfirmOk}
                onCancel={handleConfirmCancel}
                okText="Yes"
                cancelText="No"
                transitionName=""
                maskTransitionName=""
            >
                {`Are you sure you want to change to ${pendingDate?.format('MMMM YYYY')}?`}
            </Modal>
        </div>
    );
};

export default CalendarHeader;
