import React, { useState } from "react";
import { Drawer, Button, Tag, Modal } from "antd";
import dayjs from "dayjs";
import { Gift, BedDouble, AlertTriangle, CalendarDays } from "lucide-react";
import Loader from "../../../../../../component/Loader/Loader"

// Custom styles for modal without footer
const modalStyles = `
  .room-post-modal .ant-modal-body {
    min-height: 80px;
    display: flex;
    align-items: center;
  }
`;
import { EditOutlined, CheckCircleFilled } from "@ant-design/icons";
import { reservationRoomDetails, roomPost } from "../../../../../../api/reservationSectionApi";
import Toast from "../../../../../../component/Toast/Toast";
import {
  textColorDarkMode,
  textWhiteInDarkStyle,
} from "../../../../../../utils";
import DailyBreakDownDetailFormDrawer from "./DailyBreakDownDetailFormDrawer";
import { useApiQuery } from "../../../../../../hooks/useApiQuery";
import { useApiMutation } from "../../../../../../hooks/useApiMutation";
import PriceTag from "../../../../../../component/PriceTag/PriceTag";
import ReservationStatusColor from "../../../../../../component/ReservationStatusColor/ReservationStatusColor";

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
  const [selectedStayDate, setSelectedStayDate] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const {
    data: reservationRoomsDetails,
    isFetching: reservationRoomsDetailFetching,
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
      setSelectedStayDate(dayjs(rateDate).format("YYYY-MM-DD"));
      setDailyBreakDownDetailFormDrawerOpen(true);
    }
  };

  const updateRoomPost = useApiMutation({
    mutationFn: roomPost,
    invalidateKeys: [["reservation-room-details"], ["reservation-room"]],
  });

  const [roomPostModal, setRoomPostModal] = useState({ open: false, stayDate: null });

  const handleRoomPostConfirm = () => {
    updateRoomPost.mutate(
      {
        reservationRoom: { uuid: d?.uuid },
        stayDate: dayjs(roomPostModal.stayDate).format("YYYY-MM-DD"),
      },
      {
        onSuccess: () => {
          setRoomPostModal({ open: false, stayDate: null });
          Toast.success("Room Posted Successfully!");
        },
      }
    );
  };



  const handleClose = () => {
    setDrawerOpen(false);
    if (setSelectedData) setSelectedData(null);
  };

  const currentStatus = d?.roomStatus?.name;
  const isCheckedIn = d?.roomStatus?.code === "checked_in";
  const statusStyle = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.default;

  const textWhiteDark = `flex justify-between items-center text-slate-600 ${textWhiteInDarkStyle}`;
  return (
    <>
      <style>{modalStyles}</style>
      <Drawer
        open={drawerOpen}
        onClose={handleClose}
        size={850}
        title={
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div>
                <span
                  className={`font-bold text-lg text-slate-800 block ${textWhiteInDarkStyle}`}
                >
                  Room Information
                </span>
                {
                  reservationRoomsDetailFetching ? null : 
                  <span className="text-indigo-700 dark:text-indigo-500 font-semibold text-xs">
                  {" "}
                  {d?.reservation?.reservationNo || "—"}
                </span>
                }
              </div>
            </div>
          </div>
        }
      >
      {
        reservationRoomsDetailFetching ? 
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <Loader />
          </div>
            :
          <div className="space-y-2">
          {/* Check-In / Check-Out Card */}
          <div className="bg-gradient-to-r from-indigo-50 via-white to-purple-50 dark:from-[#1f1f1f] dark:via-[#1f1f1f] dark:to-[#1f1f1f] rounded-2xl border border-slate-200/60 dark:border-gray-600 p-3 shadow-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="flex items-center gap-2 text-[12px] font-bold text-[#189094] tracking-wider">
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
                <span className="flex items-center justify-end gap-2 text-[12px] font-bold text-[#FF8D28] tracking-wider">
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
                    <span className="text-blue-500 text-xs px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 font-medium">
                      Assign Rooms
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span className="text-slate-400 text-sm">Room No:</span>
                      <p className=" text-sm"> {d?.room?.roomNo}</p>
                    </span>
                  )}
                </div>
              </div>

              <ReservationStatusColor
                color={statusStyle.tagColor}
                status={currentStatus}
              />
            </div>

            {/* Room Type & Rate Plan */}
            <div className="grid grid-cols-3 gap-2.5 mt-2">
              <div
                className={`bg-white/80 dark:bg-gray-800/80 rounded-xl p-2 border border-slate-100 dark:border-gray-600`}
              >
                <span
                  className={`text-[12px] text-slate-400  tracking-wider ${textColorDarkMode}`}
                >
                  Room Type
                </span>
                <div
                  className={`text-xs  text-slate-900 mt-0.5 ${textWhiteInDarkStyle}`}
                >
                  {d?.roomType?.name || "—"}
                </div>
              </div>
              <div
                className={`bg-white/80 dark:bg-gray-800/80 rounded-xl p-2 border border-slate-100 dark:border-gray-600`}
              >
                <span
                  className={`text-[12px] text-slate-400 tracking-wider ${textColorDarkMode}`}
                >
                  Rate Plan
                </span>
                <div
                  className={`text-xs text-slate-900 mt-0.5 ${textWhiteInDarkStyle}`}
                >
                  {d?.ratePlan?.name || "—"}
                </div>
              </div>
              <div
                className={`bg-white/80 dark:bg-gray-800/80 rounded-xl p-2 border border-slate-100 dark:border-gray-600`}
              >
                <span
                  className={`text-[12px] text-slate-400  tracking-wider ${textColorDarkMode}`}
                >
                  Source Type{" "}
                </span>
                <div
                  className={`text-xs text-slate-900 mt-0.5 ${textWhiteInDarkStyle}`}
                >
                  {d?.reservation?.sourceType?.name || "—"}

                  {d?.reservation?.source?.name && (
                    <div className="text-indigo-600 text-[11px] font-semibold">
                      (
                      {d.reservation.source.name} -{" "}
                      {d.reservation.source.chargeType?.code === "flat" ? (
                        <>
                          <PriceTag value={d.reservation.source.chargeValue} /> MMK
                        </>
                      ) : (
                        <>
                          {d.reservation.source.chargeValue} %
                        </>
                      )}
                      )
                    </div>
                  )}
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
                Total Summary
              </h3>
            </div>
            <div className="px-5 py-3 space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2.5 mb-2">
                <div className="bg-slate-50 dark:bg-gray-700/50 rounded-xl p-1.5 text-center">
                  <span className="text-[12px] text-slate-400 dark:text-slate-300 block">
                    Max Adults
                  </span>
                  <span
                    className={`font-bold text-base text-slate-800 ${textWhiteInDarkStyle}`}
                  >
                    {d?.adults || 0}
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-gray-700/50 rounded-xl p-1.5 text-center">
                  <span className="text-[12px] text-slate-400 dark:text-slate-300 block">
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
                  <div className="flex justify-end gap-1">
                    <PriceTag value={d?.subTotal || 0} />
                    <span>MMK</span>
                  </div>
                </div>
                <div className={textWhiteDark}>
                  <span className="text-slate-500 dark:text-slate-300">Tax</span>
                  <div className="flex justify-end gap-1">
                    <PriceTag value={d?.taxTotal || 0} />
                    <span>MMK</span>
                  </div>
                </div>
                <div className={textWhiteDark}>
                  <span className="text-slate-500 dark:text-slate-300">
                    Service Charge
                  </span>
                  <div className="flex justify-end gap-1">
                    <PriceTag value={d?.serviceChargeTotal || 0} />
                    <span>MMK</span>
                  </div>
                </div>
                <div className={textWhiteDark}>
                  <span className="text-slate-500 dark:text-slate-300">
                    Incentive
                  </span>
                  <div className="flex justify-end gap-1 text-rose-500">
                    - <PriceTag value={d?.incentiveTotal || 0} />
                    <span>MMK</span>
                  </div>
                </div>
                <div className={textWhiteDark}>
                  <span className="text-slate-500 dark:text-slate-300">
                    Discount
                  </span>
                  <div className="flex justify-end gap-1 text-rose-500">
                    - <PriceTag value={d?.discountTotal || 0} />
                    <span>MMK</span>
                  </div>
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
                  <div className="flex justify-end gap-1 text-indigo-600 dark:text-indigo-400">
                    <PriceTag value={d?.grandTotal || 0} />
                    <span>MMK</span>
                  </div>
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
                  <thead className="bg-slate-100 dark:bg-gray-700/50 text-slate-900 dark:text-gray-300 font-medium">
                    <tr>
                      <th className="px-3 py-2.5 text-left text-[14px] tracking-wider">
                        Date
                      </th>
                      <th className="px-3 py-2.5 text-right text-[14px] tracking-wider whitespace-nowrap">
                        Room Rate(MMK)
                      </th>
                      <th className="px-3 py-2.5 text-right text-[14px] tracking-wider">
                        Extra(MMK)
                      </th>
                      <th className="px-3 py-2.5 text-right text-[14px] tracking-wider">
                        Tax(MMK)
                      </th>
                      <th className="px-3 py-2.5 text-right text-[14px] tracking-wider">
                        Total(MMK)
                      </th>
                      <th className="px-3 py-2.5 text-center text-[14px] tracking-wider w-24">
                        Room Posting
                      </th>
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

                      const isTodayOrPast = !dayjs(r.stayDate).isAfter(dayjs(), 'day');

                      return (
                        <tr
                          key={r.uuid}
                          onClick={() => handleViewDailyOccupancy(r.stayDate)}
                          className={`cursor-pointer transition-colors ${textWhiteInDarkStyle} ${selectedStayDate === dayjs(r.stayDate).format("YYYY-MM-DD")
                            ? "bg-indigo-100 dark:bg-indigo-900/30 ring-1 ring-indigo-300 dark:ring-indigo-700"
                            : idx % 2 === 0
                              ? "bg-white dark:bg-gray-800"
                              : "bg-slate-50/50 dark:bg-gray-800/50"
                            } hover:bg-slate-50/80 dark:hover:bg-gray-700/40`}
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
                          <td className="px-3 py-2 text-center" onClick={(e) => e.stopPropagation()}>
                            {r?.dailyCharge?.postedToFolio === true ? (
                              <div className="flex items-center justify-center gap-2 border-2 border-green-400 p-2 rounded bg-green-50">
                                <CheckCircleFilled className="!text-green-600 " />
                                <div className="flex flex-col">
                                  <span className="text-green-600 whitespace-nowrap">Posted</span>
                                  {r?.dailyCharge?.postedAt && (
                                    <span className="text-black text-xs whitespace-nowrap">
                                      {dayjs(r?.dailyCharge?.postedAt).format("YYYY-MM-DD HH:mm")}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div
                                className={`flex items-center justify-center gap-2 border-2 p-2 rounded ${isTodayOrPast
                                  ? 'border-blue-400 bg-blue-50 cursor-pointer hover:bg-blue-100'
                                  : 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-50 pointer-events-none'
                                  }`}
                                onClick={() =>
                                  isTodayOrPast && setRoomPostModal({ open: true, stayDate: r.stayDate })
                                }
                                title={isTodayOrPast ? 'Room Post' : 'Only available today'}
                              >
                                <BedDouble className={isTodayOrPast ? 'text-blue-500' : 'text-gray-400'} size={20} />
                                <span className={`whitespace-nowrap ${isTodayOrPast ? 'text-blue-500' : 'text-gray-400'}`}>
                                  Post Room
                                </span>
                              </div>
                            )}
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
      }

        <DailyBreakDownDetailFormDrawer
          open={dailyBreakDownDetailFormDrawerOpen}
          onClose={() => {
            setDailyBreakDownDetailFormDrawerOpen(false);
            setSelectedDailyOccupancy(null);
            setSelectedStayDate(null);
            setEditMode(false);
          }}
          data={selectedDailyOccupancy}
          reservationRoomUuid={d?.uuid}
          initialEditMode={editMode}
          disableEdit={true}
        />

        {/* <Modal
          title="Room Posted"
          open={roomPostModal.open}
          onOk={d?.roomStatus?.code === "checked_in" ? handleRoomPostConfirm : undefined}
          onCancel={() => setRoomPostModal({ open: false, stayDate: null })}
          okText="Confirm"
          cancelText="Cancel"
          confirmLoading={updateRoomPost.isPending}
          footer={d?.roomStatus?.code === "checked_in" ? undefined : null}
          className={d?.roomStatus?.code !== "checked_in" ? "room-post-modal" : ""}
        >
          {d?.roomStatus?.code === "checked_in" ? (
            <p>Are you sure you want to post this room for {dayjs(roomPostModal.stayDate).format("YYYY-MM-DD")}?</p>
          ) : (
            <div className="flex items-center gap-3 py-4">
              <AlertTriangle className="w-6 h-6 flex-shrink-0 text-red-500" />
              <p className="font-medium text-red-500">
                Room status must be "Checked In" to post this room.
              </p>
            </div>
          )}
        </Modal> */}

        <Modal
          title={isCheckedIn ? "Confirm Room Post" : "Cannot Post Room"}
          open={roomPostModal.open}
          onOk={isCheckedIn ? handleRoomPostConfirm : undefined}
          onCancel={() => setRoomPostModal({ open: false, stayDate: null })}
          okText="Confirm"
          cancelText="Cancel"
          confirmLoading={updateRoomPost.isPending}
          okButtonProps={{ disabled: !isCheckedIn }}
          footer={isCheckedIn ? undefined : null}
          centered
          width={420}
          className={!isCheckedIn ? "room-post-modal" : ""}
        >
          {isCheckedIn ? (
            <div className="space-y-3 py-2">
              <p className="text-gray-700">
                Are you sure you want to post this room for the following date?
              </p>
              <div className="flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2">
                <CalendarDays className="h-4 w-4 text-blue-500" />
                <span className="font-semibold text-blue-700">
                  {dayjs(roomPostModal.stayDate).format("YYYY-MM-DD")}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 py-2">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Action not allowed</p>
                <p className="mt-1 text-sm text-gray-600">
                  Room status must be <span className="font-medium text-red-500">"Checked In"</span> to post this room.
                </p>
              </div>
            </div>
          )}
        </Modal>
      </Drawer>
    </>
  );
};

export default RoomInformationDetailsForm;
