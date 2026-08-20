import React, { useState } from "react";
import { Drawer, Button, Tag } from "antd";
import dayjs from "dayjs";
import { Gift } from "lucide-react";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import { reservationRoomDetails } from "../../../../../../api/reservationSectionApi";
import {
  textColorDarkMode,
  textWhiteInDarkStyle,
} from "../../../../../../utils";
import DailyBreakDownDetailFormDrawer from "./DailyBreakDownDetailFormDrawer";
import { useApiQuery } from "../../../../../../hooks/useApiQuery";
import PriceTag from "../../../../../../component/PriceTag/PriceTag";

const STATUS_CONFIG = {
  Confirmed: { tagColor: "success" },
  Pending: { tagColor: "warning" },
  Cancelled: { tagColor: "error" },
  Booked: { tagColor: "blue" },
  "Checked Out": { tagColor: "error" },
  "Checked In": { tagColor: "success" },
  default: { tagColor: "default" },
};

const RoomInformationDetailsForm = ({
  drawerOpen,
  setDrawerOpen,
  selectedData,
  setSelectedData,
}) => {
  const [
    dailyBreakDownDetailFormDrawerOpen,
    setDailyBreakDownDetailFormDrawerOpen,
  ] = useState(false);
  const [selectedDailyOccupancy, setSelectedDailyOccupancy] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const {
    data: reservationRoomsDetails,
    isLoading: reservationRoomsDetailsLoading,
    refetch: refetchReservationRoomsDetails,
  } = useApiQuery({
    fetchQueryName: "reservation-room-details",
    fetchQueryFunction: reservationRoomDetails,
    params: { uuid: selectedData?.uuid },
    options: { enabled: !!selectedData?.uuid && drawerOpen },
  });

  const d = reservationRoomsDetails;

  const handleViewDailyOccupancy = (rateDate) => {
    setEditMode(false);
    const matched = d?.dailyOccupancies?.find(
      (occ) =>
        dayjs(occ.stayDate).format("YYYY-MM-DD") ===
        dayjs(rateDate).format("YYYY-MM-DD"),
    );
    if (matched) {
      setSelectedDailyOccupancy(matched);
      setDailyBreakDownDetailFormDrawerOpen(true);
    }
  };

  // const handleEditDailyOccupancy = (rateDate) => {
  //   setEditMode(true);
  //   const matched = d?.dailyOccupancies?.find(
  //     (occ) =>
  //       dayjs(occ.stayDate).format("YYYY-MM-DD") ===
  //       dayjs(rateDate).format("YYYY-MM-DD"),
  //   );
  //   if (matched) {
  //     setSelectedDailyOccupancy(matched);
  //     setDailyBreakDownDetailFormDrawerOpen(true);
  //   }
  // };

  const handleClose = () => {
    setDrawerOpen(false);
    if (setSelectedData) setSelectedData(null);
  };

  const currentStatus = d?.roomStatus?.name;
  const statusStyle = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.default;

  const textWhiteDark = `flex justify-between items-center text-slate-600 ${textWhiteInDarkStyle}`;
  return (
    <Drawer
      open={drawerOpen}
      onClose={handleClose}
      size={700}
      title={
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div>
              <span
                className={`font-bold text-lg text-slate-800 block ${textWhiteInDarkStyle}`}
              >
                Room Information
              </span>
              <span className="text-indigo-700 dark:text-indigo-500 font-semibold text-xs">
                {" "}
                {d?.reservation?.reservationNo || "—"}
              </span>
            </div>
          </div>
          <Button className="custom-blue-btn" onClick={handleClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-2">
        {/* Check-In / Check-Out Card */}
        <div className="bg-gradient-to-r from-indigo-50 via-white to-purple-50 dark:from-[#1f1f1f] dark:via-[#1f1f1f] dark:to-[#1f1f1f] rounded-2xl border border-slate-200/60 dark:border-gray-600 p-3 shadow-sm">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="flex items-center gap-2 text-[11px] font-bold text-[#189094] uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#189094] animate-pulse" />
                Check-In
              </span>
              <div
                className={`text-slate-900 font-bold text-lg ${textWhiteInDarkStyle}`}
              >
                {d?.checkinDate
                  ? dayjs(d.checkinDate).format("DD MMM YYYY")
                  : "--"}
              </div>
              <div className="text-slate-400 text-xs">
                {d?.checkinDate
                  ? dayjs(d.checkinDate).format("dddd, hh:mm A")
                  : "—"}
              </div>
            </div>

            <div className="space-y-1 text-right">
              <span className="flex items-center justify-end gap-2 text-[11px] font-bold text-[#FF8D28] uppercase tracking-wider">
                Check-Out
                <span className="w-2 h-2 rounded-full bg-[#FF8D28] animate-pulse" />
              </span>
              <div
                className={`text-slate-900 font-bold text-lg ${textWhiteInDarkStyle}`}
              >
                {d?.checkoutDate
                  ? dayjs(d.checkoutDate).format("DD MMM YYYY")
                  : "--"}
              </div>
              <div className="text-slate-400 text-xs">
                {d?.checkoutDate
                  ? dayjs(d.checkoutDate).format("dddd, hh:mm A")
                  : "—"}
              </div>
            </div>
          </div>

          <div className="my-2 border-t border-dashed border-slate-300 dark:border-gray-600" />

          {/* Room & Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`font-bold text-slate-800 text-base ${textColorDarkMode}`}
              >
                {d?.room === null ? (
                  <span className="text-blue-500 text-sm px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 font-medium">
                    Assign Room
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span className="text-slate-400 font-normal">Room</span>
                    {d?.room?.roomNo}
                  </span>
                )}
              </div>
            </div>
            <Tag
              color={statusStyle.tagColor}
              className="px-3 py-1 text-xs font-semibold rounded-full"
            >
              {currentStatus || "Unknown"}
            </Tag>
          </div>

          {/* Room Type & Rate Plan */}
          <div className="grid grid-cols-2 gap-2.5 mt-2">
            <div
              className={`bg-white/80 dark:bg-gray-800/80 rounded-xl p-2 border border-slate-100 dark:border-gray-600`}
            >
              <span
                className={`text-[10px] text-slate-400 font-semibold uppercase tracking-wider ${textColorDarkMode}`}
              >
                Room Type
              </span>
              <div
                className={`text-sm font-semibold text-slate-700 mt-0.5 ${textWhiteInDarkStyle}`}
              >
                {d?.roomType?.name || "—"}
              </div>
            </div>
            <div
              className={`bg-white/80 dark:bg-gray-800/80 rounded-xl p-2 border border-slate-100 dark:border-gray-600`}
            >
              <span
                className={`text-[10px] text-slate-400 font-semibold uppercase tracking-wider ${textColorDarkMode}`}
              >
                Rate Plan
              </span>
              <div
                className={`text-sm font-semibold text-slate-700 mt-0.5 ${textWhiteInDarkStyle}`}
              >
                {d?.ratePlan?.name || "—"}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200/60 dark:border-gray-600 overflow-hidden">
          <div className="px-5 py-3 bg-gradient-to-r from-slate-50 to-transparent dark:from-gray-700 dark:to-transparent border-b border-slate-100 dark:border-gray-600">
            <h3
              className={`font-bold text-sm text-slate-800 flex items-center gap-2 ${textColorDarkMode}`}
            >
              <span className="w-1.5 h-3 bg-indigo-500 rounded-full" />
              Payment Summary
            </h3>
          </div>
          <div className="px-5 py-3 space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2.5 mb-2">
              <div className="bg-slate-50 dark:bg-gray-700/50 rounded-xl p-1.5 text-center">
                <span className="text-[10px] text-slate-400 dark:text-slate-300 font-semibold uppercase block">
                  Adults
                </span>
                <span
                  className={`font-bold text-base text-slate-800 ${textWhiteInDarkStyle}`}
                >
                  {d?.adults || 0}
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-gray-700/50 rounded-xl p-1.5 text-center">
                <span className="text-[10px] text-slate-400 dark:text-slate-300 font-semibold uppercase block">
                  Nights
                </span>
                <span
                  className={`font-bold text-base text-slate-800 ${textWhiteInDarkStyle}`}
                >
                  {d?.totalNight || 0}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className={textWhiteDark}>
                <span className="text-slate-500 dark:text-slate-300 ">
                  Sub Total
                </span>
                <span className="flex items-center justify-end gap-1 font-medium">
                  <PriceTag value={d?.subTotal || 0} />
                  <span className="text-slate-400 text-xs">MMK</span>
                </span>
              </div>
              <div className={textWhiteDark}>
                <span className="text-slate-500 dark:text-slate-300">Tax</span>
                <span className="flex items-center justify-end gap-1 font-medium">
                  <PriceTag value={d?.taxTotal || 0} />
                  <span className="text-slate-400 text-xs">MMK</span>
                </span>
              </div>
              <div className={textWhiteDark}>
                <span className="text-slate-500 dark:text-slate-300">
                  Service Charge
                </span>
                <span className="flex items-center justify-end gap-1 font-medium">
                  <PriceTag value={d?.serviceChargeTotal || 0} />
                  <span className="text-slate-400 text-xs">MMK</span>
                </span>
              </div>
              <div className={textWhiteDark}>
                <span className="text-slate-500 dark:text-slate-300">
                  Incentive
                </span>
                <span className="text-rose-500 font-medium flex items-center justify-end gap-1">
                  - <PriceTag value={d?.incentiveTotal || 0} />
                  <span className="text-slate-400 text-xs">MMK</span>
                </span>
              </div>
              <div className={textWhiteDark}>
                <span className="text-slate-500 dark:text-slate-300">
                  Discount
                </span>
                <span className="text-rose-500 font-medium flex items-center justify-end gap-1">
                  - <PriceTag value={d?.discountTotal || 0} />
                  <span className="text-slate-400 text-xs">MMK</span>
                </span>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-200 dark:border-gray-600 my-1.5" />

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-3 border border-indigo-100 dark:border-indigo-800/30">
              <div
                className={`flex justify-between items-center font-bold ${textWhiteDark}`}
              >
                <span className="text-slate-700 dark:text-gray-200">
                  Grand Total
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 text-lg flex items-center justify-end gap-1">
                  <PriceTag value={d?.grandTotal || 0} />
                  <span className="text-sm">MMK</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Breakdown Table */}
        {d?.dailyOccupancies && d.dailyOccupancies.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200/60 dark:border-gray-600 overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-transparent dark:from-gray-700 dark:to-transparent border-b border-slate-100 dark:border-gray-600">
              <h3
                className={`font-bold text-sm text-slate-800 flex items-center gap-2 ${textColorDarkMode}`}
              >
                <span className="w-1.5 h-3 bg-emerald-500 rounded-full" />
                Daily Breakdown
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-gray-700/50 text-slate-500 dark:text-gray-400 font-semibold tracking-wider">
                  <tr>
                    <th className="px-3 py-2 text-left">Date</th>
                    <th className="px-3 py-2 text-right whitespace-nowrap">
                      Room Rate(MMK)
                    </th>
                    <th className="px-3 py-2 text-right">Extra(MMK)</th>
                    <th className="px-3 py-2 text-right">Tax(MMK)</th>
                    <th className="px-3 py-2 text-right">Total(MMK)</th>
                    <th className="px-1 py-2 text-center w-8">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-gray-700">
                  {d?.dailyOccupancies?.map((r, idx) => {
                    const dc = r.dailyCharge;
                    const extraTotalCharge =
                      (dc?.babyCotTotal || 0) +
                      (dc?.childChargeTotal || 0) +
                      (dc?.extraBedTotal || 0) +
                      (dc?.extraPersonTotal || 0);
                    const roomRate = dc?.roomRate || 0;
                    // const serviceCharges = dc?.serviceChargeTotal || 0;
                    // const mealCharges = dc?.mealChargeTotal || 0;
                    // const incentiveCharges = dc?.incentiveTotal || 0;
                    const taxTotal = dc?.taxTotal || 0;

                    return (
                      <tr
                        key={r.uuid}
                        className={`hover:bg-slate-50/80 dark:hover:bg-gray-700/40 transition-colors ${textWhiteInDarkStyle} ${idx % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-slate-50/50 dark:bg-gray-800/50"}`}
                      >
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span className="font-medium text-slate-700 dark:text-gray-200">
                            {dayjs(r.stayDate).format("YYYY-MM-DD")}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right text-slate-600 dark:text-gray-300">
                          <PriceTag value={roomRate} />
                        </td>
                        <td className="px-3 py-2 text-right text-slate-600 dark:text-gray-300">
                          <PriceTag value={extraTotalCharge} />
                        </td>
                        <td className="px-3 py-2 text-right text-slate-600 dark:text-gray-300">
                          <PriceTag value={taxTotal} />
                        </td>
                        <td className="px-3 py-2 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {r.isComplimentary && (
                              <Gift
                                className="w-3.5 h-3.5 text-emerald-500"
                                title="Complimentary"
                              />
                            )}
                            <span className="dark:text-gray-100 flex items-center gap-1">
                              <PriceTag value={dc?.grandTotal || 0} />
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <EyeOutlined
                            onClick={() => handleViewDailyOccupancy(r.stayDate)}
                            title="View Details"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <DailyBreakDownDetailFormDrawer
        open={dailyBreakDownDetailFormDrawerOpen}
        onClose={() => {
          setDailyBreakDownDetailFormDrawerOpen(false);
          setSelectedDailyOccupancy(null);
          setEditMode(false);
        }}
        data={selectedDailyOccupancy}
        reservationRoomUuid={d?.uuid}
        initialEditMode={editMode}
        disableEdit={true}
      />
    </Drawer>
  );
};

export default RoomInformationDetailsForm;
