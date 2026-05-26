import React from 'react';
import { Button, Input, Space, Badge, DatePicker, Popover } from 'antd';
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

    return (
        <div className="bg-white px-6 py-3 flex justify-between items-center border-b border-[#dee2e6] z-50">
            {/* Month navigation */}
            <Space>
                <DoubleLeftOutlined
                    className="text-gray-400 cursor-pointer"
                    onClick={() => onDateChange(currentDate.subtract(1, 'year'))}
                />
                <LeftOutlined
                    className="text-gray-400 cursor-pointer"
                    onClick={() => onDateChange(currentDate.subtract(1, 'month'))}
                />
                <DatePicker
                    picker="month"
                    value={currentDate}
                    format="MMMM YYYY"
                    allowClear={false}
                    suffixIcon={null}
                    variant="borderless"
                    styles={{ input: { textAlign: 'center' } }}
                    className="font-bold text-lg w-36 p-0 cursor-pointer"
                    onChange={(date) => date && onDateChange(date)}
                />
                <RightOutlined
                    className="text-gray-400 cursor-pointer"
                    onClick={() => onDateChange(currentDate.add(1, 'month'))}
                />
                <DoubleRightOutlined
                    className="text-gray-400 cursor-pointer"
                    onClick={() => onDateChange(currentDate.add(1, 'year'))}
                />
            </Space>

            {/* Actions */}
            <div className="flex items-center gap-3">
                {/* <Input
                    prefix={<SearchOutlined />}
                    placeholder="Enter keyword"
                    className="w-64"
                    value={localKeyword}
                    onChange={(e) => setLocalKeyword(e.target.value)}
                    onPressEnter={() => onKeywordChange(localKeyword)}
                    disabled={disabled}
                /> */}
                <Button type="primary" onClick={() => onDateChange(dayjs())}>
                    Today
                </Button>
                {disabled ? (
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
                            />
                        }
                        title="Filter"
                        trigger="click"
                        placement="bottomRight"
                    >
                        <Badge dot={hasActiveFilter}>
                            <Button icon={<FilterOutlined />}>Filter</Button>
                        </Badge>
                    </Popover>
                )}
            </div>
        </div>
    );
};

export default CalendarHeader;
