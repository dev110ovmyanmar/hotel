import React, { useState, useEffect } from 'react';
import { Button, Select, Divider, Space } from 'antd';
import { CloseCircleOutlined, CheckOutlined } from '@ant-design/icons';

/**
 * FilterPopover
 * Content rendered inside the Filter Popover.
 * Uses local state so changes are only applied when the user clicks "Apply".
 * Props:
 *   filters             – { roomType, floor, ratePlan } (committed/applied values)
 *   filterOptions       – [{ label, value }] for room types
 *   floorOptions        – [{ label, value }] for floors
 *   ratePlanOptions     – [{ label, value }] for rate plans
 *   onFiltersChange     – (partialUpdate: object) => void  (called only on Apply)
 *   onReset             – () => void
 */
const FilterPopover = ({
    filters,
    filterOptions,
    floorOptions,
    ratePlanOptions,
    onFiltersChange,
    onReset,
}) => {
    // Local (draft) state — mirrors parent filters, but is only committed on Apply
    const [local, setLocal] = useState({
        roomType: filters.roomType,
        floor: filters.floor,
        ratePlan: filters.ratePlan,
    });

    // Sync local state when parent resets filters externally
    useEffect(() => {
        setLocal({
            roomType: filters.roomType,
            floor: filters.floor,
            ratePlan: filters.ratePlan,
        });
    }, [filters.roomType, filters.floor, filters.ratePlan]);

    const handleApply = () => {
        onFiltersChange(local);
    };

    const handleReset = () => {
        setLocal({ roomType: undefined, floor: undefined, ratePlan: undefined });
        onReset();
    };

    return (
        <div style={{ width: 288, padding: '4px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 8 }}>
                    Room Type
                </div>
                <Select
                    allowClear
                    // mode="multiple"
                    className="w-full"
                    style={{ width: '100%' }}
                    placeholder="All Types"
                    value={local.roomType}
                    onChange={(v) => setLocal((prev) => ({ ...prev, roomType: v }))}
                    options={filterOptions}
                />
            </div>

            <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 8 }}>
                    Floor
                </div>
                <Select
                    allowClear
                    // mode="multiple"
                    className="w-full"
                    style={{ width: '100%' }}
                    placeholder="All Floors"
                    value={local.floor}
                    onChange={(v) => setLocal((prev) => ({ ...prev, floor: v }))}
                    options={floorOptions}
                />
            </div>

            <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 8 }}>
                    Rate Plan
                </div>
                <Select
                    allowClear
                    // mode="multiple"
                    className="w-full"
                    style={{ width: '100%' }}
                    placeholder="All Rate Plans"
                    value={local.ratePlan}
                    onChange={(v) => setLocal((prev) => ({ ...prev, ratePlan: v }))}
                    options={ratePlanOptions}
                />
            </div>

            <Divider style={{ margin: '4px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
                <Button
                    type="default"
                    // icon={<CloseCircleOutlined />}
                    onClick={handleReset}
                >
                    Cancel
                </Button>
                <Button
                    type="primary"
                    // icon={<CheckOutlined />}
                    onClick={handleApply}
                >
                    Apply
                </Button>
            </div>
        </div>
    );
};

export default FilterPopover;

