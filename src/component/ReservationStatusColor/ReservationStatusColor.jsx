import React from "react";
import { Tag } from "antd";
import { capitalizeFirstLetter } from "../../utils/Utils";

const ReservationStatusColor = ({ status }) => {

  const statusColorMap = {
    pending: "#D4A106",
    pending_bg: "#FDFFE0",
    pending_border: "#F4E34F",

    booked: "#0958D9",
    booked_bg: "#E6F4FF",
    booked_border: "#91CAFF",

    confirmed: "#389E0D",
    confirmed_bg: "#F6FFED",
    confirmed_border: "#B7EB8F",

    "checked-in": "#08979C",
    "checked-in_bg": "#E6FFFB",
    "checked-in_border": "#87E8DE",

    "checked-out": "#FF8D28",
    "checked-out_bg": "#FFF4F1",
    "checked-out_border": "#FFBD9F",

    cancelled: "#CF1322",
    cancelled_bg: "#FFF1F0",
    cancelled_border: "#FFA39E",

    unknown: "#333333",
    unknown_bg: "#F5F5F5",
    unknown_border: "#D9D9D9",
  };

  const rawStatus = status?.code || status?.name || (typeof status === "string" ? status : "");
  const statusCode = rawStatus.toLowerCase().trim().replace(/[\s_]+/g, "-");
  const color = statusColorMap[statusCode] || statusColorMap.unknown;
  const backgroundColor = statusColorMap[`${statusCode}_bg`] || statusColorMap.unknown_bg;
  const borderColor = statusColorMap[`${statusCode}_border`] || statusColorMap.unknown_border;
  const displayName = status?.name || (typeof status === "string" ? status : "Unknown");

  return (
    <Tag
      style={{
        padding: "4px",
        color: color,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderRadius: "5px",
        fontWeight: "500",
        fontSize: "12px",
        borderStyle: "solid",
        borderWidth: "1px",
      }}
    >
      {capitalizeFirstLetter(displayName)}
    </Tag>
  );
};

export default ReservationStatusColor;
