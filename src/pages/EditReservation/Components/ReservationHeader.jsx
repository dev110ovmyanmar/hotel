import React from "react";
import { FaChild, FaCalendarAlt, FaMoon } from "react-icons/fa";
import { IoPeopleSharp } from "react-icons/io5";
import { MdOutlineMeetingRoom } from "react-icons/md";
import dayjs from "dayjs";
import ReservationStatusColor from "../../../component/ReservationStatusColor/ReservationStatusColor";

const ReservationHeader = ({ data }) => {
  const reservation = data?.reservation;

  if (!reservation) return null;

  return (
    <div className="w-full !bg-gradient-to-r from-[#215282] to-[#000B60]  rounded-lg p-2 md:py-8 md:px-5 mb-3">
      <div>
        <div className="flex  items-center gap-3 mb-3">
          <h1 className="text-xl font-bold text-[#ffffff] tracking-tight">
            {reservation?.guest?.name || "Unknown Guest"}
          </h1>
          <ReservationStatusColor
            status={reservation?.reservationStatus?.name}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mt-2">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-gray-600 text-sm">
          <div className="flex items-center gap-2  py-1 rounded-lg  ">
            <IoPeopleSharp className="text-blue-300 text-base" />
            <span className="font-medium text-[#ffffff]">
              {reservation?.adults || 0} Adults
            </span>
          </div>

          <div className="flex items-center gap-2  px-3 py-1 rounded-lg  ">
            <FaChild className="text-pink-500 text-base" />
            <span className="font-medium text-[#ffffff]">
              {reservation?.children || 0} Children
            </span>
          </div>

          <div className="hidden sm:block text-[#ffffff]">|</div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-lg  ">
            <MdOutlineMeetingRoom className="text-emerald-300 text-lg" />
            <span className="font-medium text-[#ffffff]">
              {reservation?.totalRooms || 0}{" "}
              {reservation?.totalRooms === 1 ? "Room" : "Rooms"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6  w-full lg:w-auto">
          <div className="flex items-center gap-2.5">
            <div className=" text-emerald-400  mt-[-4px]">
              <FaCalendarAlt className="text-base" />
            </div>
            <div className="flex flex-col mt-[-12px]">
              <span className="text-[10px]  font-bold uppercase tracking-wider text-gray-400 leading-tight">
                Arrival
              </span>
              <div className="flex items-center gap-2 ">
                <span className="font-semibold text-[#ffffff] text-sm">
                  {reservation?.actualCheckin
                    ? dayjs(reservation.actualCheckin).format("DD MMM YYYY")
                    : "—"}
                </span>
                {reservation?.actualCheckin && (
                  <span className="bg-white border mt-[-6px] border-gray-200 text-[#ffffff] rounded px-1 text-[10px] font-mono shadow-3xs">
                    {dayjs(reservation.actualCheckin).format("h:mm A")}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="hidden sm:block text-gray-200">/</div>

          <div className="flex items-center gap-2.5">
            <div className="text-amber-200  mt-[-4px]">
              <FaCalendarAlt className="text-base" />
            </div>
            <div className="flex flex-col mt-[-12px]">
              <span className="text-[10px]  font-bold uppercase tracking-wider text-gray-400 leading-tight">
                Departure
              </span>
              <div className="flex items-center gap-2 ">
                <span className="font-semibold text-[#ffffff] text-sm">
                  {reservation?.actualCheckout
                    ? dayjs(reservation.actualCheckout).format("DD MMM YYYY")
                    : "—"}
                </span>
                {reservation?.actualCheckout && (
                  <span className="bg-white border mt-[-6px] border-gray-200 text-[#ffffff] rounded px-1 text-[10px] font-mono shadow-3xs">
                    {dayjs(reservation.actualCheckout).format("h:mm A")}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:block text-gray-300">|</div>

          <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100 ml-auto sm:ml-0">
            <FaMoon className="text-xs" />
            <span className="text-xs font-bold whitespace-nowrap">
              {reservation?.totalNight || 0}{" "}
              {reservation?.totalNight === 1 ? "Night" : "Nights"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationHeader;
