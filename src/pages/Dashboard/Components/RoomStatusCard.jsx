import React from "react";
import { Card } from "antd";

export default function RoomStatusCard({ roomData = {} }) {
  const roomTotal =
    (roomData?.available || 0) +
    (roomData?.occupied || 0) +
    (roomData?.outOfService || 0) +
    (roomData?.outOfOrder || 0);

  const roomStatus = [
    {
      label: `Occupied - ${roomData?.occupied || 0}`,
      color: "#1890ff",
      value: roomData?.occupied || 0,
    },
    {
      label: `Available - ${roomData?.available || 0}`,
      color: "#52c41a",
      value: roomData?.available || 0,
    },
    {
      label: `Out of Service - ${roomData?.outOfService || 0}`,
      color: "#fa8c16",
      value: roomData?.outOfService || 0,
    },
    {
      label: `Out of Order - ${roomData?.outOfOrder || 0}`,
      color: "#f5222d",
      value: roomData?.outOfOrder || 0,
    },
  ];

  return (
    <Card
      title={
        <span className="text-base font-semibold">
          Room Status Overview
        </span>
      }
      className="shadow-sm border border-gray-200"
    >
      <div className="flex flex-col items-center py-4">
        <div className="relative w-36 h-36 flex items-center justify-center mb-6">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 42 42"
          >
            {roomTotal > 0 &&
              roomStatus.map((item, index) => {
                const percentage =
                  (item.value / roomTotal) * 100;

                const previousPercentage = roomStatus
                  .slice(0, index)
                  .reduce(
                    (total, current) =>
                      total +
                      (current.value / roomTotal) * 100,
                    0
                  );

                return (
                  <circle
                    key={item.label}
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth="4"
                    strokeDasharray={`${percentage} ${
                      100 - percentage
                    }`}
                    strokeDashoffset={`-${previousPercentage}`}
                  />
                );
              })}
          </svg>

          <div className="absolute text-center">
            <p className="text-xs m-0">
              Total Room
            </p>

            <p className="text-xl font-bold m-0">
              {roomTotal}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full px-2 text-sm">
          {roomStatus.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2"
            >
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{
                  backgroundColor: item.color,
                }}
              />

              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
