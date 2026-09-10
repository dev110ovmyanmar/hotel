import React from "react";
import { Card } from "antd";

export default function HousekeepingStatusCard({
  housekeepingData = {},
}) {
  const housekeepingTotal =
    (housekeepingData?.dirty || 0) +
    (housekeepingData?.clean || 0) +
    (housekeepingData?.inspected || 0) +
    (housekeepingData?.inprogress || 0);

  const housekeeping = [
    {
      label: `Dirty - ${housekeepingData?.dirty || 0}`,
      color: "#faad14",
      value: housekeepingData?.dirty || 0,
    },
    {
      label: `Clean - ${housekeepingData?.clean || 0}`,
      color: "#52c41a",
      value: housekeepingData?.clean || 0,
    },
    {
      label: `In-progress - ${housekeepingData?.inprogress || 0}`,
      color: "#fa8c16",
      value: housekeepingData?.inprogress || 0,
    },
    {
      label: `Inspected - ${housekeepingData?.inspected || 0}`,
      color: "#1890ff",
      value: housekeepingData?.inspected || 0,
    },
  ];

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
        <div className="w-full h-5 flex rounded-full overflow-hidden bg-gray-100 mb-6">
          {housekeeping.map((item) => (
            <div
              key={item.label}
              style={{
                width:
                  housekeepingTotal > 0
                    ? `${(item.value / housekeepingTotal) * 100}%`
                    : "0%",
                backgroundColor: item.color,
              }}
              className="h-full first:rounded-l-full last:rounded-r-full"
            />
          ))}
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

              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
