import React from "react";
import { Divider } from "antd";
import ReservationHeader from "./ReservationHeader";
import ReservationMenu from "./ReservationMenu";

const ReservationList = () => {
  return (
     <div className="w-full px-6 py-2">
      <ReservationHeader />
      <ReservationMenu />
    </div>
  );
};

export default ReservationList;

