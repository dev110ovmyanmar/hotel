import React from 'react';
import { darkModeStyle } from '../../../utils';

const StatsRows = React.memo(({ dailyStats, days, CELL_WIDTH, SIDEBAR_WIDTH, checkIsToday, todayDarkStyle, todayDarkModeStyle }) => (
  <>
    <tr className="bg-gray-50/80">
      <td className={`sticky left-0 z-40 bg-[#1677FF] border-b border-r border-[#dee2e6] p-3 font-bold ${darkModeStyle}`} style={{ width: SIDEBAR_WIDTH, minWidth: SIDEBAR_WIDTH, maxWidth: SIDEBAR_WIDTH }}>
        <span className="text-[11px] uppercase !text-[#FFFFFF] font-bold">Rooms Available</span>
      </td>
      {dailyStats.map((stat, i) => {
        const isZero = stat.available === 0;
        const isToday = checkIsToday(days[i]);
        return (
          <td key={i} className={`border-b border-[#dee2e6] text-center p-2 font-bold
              ${isToday
              ? 'bg-[#DBEAFE] border-r-2 border-r-[#3B82F6] border-l-2 border-l-[#3B82F6]'
              : 'bg-[#c4c9d4] border-r'
            } ${isToday ? todayDarkModeStyle : darkModeStyle}`} style={{ width: CELL_WIDTH, minWidth: CELL_WIDTH, maxWidth: CELL_WIDTH }}>
            <div className={`text-sm ${isZero ? 'text-red-500' : 'text-green-600'}`}>
              {stat.available}
            </div>
          </td>
        );
      })}
    </tr>
    <tr className="bg-gray-50/80">
      <td className={`sticky left-0 z-40 bg-[#1677FF] border-b border-r border-[#dee2e6] p-3 font-bold ${darkModeStyle}`} style={{ width: SIDEBAR_WIDTH, minWidth: SIDEBAR_WIDTH, maxWidth: SIDEBAR_WIDTH }}>
        <span className="text-[11px] uppercase !text-[#FFFFFF] font-bold">Occupancy %</span>
      </td>
      {dailyStats.map((stat, i) => {
        const isToday = checkIsToday(days[i]);
        return (
          <td key={i} className={`border-b border-[#dee2e6] text-center p-2
              ${isToday
              ? 'bg-[#DBEAFE] border-r-2 border-r-[#3B82F6] border-l-2 border-l-[#3B82F6]'
              : 'bg-[#c4c9d4] border-r'
            } ${isToday ? todayDarkModeStyle : darkModeStyle}`} style={{ width: CELL_WIDTH, minWidth: CELL_WIDTH, maxWidth: CELL_WIDTH }}>
            <div className="flex flex-col items-center">
              <div className="text-[11px] font-bold">{stat.occupancy}%</div>
              <div className="w-full bg-gray-200 h-1 mt-1 rounded-full overflow-hidden">
                <div
                  className={`h-full ${stat.occupancy > 80 ? 'bg-amber-500' : 'bg-blue-500'}`}
                  style={{ width: `${stat.occupancy}%` }}
                />
              </div>
            </div>
          </td>
        );
      })}
    </tr>
  </>
));

StatsRows.displayName = 'StatsRows';
export default StatsRows;
