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
          <h1 className="text-xl font-bold text-[#ffffff] tracking-tight capitalize">
            {reservation?.guest?.name || "Unknown Guest"}
          </h1>
          <ReservationStatusColor
            status={reservation?.reservationStatus?.name}
          />
        </div>
      </div>

      <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-5 mt-2 w-full">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-gray-600 text-sm shrink-0">
          <div className="flex items-center gap-2 py-1 rounded-lg mt-2.5">
            <IoPeopleSharp className="text-blue-300 text-base" />
            <span className="text-[10px] md:text-[10px] lg:text-[13px] lg:font-medium text-[#ffffff]">
              {reservation?.adults || 0} Adults
            </span>
          </div>

          <div className="flex items-center gap-2 py-1 rounded-lg mt-2.5">
            <FaChild className="text-pink-500 text-base" />
            <span className="text-[10px] md:text-[10px] lg:text-[13px] font-medium text-[#ffffff]">
              {reservation?.children || 0} Children
            </span>
          </div>

          <div className="hidden sm:block text-[#ffffff] mt-2.5">|</div>

          <div className="flex items-center gap-2 py-1 rounded-lg mt-2.5">
            <MdOutlineMeetingRoom className="text-emerald-300 text-lg" />
            <span className="text-[10px] md:text-[10px] lg:text-[13px] font-medium text-[#ffffff]">
              {reservation?.totalRooms || 0}{" "}
              {reservation?.totalRooms === 1 ? "Room" : "Rooms"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap lg:flex-nowrap items-center gap-4 sm:gap-6 w-full lg:w-auto shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="text-emerald-400">
              <FaCalendarAlt className="text-base mt-1.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-none mb-0.5">
                Arrival
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[#ffffff] text-sm whitespace-nowrap">
                  {reservation?.actualCheckin
                    ? dayjs(reservation.actualCheckin).format("DD MMM YYYY")
                    : "—"}
                </span>
                {reservation?.actualCheckin && (
                  <span className="text-gray-300 text-[11px] font-mono whitespace-nowrap">
                    ( {dayjs(reservation.actualCheckin).format("h:mm A")} )
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="hidden sm:block text-gray-200 mt-2">/</div>

          <div className="flex items-center gap-2.5">
            <div className="text-amber-200">
              <FaCalendarAlt className="text-base mt-1.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-none mb-0.5">
                Departure
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[#ffffff] text-sm whitespace-nowrap">
                  {reservation?.actualCheckout
                    ? dayjs(reservation.actualCheckout).format("DD MMM YYYY")
                    : "—"}
                </span>
                {reservation?.actualCheckout && (
                  <span className="text-gray-300 text-[11px] font-mono whitespace-nowrap">
                    ( {dayjs(reservation.actualCheckout).format("h:mm A")} )
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:block text-gray-300 mt-2">|</div>

          <div className="flex items-center gap-2 text-[#ffffff] py-1.5 ml-auto sm:ml-0 mt-2">
            <FaMoon className="text-xs text-[#ffffff]" />
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
