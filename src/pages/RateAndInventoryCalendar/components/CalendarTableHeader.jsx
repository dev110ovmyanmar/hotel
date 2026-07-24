import React from 'react';
import { darkModeStyle } from '../../../utils';

const todayDarkModeStyle = 'dark:!bg-[#1e3a5f] dark:!border-r-[#3B82F6] dark:!border-l-[#3B82F6] dark:!text-gray-200';

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
                    className={`sticky top-0 z-[50] border-b border-[#dee2e6] text-center p-2 ${cellClass} ${isToday ? todayDarkModeStyle : darkModeStyle}`}
                    style={{ width: CELL_WIDTH, minWidth: CELL_WIDTH }}
                >
                    <div className={`text-[10px] uppercase font-semibold ${isToday ? 'text-blue-500' : 'text-gray-400'}`}>
                        {day.format('MMM')}
                    </div>
                    {isToday ? (
                        <>
                            <div
                                style={{
                                    width: 30, height: 30,
                                    borderRadius: '50%',
                                    backgroundColor: '#2563EB',
                                    color: '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 14, fontWeight: 700,
                                    margin: '2px auto',
                                    boxShadow: '0 2px 8px rgba(37,99,235,0.45)',
                                }}
                            >
                                {day.format('D')}
                            </div>
                            <div className="text-[11px] text-blue-500 font-bold">{day.format('ddd')}</div>
                            <div style={{ fontSize: 9, fontWeight: 700, color: '#2563EB', letterSpacing: 1, textTransform: 'uppercase' }}>Today</div>
                        </>
                    ) : (
                        <>
                            <div className="text-base font-bold text-gray-700 dark:text-gray-100">{day.format('D')}</div>
                            <div className="text-[11px] text-gray-500 dark:text-[#8AAEFF]">{day.format('ddd')}</div>
                        </>
                    )}
                </th>
            ))}
        </tr>
    </thead>
);

export default CalendarTableHeader;
