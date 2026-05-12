import React from "react";
import { Divider, Tag, Spin } from "antd";
import { FaChild } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import { reservationDetails } from "../../../api/reservationSectionApi";
import useApiQuery from "../../../hooks/useApiQuery";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";

const ReservationHeader = ({ data }) => {
  console.log(data, "header");
  return (
    <div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold">{data?.guest?.name}</h1>
          <Tag
            color={
              data?.reservationStatus?.code === "pending" ? "warning" : "blue"
            }
            className="rounded px-3"
          >
            {data?.reservationStatus?.name}
          </Tag>
        </div>

        <div className="flex justify-between space-x-10 mx-40">
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Arrival</span>
            <span className="text-xs font-semibold mt-1">
              {dayjs(data?.actualCheckin).format("DD/MM/YYYY")}
              <span className="ml-2 border border-gray-300 rounded text-gray-800 px-2 py-0.5 text-xs font-medium">
                {dayjs(data?.actualCheckin).format("h:mm A")}
              </span>
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Departure</span>
            <span className="text-xs mt-1 font-semibold">
              {dayjs(data?.actualCheckout).format("DD/MM/YYYY")}
              <span className="ml-2 border border-gray-300 rounded text-gray-800 px-2 py-0.5 text-xs font-medium">
                {dayjs(data?.actualCheckout).format("h:mm A")}
              </span>
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Night</span>
            <span className="text-xs mt-1 font-semibold ">
              {data?.totalNight}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <IoPeopleSharp className="text-gray-600" />
          <span className="text-xs font-medium">{data?.adults} Adults</span>
        </div>

        <div className="flex items-center gap-1.5">
          <FaChild className="text-gray-600" />
          <span className="text-xs font-medium">{data?.children} Children</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-300">|</span>
          <span className="text-xs text-gray-500">{data?.totalRooms} Room</span>
          <span className="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded">
            {data?.bookedVia?.name}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReservationHeader;
