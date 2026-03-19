import React from "react";
import { Tag } from "antd";

const RoomStatusTag = ({ status }) => {
  const statusColorMap = {
    available: "#389E0D",
    dirty: "#D48806",
    maintenance: "#FFA39E",
    occupied: "#0958D9",
    cleaning: "#FFD591",
    checked_out: "#D46B08",
    checked_in:"#08979C",
    no_show:"#333333",
    cancelled:"#FFA39E",
  };

  const color = statusColorMap[status?.code] || "gray";

  return <Tag color={color}>{status?.name?.toUpperCase() || "UNKNOWN"}</Tag>;
};

export default RoomStatusTag;