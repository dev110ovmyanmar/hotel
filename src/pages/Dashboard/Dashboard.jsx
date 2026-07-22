import React from 'react';
import { Card, Row, Col, Progress } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { queryClient } from './../../app/queryClient';
import { IoTrendingDownSharp, IoTrendingUpSharp } from "react-icons/io5";

export default function Dashboard() {
  const  initData = queryClient.getQueryData(["initData", "authenticated"]);
  const metrics = [
    { title: 'Total Revenue', value: '13,000,000 MMK', trend: 'down', percentage: '3%' },
    { title: 'Total Reservation', value: '108', trend: 'up', percentage: '3%' },
    { title: 'Check-In', value: '12', trend: 'up', percentage: '3%' },
    { title: 'Check-Out', value: '9', trend: 'up', percentage: '3%' },
  ];

  const roomStatus = [
    { label: 'Occupied - 91', color: '#1890ff' },
    { label: 'Available - 36', color: '#52c41a' },
    { label: 'Dirty - 18', color: '#faad14' },
    { label: 'Cleaning - 27', color: '#fa8c16' },
    { label: 'Maintenance - 14', color: '#f5222d' },
  ];

  const housekeeping = [
    { label: 'Dirty - 3', color: '#faad14', width: '13.6%' },
    { label: 'Clean - 6', color: '#52c41a', width: '27.2%' },
    { label: 'In-progress - 2', color: '#fa8c16', width: '9.1%' },
    { label: 'Inspected - 6', color: '#1890ff', width: '27.2%' },
    { label: 'Out-of-order - 3', color: '#f5222d', width: '13.6%' },
    { label: 'Out-of-service - 2', color: '#bfbfbf', width: '9.3%' },
  ];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sun', 'Sat'];

  return (
    <div className="p-6  min-h-screen font-sans">
      <h1 className="text-xl font-semibold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((item, index) => (
          <Card key={index} className="shadow-sm rounded-lg border border-gray-200">
            <div className="text-sm font-medium  mb-1">{item.title}</div>
            <div className="text-xl font-bold mb-3 ">{item.value}</div>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xl font-semibold ${
                item.trend === 'up' 
                  ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                  : 'bg-red-50 text-red-500 border border-red-200'
              }`}
            >
              {item.trend === 'up' ? <IoTrendingUpSharp /> : <IoTrendingDownSharp />}
              {item.percentage}
            </span>
            <span className="text-xs text-gray-400 ml-2">From last week</span>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-8">
          
          <Card title={<span className="text-base font-semibold">Revenue Trend</span>} className="shadow-sm border border-gray-200">
            <div className="relative h-64 w-full flex flex-col justify-between pt-4">
              {[50, 40, 30, 20, 10, 0].map((val) => (
                <div key={val} className="flex items-center w-full text-xs text-gray-400">
                  <span className="w-8 text-right pr-2">{val}</span>
                  <div className="flex-1 border-b border-dashed border-gray-200"></div>
                </div>
              ))}
              
              <div className="absolute inset-0 left-8 right-0 top-4 bottom-6">
                <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
                  <path
                    d="M 50 140 L 150 90 L 250 80 L 350 95 L 450 40 L 550 30 L 650 42"
                    fill="none"
                    stroke="#1890ff"
                    strokeWidth="2"
                  />
                  {[
                    { cx: 50, cy: 140 }, { cx: 150, cy: 90 }, { cx: 250, cy: 80 },
                    { cx: 350, cy: 95 }, { cx: 450, cy: 40 }, { cx: 550, cy: 30 }, { cx: 650, cy: 42 }
                  ].map((pt, i) => (
                    <circle key={i} cx={pt.cx} cy={pt.cy} r="4" fill="#ffffff" stroke="#1890ff" strokeWidth="2" />
                  ))}
                </svg>
              </div>

              <div className="flex justify-between pl-10 pr-4 mt-2 text-xs text-gray-500">
                {days.map((day) => <span key={day}>{day}</span>)}
              </div>
            </div>
          </Card>

          <Card 
            title={
              <div className="flex justify-between items-center w-full">
                <span className="text-base font-semibold">Occupancy %</span>
                <div className="flex gap-4 text-xs font-normal">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#0052cc] rounded-sm"></span>Occupied</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#80b3ff] rounded-sm"></span>Vacant</span>
                </div>
              </div>
            }
            className="shadow-sm border border-gray-200"
          >
            <div className="h-72 w-full flex flex-col justify-between pt-4">
              {['100%', '80%', '60%', '40%', '20%', '0%'].map((val) => (
                <div key={val} className="flex items-center w-full text-xs text-gray-400">
                  <span className="w-10 text-right pr-2">{val}</span>
                  <div className="flex-1 border-b border-dashed border-gray-200"></div>
                </div>
              ))}

              <div className="absolute flex justify-between items-end left-16 right-6 top-[70px] bottom-[54px]">
                {[
                  { occupied: 35, vacant: 65 },
                  { occupied: 55, vacant: 45 },
                  { occupied: 65, vacant: 35 },
                  { occupied: 72, vacant: 28 },
                  { occupied: 83, vacant: 17 },
                  { occupied: 89, vacant: 11 },
                  { occupied: 78, vacant: 22 },
                ].map((bar, idx) => (
                  <div key={idx} className="w-8 h-full flex flex-col justify-end rounded-t overflow-hidden">
                    <div style={{ height: `${bar.vacant}%` }} className="bg-[#80b3ff]"></div>
                    <div style={{ height: `${bar.occupied}%` }} className="bg-[#0052cc]"></div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pl-14 pr-4 mt-2 text-xs text-gray-500">
                {days.map((day) => <span key={day}>{day}</span>)}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          
          <Card title={<span className="text-base font-semibold">Room Status Overview</span>} className="shadow-sm border border-gray-200">
            <div className="flex flex-col items-center py-4">
              <div className="relative w-36 h-36 flex items-center justify-center mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 42 42">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#1890ff" strokeWidth="4" strokeDasharray="50 100" strokeDashoffset="0"></circle>
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#52c41a" strokeWidth="4" strokeDasharray="20 100" strokeDashoffset="-50"></circle>
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#fa8c16" strokeWidth="4" strokeDasharray="15 100" strokeDashoffset="-70"></circle>
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#faad14" strokeWidth="4" strokeDasharray="10 100" strokeDashoffset="-85"></circle>
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f5222d" strokeWidth="4" strokeDasharray="5 100" strokeDashoffset="-95"></circle>
                </svg>
                <div className="absolute text-center">
                  <p className="text-xs m-0">Total Room</p>
                  <p className="text-xl font-bold  m-0">182</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full px-2 text-sm ">
                {roomStatus.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card title={<span className="text-base font-semibold">Vip Member</span>} className="shadow-sm border border-gray-200">
            <div className="grid grid-cols-3 text-center py-2">
              <div>
                <div className="text-xs  mb-1">Arrival</div>
                <div className="text-lg font-bold ">3</div>
              </div>
              <div>
                <div className="text-xs  mb-1">In-house</div>
                <div className="text-lg font-bold ">3</div>
              </div>
              <div>
                <div className="text-xs  mb-1">Departure</div>
                <div className="text-lg font-bold ">3</div>
              </div>
            </div>
          </Card>

          <Card title={<span className="text-base font-semibold">House Keeping Status</span>} className="shadow-sm border border-gray-200">
            <div className="py-2">
              <div className="w-full h-5 flex rounded-full overflow-hidden bg-gray-100 mb-6">
                {housekeeping.map((item, index) => (
                  <div 
                    key={index} 
                    style={{ width: item.width, backgroundColor: item.color }} 
                    className="h-full first:rounded-l-full last:rounded-r-full"
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-y-3 text-sm ">
                {housekeeping.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}