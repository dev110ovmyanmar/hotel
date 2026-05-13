import React from "react";
import { Tag } from "antd";
import { capitalizeFirstLetter } from '../../utils/Utils';

const ColorStatusTag = ({ status }) => {
  const statusColorMap = {
    booked: "#0958D9",
    booked_bg: "#E6F4FF",
    booked_border: "#91CAFF",

    confirmed: "#389E0D",
    confirmed_bg: "#F6FFED",
    confirmed_border: "#B7EB8F",

    available: "#389E0D",
    available_bg: "#F6FFED",
    available_border: "#B7EB8F",

    maintenance: "#CF1322",
    maintenance_bg: "#FFF1F0",
    maintenance_border: "#FFA39E",

    occupied: "#0958D9",
    occupied_bg: "#E6F4FF",
    occupied_border: "#91CAFF",

    cleaning: "#FF8D28",
    cleaning_bg: "#FFF4F1",
    cleaning_border: "#FFBD9F",

    checked_out: "#FF8D28",
    checked_out_bg: "#FFF4F1",
    checked_out_border: "#FFBD9F",

    checked_in: "#08979C",
    checked_in_bg: "#E6FFFB",
    checked_in_border: "#87E8DE",

    no_show: "#333333",
    no_show_bg: "#F5F5F5",
    no_show_border: "#D9D9D9",

    cancelled: "#CF1322",
    cancelled_bg: "#FFF1F0",
    cancelled_border: "#FFA39E",

    active: "#389E0D",
    active_bg: "#F6FFED",
    active_border: "#B7EB8F",

    inactive: "#333333",
    inactive_bg: "#F5F5F5",
    inactive_border: "#D9D9D9",

    block: "#CF1322",
    block_bg: "#FFF1F0",
    block_border: "#FFA39E",

    vip: "#531DAB",
    vip_bg: "#F9F0FF",
    vip_border: "#D3ADF7",

    requested: "#D48806",
    requested_bg: "#FFFBE6",
    requested_border: "#FFE58F",

    completed: "#0958D9",
    completed_bg: "#E6F4FF",
    completed_border: "#91CAFF",

    new: "#08979C",
    new_bg: "#E6FFFB",
    new_border: "#87E8DE",

    preparing: "#FF8D28",
    preparing_bg: "#FFF4F1",
    preparing_border: "#FFBD9F",

    success: "#389E0D",
    success_bg: "#F6FFED",
    success_border: "#B7EB8F",

    failed: "#CF1322",
    failed_bg: "#FFF1F0",
    failed_border: "#FFA39E",

    refunded: "#FF8D28",
    refunded_bg: "#FFF4F1",
    refunded_border: "#FFBD9F",

    issued: "#D48806",
    issued_bg: "#FFFBE6",
    issued_border: "#FFE58F",

    paid: "#389E0D",
    paid_bg: "#F6FFED",
    paid_border: "#B7EB8F",

    partially_paid: "#FF8D28",
    partially_paid_bg: "#FFF4F1",
    partially_paid_border: "#FFBD9F",

    void: "#CF1322",
    void_bg: "#FFF1F0",
    void_border: "#FFA39E",

    open: "#0958D9",
    open_bg: "#E6F4FF",
    open_border: "#91CAFF",

    closed: "#CF1322",
    closed_bg: "#FFF1F0",
    closed_border: "#FFA39E",

    in_progress: "#FF8D28",
    in_progress_bg: "#FFF4F1",
    in_progress_border: "#FFBD9F",

    pending: "#D4A106",
    pending_bg: "#FDFFE0",
    pending_border: "#F4E34F",

    assigned: "#D48806",
    assigned_bg: "#FFFBE6",
    assigned_border: "#FFE58F",

    resolved: "#0958D9",
    resolved_bg: "#E6F4FF",
    resolved_border: "#91CAFF",

    verified: "#389E0D",
    verified_bg: "#F6FFED",
    verified_border: "#B7EB8F",

    reserved: "#0958D9",
    reserved_bg: "#E6F4FF",
    reserved_border: "#91CAFF",

    in_house: "#08979C",
    in_house_bg: "#E6FFFB",
    in_house_border: "#87E8DE",

    departed: "#FF8D28",
    departed_bg: "#FFBD9F",
    departed_border: "#FFF4F1",

    dirty: "#D4A106",
    dirty_bg: "#FDFFE0",
    dirty_border: "#F4E34F",

    clean: "#389E0D",
    clean_bg: "#F6FFED",
    clean_border: "#B7EB8F",

    inspected: "#0958D9",
    inspected_bg: "#E6F4FF",
    inspected_border: "#91CAFF",

    out_of_order: "#CF1322",
    out_of_order_bg: "#FFF1F0",
    out_of_order_border: "#FFA39E",

    out_of_service: "#333333",
    out_of_service_bg: "#F5F5F5",
    out_of_service_border: "#D9D9D9",

    reported: "#CF1322",
    reported_bg: "#FFF1F0",
    reported_border: "#FFA39E",

    inquery: "#faad14",
  };

  const code = status?.code;
  const color = statusColorMap[code] || "gray";
  const backgroundColor = statusColorMap[`${code}_bg`];
  const borderColor = statusColorMap[`${code}_border`];

  return (
    <Tag
      color={color}
      style={{
        color: `${color}`,
        backgroundColor: `${backgroundColor}`,
        borderColor: `${borderColor}`,
        borderRadius: "5px"
      }}
    >{capitalizeFirstLetter(status?.name) || "UNKNOWN"}</Tag>
  )
};

export default ColorStatusTag;