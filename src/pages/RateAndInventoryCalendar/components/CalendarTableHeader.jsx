import React from 'react';
import { darkModeStyle } from '../../../utils';

/**
 * CalendarTableHeader
 * Renders the sticky <thead> with one <th> per day.
 * Props:
 *   daysMeta    – [{ day, dateStr, isToday, cellClass }]
 *   CELL_WIDTH  – number (px)
 *   SIDEBAR_WIDTH – number (px)
 */




const CalendarTableHeader = ({ daysMeta, CELL_WIDTH, SIDEBAR_WIDTH }) => (
    <thead>
        <tr>
            <th
                className={`sticky top-0 left-0 z-[60] bg-[#f8f9fa] border-b border-r border-[#dee2e6] p-4 text-left font-bold ${darkModeStyle}`}
                style={{ width: SIDEBAR_WIDTH, minWidth: SIDEBAR_WIDTH }}
            >
                Room Type / Rate Plan
            </th>
            {daysMeta.map(({ day, isToday, cellClass }, i) => (
                <th
                    key={i}
                    className={`sticky top-0 z-[50] border-b border-[#dee2e6] text-center p-2 ${cellClass} ${darkModeStyle}`}
                    style={{ width: CELL_WIDTH, minWidth: CELL_WIDTH }}
                >
                    <div className={`text-[11px] uppercase ${isToday ? 'text-blue-500 font-bold' : 'text-gray-400'}`}>
                        {day.format('MMM')}
                    </div>
                    <div className={`text-[17px] font-bold ${isToday ? 'text-blue-600' : ''}`}>
                        {day.format('D')}
                    </div>
                    <div className={`text-[12px] ${isToday ? 'text-blue-500 font-bold' : 'text-gray-500'}`}>
                        {day.format('ddd')}
                    </div>
                </th>
            ))}
        </tr>
    </thead>
);

export default CalendarTableHeader;
