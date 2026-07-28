import React from 'react';
import { Button, Select, Divider } from 'antd';

const FilterPopover = ({
  localFilters,
  setLocalFilters,
  roomTypeOptions,
  floorOptions,
  reservationRoomStatus,
  setFilters,
  setFilterOpen,
}) => (
  <div style={{ width: 288, padding: '4px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 8 }}>Room Type</div>
      <Select
        allowClear className="w-full" style={{ width: '100%' }} placeholder="All Types"
        value={localFilters.roomType}
        onChange={(v) => setLocalFilters(prev => ({ ...prev, roomType: v }))}
        options={roomTypeOptions}
      />
    </div>
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 8 }}>Floor</div>
      <Select
        allowClear className="w-full" style={{ width: '100%' }} placeholder="All Floors"
        value={localFilters.floor}
        onChange={(v) => setLocalFilters(prev => ({ ...prev, floor: v }))}
        options={floorOptions}
      />
    </div>
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 8 }}>Booking Status</div>
      <Select
        allowClear className="w-full" style={{ width: '100%' }} placeholder="All Statuses"
        value={localFilters.statuses}
        onChange={(v) => setLocalFilters(prev => ({ ...prev, statuses: v }))}
        options={reservationRoomStatus}
      />
    </div>
    <Divider style={{ margin: '4px 0' }} />
    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
      <Button
        type="default"
        onClick={() => {
          setLocalFilters({ roomType: null, floor: null, statuses: null });
          setFilters({ roomType: null, floor: null, statuses: null });
          setFilterOpen(false);
        }}
      >
        Cancel
      </Button>
      <Button
        type="primary"
        onClick={() => {
          setFilters(localFilters);
          setFilterOpen(false);
        }}
      >
        Apply
      </Button>
    </div>
  </div>
);

export default FilterPopover;
