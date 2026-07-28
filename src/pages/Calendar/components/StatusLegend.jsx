import React from 'react';
import { STATUS_COLORS } from '../Calendar';

const StatusLegend = () => (
  <div className="absolute bottom-0 left-0 right-0 z-[100] flex flex-col bg-white/80 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
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
);

export default StatusLegend;
