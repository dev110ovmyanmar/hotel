import React from "react";
import { Spin } from "antd";
import useApiQuery from "../../hooks/useApiQuery";
import { fetchDashboard } from "../../api/dashboardApi";
import HousekeepingStatusCard from "./Components/HousekeepingStatusCard";
import RoomStatusCard from "./Components/RoomStatusCard";
import {
  MetricCard,
  METRIC_CONFIGS,
} from "./Components/MetricCard";

export default function Dashboard() {
  const { data, isFetching } = useApiQuery({
    fetchQueryName: "dashboardData",
    fetchQueryFunction: fetchDashboard,
  });

  const dashboardData = data?.data || data || {};

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin />
      </div>
    );
  }

  return (
    <div className="px-6 py-3 min-h-screen font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {METRIC_CONFIGS.map((config) => (
          <MetricCard
            key={config.key}
            config={config}
            value={dashboardData?.[config.key] || 0}
            currency={config.key === "totalRevenue" ? "MMK" : undefined}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RoomStatusCard
          roomData={dashboardData?.room}
        />

        <HousekeepingStatusCard
          housekeepingData={dashboardData?.housekeepingStatus}
        />
      </div>

    </div>
  );
}
