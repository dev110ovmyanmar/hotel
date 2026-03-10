import React from "react";
import { Divider } from "antd";
import ReservationHeader from "./ReservationHeader";
import ReservationMenu from "./ReservationMenu";

const ReservationList = () => {
  return (
    <div>
      <ReservationHeader />
      <ReservationMenu />
    </div>
  );
};

export default ReservationList;
