import React from 'react';
import { Button, Input, Select, Divider } from 'antd';
import { SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';

/**
 * FilterPopover
 * Content rendered inside the Filter Popover.
 * Props:
 *   filters             – { roomTypes: [], ratePlans: [] }
 *   filterOptions       – [{ label, value }] for room types
 *   ratePlanOptions     – [{ label, value }] for rate plans
 *   onFiltersChange     – (partialUpdate: object) => void
 *   onReset             – () => void
 */
const FilterPopover = ({
    filters,
    filterOptions,
    floorOptions,
    ratePlanOptions,
    onFiltersChange,
    onReset,
}) => (
    <div className="w-72 p-1 flex flex-col gap-4">
        <div>
            <div className="text-[11px] font-bold text-gray-400 uppercase mb-2">Room Type</div>
            <Select
                allowClear
                className="w-full"
                placeholder="All Types"
                value={filters.roomType}
                onChange={(v) => onFiltersChange({ roomType: v })}
                options={filterOptions}
            />
        </div>

        <div>
            <div className="text-[11px] font-bold text-gray-400 uppercase mb-2">Floor</div>
            <Select
                allowClear
                className="w-full"
                placeholder="All Floors"
                value={filters.floor}
                onChange={(v) => onFiltersChange({ floor: v })}
                options={floorOptions}
            />
        </div>

        <div>
            <div className="text-[11px] font-bold text-gray-400 uppercase mb-2">Rate Plan</div>
            <Select
                allowClear
                className="w-full"
                placeholder="All Rate Plans"
                value={filters.ratePlan}
                onChange={(v) => onFiltersChange({ ratePlan: v })}
                options={ratePlanOptions}
            />
        </div>

        <Divider className="my-2" />

        <Button type="text" danger block icon={<CloseCircleOutlined />} onClick={onReset}>
            Reset Filters
        </Button>
    </div>
);

export default FilterPopover;
