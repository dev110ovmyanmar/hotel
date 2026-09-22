import React from 'react';
import { Input } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import { darkModeStyle } from '../../../utils';

const GroupRow = React.memo(({ group, days, expandedGroups, toggleGroup, CELL_WIDTH, SIDEBAR_WIDTH, checkIsToday, todayDarkStyle }) => (
  <tr className="bg-[#fcfcfc] cursor-pointer hover:bg-gray-100 h-15" onClick={() => toggleGroup(group.name)}>
    <td className={`sticky left-0 z-40 bg-gray-200 border-b border-r border-[#dee2e6] p-3 font-bold ${darkModeStyle}`} style={{ width: SIDEBAR_WIDTH, minWidth: SIDEBAR_WIDTH, maxWidth: SIDEBAR_WIDTH, borderTop: '3px solid #6b7280' }}>
      <div className="flex justify-between items-center">
        <span className="text-[12px] truncate">{group.name}</span>
        {expandedGroups.has(group.name) ? <UpOutlined className="!text-[9px] " /> : <DownOutlined className="!text-[9px] " />}
      </div>
    </td>
    {days.map((day, i) => {
      const isToday = checkIsToday(day);
      const dayStr = day.format('YYYY-MM-DD');
      const dateData = (group.dates || []).find(d => d.date === dayStr);
      const availableRooms = dateData?.availability?.availableRooms;
      return (
        <td key={i}
          className={`border-b border-[#dee2e6] text-center p-1
          ${isToday
              ? `bg-[#DBEAFE] dark:!bg-[#1e3a5f] border-r-2 border-r-[#3B82F6] border-l-2 border-l-[#3B82F6] ${todayDarkStyle}`
              : `bg-gray-200 border-r ${darkModeStyle}`
            }`}
          style={{ width: CELL_WIDTH, minWidth: CELL_WIDTH, maxWidth: CELL_WIDTH, borderTop: '3px solid #6b7280' }}>
          <div className={`flex flex-col  items-center justify-center`}>
            <div className="font-bold flex flex-col items-center">
              <Input readOnly value={availableRooms} style={{ padding: '0 4px', height: '24px', fontSize: '12px' }} className="text-center text-[12px] font-bold text-green-600 px-1 !w-[50px] !border-gray-200 !rounded" />
            </div>
          </div>
        </td>
      );
    })}
  </tr>
));

GroupRow.displayName = 'GroupRow';
export default GroupRow;
