import React from "react";
import { Divider, Tag, Spin } from "antd";
import { FaChild } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import { reservationDetails } from "../../../api/reservationSectionApi";
import useApiQuery from "../../../hooks/useApiQuery";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import ReservationStatusColor from "../../../component/ReservationStatusColor/ReservationStatusColor";

const ReservationHeader = ({ data }) => {
  const reservation = data?.reservation;
  return (
    <div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold">{reservation?.guest?.name}</h1>
          <ReservationStatusColor status={reservation?.reservationStatus?.name} />
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-10 mx-4 md:mx-20 lg:mx-40">
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Arrival</span>
            <div className="flex items-center flex-wrap gap-2 mt-1">
              <span className="text-xs font-semibold">
                {dayjs(reservation?.actualCheckin).format("DD/MM/YYYY")}
              </span>
              <span className="border border-gray-300 rounded text-gray-800 px-2 sm:text-xs font-medium">
                {dayjs(reservation?.actualCheckin).format("h:mm A")}
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Departure</span>
            <div className="flex items-center flex-wrap gap-2 mt-1">
              <span className="text-xs font-semibold">
                {dayjs(reservation?.actualCheckout).format("DD/MM/YYYY")}
              </span>
              <span className="border border-gray-300 rounded text-gray-800 px-2 sm:text-xs font-medium">
                {dayjs(reservation?.actualCheckout).format("h:mm A")}
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Night</span>
            <span className="text-xs mt-1 font-semibold ">
              {reservation?.totalNight}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <IoPeopleSharp className="text-gray-600" />
          <span className="text-xs font-medium">{reservation?.adults} Adults</span>
        </div>

        <div className="flex items-center gap-1.5">
          <FaChild className="text-gray-600" />
          <span className="text-xs font-medium">{reservation?.children} Children</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-300">|</span>
          <span className="text-xs text-gray-500">{reservation?.totalRooms} Room</span>
        </div>
      </div>
    </div>
  );
};

export default ReservationHeader;
