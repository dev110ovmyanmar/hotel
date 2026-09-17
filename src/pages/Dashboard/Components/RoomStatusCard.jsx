import React, { useState } from "react";
import { Card } from "antd";

export default function RoomStatusCard({ roomData = {} }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const roomTotal = roomData?.total

  const roomStatus = [
    {
      label: "Available",
      color: "#52c41a",
      value: roomData?.available || 0,
    },
    {
      label: "Out of Order",
      color: "#f5222d",
      value: roomData?.outOfOrder || 0,
    },
    {
      label: "Out of Service",
      color: "#fa8c16",
      value: roomData?.outOfService || 0,
    },
    {
      label: "Occupied",
      color: "#1890ff",
      value: roomData?.occupied || 0,
    },
  ];

  const hoveredItem =
    hoveredIndex !== null
      ? roomStatus[hoveredIndex]
      : null;

  const radius = 15.8;
  const normalStroke = 5;
  const hoverStroke = 5.8;
  const gap = 1.5;

  const segments = [];

  if (roomTotal > 0) {
    let accumulated = 0;

    roomStatus.forEach((item) => {
      const percentage =
        (item.value / roomTotal) * 100;

      segments.push({
        ...item,
        percentage,
        startPercentage: accumulated,
      });

      accumulated += percentage;
    });
  }

  return (
    <Card
      title={
        <span className="text-base font-semibold">
          Room Status Overview
        </span>
      }
      className="shadow-sm border border-gray-200 bg-slate-100"
    >
      <div className="flex flex-col items-center py-4">

        <div className="relative w-60 h-60">

          <svg
            viewBox="0 0 42 42"
            className="w-full h-full overflow-visible"
          >

            <circle
              cx="21"
              cy="21"
              r={radius}
              fill="none"
              stroke="#EEF2F8"
              strokeWidth={normalStroke}
            />

            {segments.map((item, index) => {
              const isHovered =
                hoveredIndex === index;

              const segmentLength = Math.max(
                item.percentage - gap,
                0
              );

              return (
                <circle
                  key={item.label}
                  cx="21"
                  cy="21"
                  r={radius}
                  fill="none"
                  stroke={item.color}
                  pathLength="100"
                  strokeDasharray={`${segmentLength} 100`}
                  strokeDashoffset={`-${item.startPercentage}`}
                  strokeWidth={
                    isHovered
                      ? hoverStroke
                      : normalStroke
                  }
                  strokeLinecap="round"
                  className="cursor-pointer"
                  style={{

                    filter: isHovered
                      ? `
                          brightness(1.0)
                          drop-shadow(
                            0 2px 4px ${item.color}66
                          )
                        `
                      : "none",

                    transition:
                      "stroke-width 0.2s ease, filter 0.2s ease",
                  }}
                  onMouseEnter={() =>
                    setHoveredIndex(index)
                  }
                  onMouseLeave={() =>
                    setHoveredIndex(null)
                  }
                />
              );
            })}
          </svg>

          {/* circle inner */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">

            <div className="text-xs text-gray-400">
              Total Room
            </div>

            <div className="text-3xl font-bold text-gray-700 dark:text-gray-400 mt-1">
              {roomTotal}
            </div>
          </div>

          {/* hover show text */}
          {hoveredItem && (
            <div
              className="absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap"
              style={{
                animation:
                  "roomHoverIn 0.15s ease",
              }}
            >
              <div className="flex items-center gap-2">

                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      hoveredItem.color,
                    boxShadow: `0 0 0 4px ${hoveredItem.color}20`,
                  }}
                />

                <span
                  className="text-2xl font-bold"
                  style={{
                    color: hoveredItem.color,
                  }}
                >
                  {hoveredItem.value}
                </span>

                <span className="text-xs text-gray-500 dark:text-gray-300">
                  {hoveredItem.label}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* status listing */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full px-2 text-sm">
          {roomStatus.map((item, index) => (
            <div
              key={item.label}
              className="flex items-center gap-2 "

            >
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{
                  backgroundColor: item.color,
                }}
              />

              <span>
                {item.label} - {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

