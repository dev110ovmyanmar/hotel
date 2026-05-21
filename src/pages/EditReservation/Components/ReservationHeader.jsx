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
    <div className="w-full bg-white border border-gray-100 shadow-sm rounded-xl p-2 md:py-2 md:px-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 ">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            {reservation?.guest?.name || "Unknown Guest"}
          </h1>
          <ReservationStatusColor
            status={reservation?.reservationStatus?.name}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mt-1">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-gray-600 text-sm">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-0.5 rounded-lg border border-gray-100/80">
            <IoPeopleSharp className="text-blue-500 text-base" />
            <span className="font-medium text-gray-700">
              {reservation?.adults || 0} Adults
            </span>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 px-3 py-0.5 rounded-lg border border-gray-100/80">
            <FaChild className="text-pink-500 text-base" />
            <span className="font-medium text-gray-700">
              {reservation?.children || 0} Children
            </span>
          </div>

          <div className="hidden sm:block text-gray-300">|</div>

          <div className="flex items-center gap-2">
            <MdOutlineMeetingRoom className="text-emerald-500 text-lg" />
            <span className="font-medium text-gray-700">
              {reservation?.totalRooms || 0}{" "}
              {reservation?.totalRooms === 1 ? "Room" : "Rooms"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6  w-full lg:w-auto">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md border border-emerald-100">
              <FaCalendarAlt className="text-xs" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-tight">
                Arrival
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-semibold text-gray-800 text-sm">
                  {reservation?.actualCheckin
                    ? dayjs(reservation.actualCheckin).format("DD MMM YYYY")
                    : "—"}
                </span>
                {reservation?.actualCheckin && (
                  <span className="bg-white border border-gray-200 text-gray-500 rounded px-1.5 py-0.5 text-[11px] font-mono shadow-3xs">
                    {dayjs(reservation.actualCheckin).format("h:mm A")}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="hidden sm:block text-gray-200">/</div>

          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-md border border-amber-100">
              <FaCalendarAlt className="text-xs" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-tight">
                Departure
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-semibold text-gray-800 text-sm">
                  {reservation?.actualCheckout
                    ? dayjs(reservation.actualCheckout).format("DD MMM YYYY")
                    : "—"}
                </span>
                {reservation?.actualCheckout && (
                  <span className="bg-white border border-gray-200 text-gray-500 rounded px-1.5 py-0.5 text-[11px] font-mono shadow-3xs">
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
