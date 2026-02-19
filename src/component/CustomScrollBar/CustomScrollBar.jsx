import React from "react";
import { Scrollbars } from "rc-scrollbars";

const CustomScrollBars = ({ id, style, children, className }) => (
  <Scrollbars
    id={id}
    style={style}
    className={className}
    autoHide
    autoHideTimeout={1000}
    autoHideDuration={200}
    autoHeightMin={0}
    autoHeightMax={200}
    thumbMinSize={30}
    universal={true}
  >
    {children}
  </Scrollbars>
);

export default CustomScrollBars;
