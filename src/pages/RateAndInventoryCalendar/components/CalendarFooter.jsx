import React from 'react';
import { darkModeStyle, textWhiteInDarkStyle } from '../../../utils';

const todayDarkModeStyle = 'dark:!bg-[#1e3a5f] dark:!border-r-[#3B82F6] dark:!border-l-[#3B82F6] dark:!text-gray-200';

/**
 * CalendarFooter
 * Renders the sticky <tfoot> with Total Available and Occupancy % rows.
 * Props:
 *   dailyStats    – [{ available, sold, occupancy }]
 *   daysMeta      – [{ cellClass }]
 *   CELL_WIDTH    – number (px)
 *   SIDEBAR_WIDTH – number (px)
 */

const CalendarFooter = ({ dailyStats, daysMeta, CELL_WIDTH, SIDEBAR_WIDTH }) => (
    <tfoot className="sticky bottom-0 z-[55] bg-white border-t-2 border-gray-200">
        {/* Total Available row */}
        <tr
        // className="bg-gray-50/80"
        >
            <td
                className={`sticky left-0 z-40 bg-[#1677FF] border-b border-r border-[#dee2e6] p-3 font-bol ${darkModeStyle}`}
                style={{ width: SIDEBAR_WIDTH, minWidth: SIDEBAR_WIDTH }}
            >
                <span className="text-[12px] uppercase !text-[#FFFFFF] font-bold">Total Available</span>
            </td>
            {dailyStats.map((stat, i) => (
                <td
                    key={i}
                    className={`border-b border-[#dee2e6] text-center p-2 font-bold bg-gray-200 text-white ${daysMeta[i].cellClass} ${daysMeta[i].isToday ? todayDarkModeStyle : darkModeStyle}`}
                    style={{ width: CELL_WIDTH, minWidth: CELL_WIDTH }}
                >
                    <div className={`text-sm ${stat.available === 0 ? 'text-red-500' : 'text-green-600'}`}>
                        {stat.available}
                    </div>
                </td>
            ))}
        </tr>

        {/* Occupancy % row */}
        <tr className="bg-gray-50/80">
            {/* Header Column */}
            <td
                className={`sticky left-0 z-40 bg-[#1677FF] border-b border-r border-[#dee2e6] p-3 ${darkModeStyle}`}
                style={{ width: SIDEBAR_WIDTH, minWidth: SIDEBAR_WIDTH }}
            >
                <span className="text-[12px] uppercase !text-[#FFFFFF] font-bold">Occupancy %</span>
            </td>
            {dailyStats.map((stat, i) => (
                <td
                    key={i}
                    className={`border-b border-[#dee2e6] text-center p-2  bg-gray-200 text-white ${daysMeta[i].cellClass} ${daysMeta[i].isToday ? todayDarkModeStyle : darkModeStyle}`}
                    style={{ width: CELL_WIDTH, minWidth: CELL_WIDTH }}
                >
                    <div className="flex flex-col items-center">
                        <div className={`text-[12px] font-bold text-gray-700 ${textWhiteInDarkStyle}`}>{stat.occupancy}%</div>
                        <div className="w-full bg-gray-200 h-1 mt-1 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${stat.occupancy > 80 ? 'bg-amber-500' : 'bg-blue-500'}`}
                                style={{ width: `${stat.occupancy}%` }}
                            />
                        </div>
                    </div>
                </td>
            ))}
        </tr>
    </tfoot>
);

export default CalendarFooter;
