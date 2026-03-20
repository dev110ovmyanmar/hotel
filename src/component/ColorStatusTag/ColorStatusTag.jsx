import React from "react";
import { Tag } from "antd";
import { capitalizeFirstLetter } from '../../utils/Utils';

const ColorStatusTag = ({ status }) => {
  const statusColorMap = {
    available: "#389E0D",
    available_bg: "#B7EB8F",

    dirty: "#D48806",
    dirty_bg: "#FFE58F",

    maintenance: "#CF1322",
    maintenance_bg: "#FFA39E",
            
    occupied: "#0958D9",
    occupied_bg: "#91CAFF",

    cleaning: "#D46B08",
    cleaning_bg: "#FFD591",

    checked_out: "#D46B08",
    checked_out_bg: "#FFD591",

    checked_in:"#08979C",
    checked_in_bg: "#B7EB8F#87E8DE",

    no_show:"#333333",
    no_show_bg: "#D9D9D9",

    cancelled:"#CF1322",
    cancelled_bg: "#FFA39E",

    active: "#389E0D",
    active_bg: "#B7EB8F",
    
    inactive: "#333333",
    inactive_bg: "#D9D9D9",

    block:"#CF1322",
    block_bg: "#FFA39E",
  };

  const code = status?.code;
  const color = statusColorMap[code] || "gray";
  const backgroundColor = statusColorMap[`${code}_bg`];

  return (
    <Tag 
      color={color}
      style= {{
        color:`${color}`,
        backgroundColor: `${backgroundColor}`,
        borderRadius: "5px"
      }}
      >{capitalizeFirstLetter(status?.name) || "UNKNOWN"}</Tag>
  )
};

export default ColorStatusTag;