import React, { useState } from "react";
import { Users, Utensils } from "lucide-react";
import dayjs from "dayjs";
import ColorStatusTag from "../../../../component/ColorStatusTag/ColorStatusTag";
import { Empty, Pagination } from "antd";
import { reservationRoomList } from "../../../../api/reservationSectionApi";
import { LIMITS } from "../../../../variables/constants";
import useApiQuery from "../../../../hooks/useApiQuery";
import PriceTag from "../../../../component/PriceTag/PriceTag";

const StayHistory = ({ guestUuid }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [mode, setMode] = useState("");
  const [selectedRow, setSelectedRow] = useState();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);

  const { data: stayHistoryListFromReservationRoom, isLoading } = useApiQuery({
    fetchQueryName: "reservation-room",
    fetchQueryFunction: reservationRoomList,
    params: {
      guest: { uuid: guestUuid },
      pagination: {
        page: page,
        perPage: perPage,
      },
    },
    options: { enabled: !!guestUuid },
  });

  return (
    <>
      {stayHistoryListFromReservationRoom?.data.length <= 0 ? (
        <Empty description="No Stay History Data" />
      ) : (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Stay History
          </h2>

          <div className="space-y-12">
            {stayHistoryListFromReservationRoom?.data.map((booking, idx) => {
              return (
                <div key={idx} className="relative pl-10">
                  {/* 1. THE LINE: Only show if it's NOT the last item in the entire history */}
                  {/* We use h-full and top-6 to ensure the line starts at the circle and goes down */}
                  <div className="absolute left-[11px] top-6 bottom-[-48px] w-[2px] bg-slate-200 last:hidden"></div>

                  {/* 2. THE CIRCLE: Added bg-white and z-10 to stay on top of the line */}
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full border-2 border-blue-600 bg-white z-10 flex items-center justify-center"></div>

                  {/* 3. THE CARD */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:border-blue-300 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                          {dayjs(booking.checkinDate).format("DD MMMM YYYY")} -{" "}
                          {dayjs(booking?.checkoutDate).format(
                            "DD MMMM YYYY",
                          )}{" "}
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200 font-semibold">
                          {booking.totalNight === 0 ? "" : booking.totalNight}
                          {booking.totalNight > 1 ? " Nights" : " Night"}
                        </span>
                      </div>

                      <div className="flex items-center gap-x-4">
                        <div className="text-xs text-slate-400 font-medium">
                          Reservation No:{" "}
                          <span className="text-slate-800 dark:text-slate-100 font-bold">
                            {booking?.reservation?.reservationNo}
                          </span>
                        </div>
                        <ColorStatusTag status={booking?.roomStatus} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 ">
                      <div className="!mt-3">
                        <div className="flex gap-x-3">
                          <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                            {booking?.roomType?.name}
                          </h4>
                          <p className="mt-1">
                            (Room : {booking.room?.roomNo})
                          </p>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">
                          {booking?.room?.floor?.name} -{" "}
                          {booking?.room?.floor?.floorNo}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-x-3">
                        <span className="text-lg font-black text-slate-800 dark:text-slate-100 inline-flex items-center gap-1 whitespace-nowrap">
                          <PriceTag value={booking.subTotal} />
                          <span>MMK</span>
                        </span>
                        <ColorStatusTag
                          status={
                            booking?.reservation?.parentFolio?.financialStatus
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {stayHistoryListFromReservationRoom?.data?.length !== 0 && (
            <div className="flex justify-end">
              <Pagination
                current={page}
                pageSize={perPage}
                total={stayHistoryListFromReservationRoom?.data?.length || 0}
                onChange={(page) => setPage(page)}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default StayHistory;
