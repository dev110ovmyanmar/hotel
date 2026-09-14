import React, { useState } from "react";
import { Card } from "antd";

export default function HousekeepingStatusCard({
  housekeepingData = {},
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const housekeepingTotal =
    (housekeepingData?.dirty || 0) +
    (housekeepingData?.clean || 0) +
    (housekeepingData?.inspected || 0) +
    (housekeepingData?.inprogress || 0);

  const housekeeping = [
    {
      label: "Dirty",
      color: "#faad14",
      value: housekeepingData?.dirty || 0,
    },
    {
      label: "Clean",
      color: "#52c41a",
      value: housekeepingData?.clean || 0,
    },
    {
      label: "In-progress",
      color: "#fa8c16",
      value: housekeepingData?.inprogress || 0,
    },
    {
      label: "Inspected",
      color: "#1890ff",
      value: housekeepingData?.inspected || 0,
    },
  ];

  const hoveredItem =
    hoveredIndex !== null
      ? housekeeping[hoveredIndex]
      : null;

  return (
    <Card
      title={
        <span className="text-base font-semibold">
          House Keeping Status
        </span>
      }
      className="shadow-sm border border-gray-200"
    >
      <div className="py-2">
        <div className="h-8 flex items-center justify-center">
          {hoveredItem && (
            <div
              className="flex items-center gap-2"
              style={{
                animation: "housekeepingFadeIn 0.15s ease",
              }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor:
                    hoveredItem.color,
                  boxShadow: `0 0 0 3px ${hoveredItem.color}20`,
                }}
              />

              <span
                className="text-base font-semibold"
                style={{
                  color: hoveredItem.color,
                }}
              >
                {hoveredItem.value}
              </span>

              <span className="text-sm text-gray-500 dark:text-gray-300">
                {hoveredItem.label}
              </span>
            </div>
          )}
        </div>

        <div className="w-full h-5 flex rounded-full overflow-hidden bg-gray-100 mb-14">
          {housekeeping.map((item, index) => {
            const isHovered =
              hoveredIndex === index;

            return (
              <div
                key={item.label}
                onMouseEnter={() =>
                  setHoveredIndex(index)
                }
                onMouseLeave={() =>
                  setHoveredIndex(null)
                }
                style={{
                  width:
                    housekeepingTotal > 0
                      ? `${
                          (item.value /
                            housekeepingTotal) *
                          100
                        }%`
                      : "0%",

                  backgroundColor:
                    item.color,

                  opacity: 1,

                  filter: isHovered
                    ? "brightness(1.15)"
                    : "none",

                  transition:
                    "filter 0.2s ease",
                  
                  boxShadow: isHovered
                    ? `0 0 6px ${item.color}66`
                    : "none",
                }}
                className="
                  h-full
                  cursor-pointer
                  first:rounded-l-full
                  last:rounded-r-full
                "
              />
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-y-3 text-sm">
          {housekeeping.map((item) => (
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

              <span>
                {item.label} - {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>
        {`
          @keyframes housekeepingFadeIn {
            from {
              opacity: 0;
              transform: translateY(-2px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </Card>
  );
}
