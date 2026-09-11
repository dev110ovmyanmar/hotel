import React from "react";

const statusIconColorMap = {
  booked: "#0958D9",
  confirmed: "#389E0D",
  available: "#389E0D",
  occupied: "#0958D9",
  checked_out: "#FF8D28",
  checked_in: "#08979C",
  no_show: "#333333",
  cancelled: "#CF1322",
  completed: "#0958D9",
  success: "#389E0D",
  dirty: "#D4A106",
  clean: "#389E0D",
  out_of_order: "#CF1322",
  out_of_service: "#333333",
};

const StatusIcon = ({ icon: Icon, status, size = 18 }) => {
  const color = statusIconColorMap[status?.code] || "gray";

  return (
    <Icon
      size={size}
      style={{ color }}
    />
  );
};

export default StatusIcon;