import React, { useEffect } from "react";
import { Drawer, Button, Tag } from "antd";
import dayjs from "dayjs";
import { Gift } from "lucide-react";
import { useApiMutation } from "../../../../../../hooks/useApiMutation";
import { reservationRoomDetails } from "../../../../../../api/reservationSectionApi";

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
  const reservationRoomsDetails = useApiMutation({
    mutationFn: reservationRoomDetails,
  });

  const d = reservationRoomsDetails.data;

  useEffect(() => {
    if (drawerOpen && selectedData?.uuid) {
      reservationRoomsDetails.mutate({ uuid: selectedData.uuid });
    }
  }, [drawerOpen, selectedData]);

  const handleClose = () => {
    setDrawerOpen(false);
    if (setSelectedData) setSelectedData(null);
  };

  const currentStatus = d?.roomStatus?.name;
  const statusStyle = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.default;

  return (
    <Drawer
      open={drawerOpen}
      onClose={handleClose}
      width={650}
      title={
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg text-slate-800">
            Room Information Details
          </span>
          <Button className="custom-blue-btn" onClick={handleClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Reservation Quick Metrics Card */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden w-full max-w-xl">
          <div className="relative grid grid-cols-2 gap-2 px-6 py-4 bg-gradient-to-r from-slate-50 to-white">
            <div>
              <span className="flex items-center gap-2 text-[11px] font-semibold text-amber-600 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Check-In
              </span>
              <div className="text-slate-900 font-bold text-lg">
                {d?.checkinDate
                  ? dayjs(d.checkinDate).format("DD MMM YYYY")
                  : "--"}
              </div>
              <div className="text-slate-400 text-xs">
                {d?.checkinDate ? dayjs(d.checkinDate).format("dddd") : "—"}
              </div>
            </div>

            <div className="text-right">
              <span className="flex items-center justify-end gap-2 text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
                Check-Out
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
              </span>
              <div className="text-slate-900 font-bold text-lg">
                {d?.checkoutDate
                  ? dayjs(d.checkoutDate).format("DD MMM YYYY")
                  : "--"}
              </div>
              <div className="text-slate-400 text-xs">
                {d?.checkoutDate ? dayjs(d.checkoutDate).format("dddd") : "—"}
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 border-t border-slate-300" />
            </div>
          </div>

          <div className="border-t border-slate-100" />

          <div className="px-6 py-4 space-y-4">
            <div className="flex justify-between items-center">
              <div className="font-bold text-slate-800 text-base">
                {d?.room === null ? (
                  <span className="text-blue-400 text-sm px-3 py-1 rounded-full bg-blue-50 font-normal">
                    Assign Room
                  </span>
                ) : (
                  `Room : ${d?.room?.roomNo}`
                )}
              </div>
              <Tag
                color={statusStyle.tagColor}
                className="px-3 py-1 text-xs font-semibold rounded-full"
              >
                {currentStatus || "Unknown"}
              </Tag>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <span className="text-xs text-slate-400 font-medium">
                  Room Type
                </span>
                <div className="text-sm font-semibold text-slate-700 mt-1">
                  {d?.roomType?.name || "—"}
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <span className="text-xs text-slate-400 font-medium">
                  Rate Plan
                </span>
                <div className="text-sm font-semibold text-slate-700 mt-1">
                  {d?.ratePlan?.name || "—"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary Card */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-base text-slate-800 mb-4">
            Payment Summary
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Adults</span>
              <span className="font-medium">{d?.adults || 0} Guests</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Nights</span>
              <span className="font-medium">
                {d?.totalNight} {d?.totalNight === 1 ? "Night" : "Nights"}
              </span>
            </div>

            <div className="border-t my-2" />

            <div className="flex justify-between text-slate-600">
              <span>Sub Total</span>
              <span>{(d?.subTotal || 0).toLocaleString()} MMK</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax ({d?.taxPercentage || 0}%)</span>
              <span>{(d?.taxTotal || 0).toLocaleString()} MMK</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Service Charge</span>
              <span>{(d?.serviceChargeTotal || 0).toLocaleString()} MMK</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Discount</span>
              <span className="text-rose-500 font-medium">
                - {(d?.discountTotal || 0).toLocaleString()} MMK
              </span>
            </div>

            <div className="border-t my-2" />

            <div className="flex justify-between text-base font-semibold text-slate-900">
              <span>Grand Total</span>
              <span className="text-indigo-600 text-lg">
                {(d?.grandTotal || 0).toLocaleString()} MMK
              </span>
            </div>

            {d?.isComplimentary && (
              <div className="mt-3">
                <Tag color="purple">
                  Campimentary ({d?.complimentaryStatus?.name})
                </Tag>
              </div>
            )}
          </div>
        </div>

        {/* Daily Breakdown Table Component - Only renders if there are rates available */}
        {d?.reservationRoomRates && d.reservationRoomRates.length > 0 && (
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <h3 className="font-semibold text-base text-slate-800 mb-4">
              Daily Breakdown
            </h3>
            <div className="overflow-hidden rounded-xl border border-slate-100 shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600 font-medium border-b">
                  <tr>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Extra</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {d.reservationRoomRates.map((r) => (
                    <tr key={r.uuid} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 font-medium">
                        {dayjs(r.date).format("DD-MM-YYYY")}
                      </td>
                      <td className="p-3 text-xs">
                        {r?.reservationRoomExtras?.length > 0 ? (
                          r.reservationRoomExtras.map((extra) => {
                            const quantity = extra.quantity
                              ? `${extra.quantity}`
                              : "";
                            const price = extra.grandTotal
                              ? ` (${extra.grandTotal.toLocaleString()} MMK)`
                              : "";
                            return (
                              <div key={extra.uuid} className="mb-1 last:mb-0">
                                {extra.extraType === "baby_cot" &&
                                  `Baby Cot: ${quantity}${price}`}
                                {extra.extraType === "extra_bed" &&
                                  `Extra Bed: ${quantity}${price}`}
                                {extra.extraType === "extra_person" &&
                                  `Extra Person: ${quantity}${price}`}
                              </div>
                            );
                          })
                        ) : (
                          <span>—</span>
                        )}
                      </td>
                      <td className="p-3 text-right font-semibold text-slate-800">
                        <div className="flex items-center justify-end gap-1">
                          {r.isComplimentary && (
                            <span
                              title="Complimentary"
                              className="cursor-pointer flex items-center"
                            >
                              <Gift className="w-4 h-4 text-emerald-600" />
                            </span>
                          )}
                          <span>
                            {(() => {
                              const extrasTotal =
                                r?.reservationRoomExtras?.reduce(
                                  (sum, extra) => sum + (extra.grandTotal || 0),
                                  0,
                                ) || 0;
                              const total =
                                (r.grandTotal || 0) + (r.tax || 0) + extrasTotal;
                              return `${total.toLocaleString()} MMK`;
                            })()}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default RoomInformationDetailsForm;