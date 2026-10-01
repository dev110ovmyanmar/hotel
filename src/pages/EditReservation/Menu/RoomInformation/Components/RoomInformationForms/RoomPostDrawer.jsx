import React, { useState } from "react";
import { Drawer, Modal, Table } from "antd";
import dayjs from "dayjs";
import { AlertTriangle, BedDouble, CalendarDays, Gift } from "lucide-react";
import { CheckCircleFilled } from "@ant-design/icons";
import Loader from "../../../../../../component/Loader/Loader";
import PriceTag from "../../../../../../component/PriceTag/PriceTag";
import { reservationRoomDetails, roomPost } from "../../../../../../api/reservationSectionApi";
import { useApiQuery } from "../../../../../../hooks/useApiQuery";
import { useApiMutation } from "../../../../../../hooks/useApiMutation";
import Toast from "../../../../../../component/Toast/Toast";
import {
  textColorDarkMode,
  textWhiteInDarkStyle,
} from "../../../../../../utils";

// Custom styles for modal without footer
const modalStyles = `
  .room-post-modal .ant-modal-body {
    min-height: 80px;
    display: flex;
    align-items: center;
  }
`;

// Monospace-style info row
const InfoLine = ({ label, value }) => (
  <div className="flex gap-2 font-mono text-sm leading-relaxed">
    <span className="text-slate-500 dark:text-gray-400 w-28 shrink-0">{label}</span>
    <span className="text-slate-400 dark:text-gray-500 shrink-0">:</span>
    <span className="text-slate-800 dark:text-gray-100 font-medium">{value || "-"}</span>
  </div>
);

const RoomPostDrawer = ({
  drawerOpen,
  setDrawerOpen,
  selectedData,
  setSelectedData,
}) => {
  const [roomPostModal, setRoomPostModal] = useState({ open: false, stayDate: null });

  const {
    data: reservationRoomsDetails,
    isFetching: reservationRoomsDetailFetching,
  } = useApiQuery({
    fetchQueryName: "reservation-room-details",
    fetchQueryFunction: reservationRoomDetails,
    params: { uuid: selectedData?.uuid },
    options: { enabled: !!selectedData?.uuid && drawerOpen },
  });

  const d = reservationRoomsDetails;

  const updateRoomPost = useApiMutation({
    mutationFn: roomPost,
    invalidateKeys: [["reservation-room-details"], ["reservation-room"]],
  });

  const isCheckedIn = d?.roomStatus?.code === "checked_in";

  const reservationCode = d?.reservation?.reservationNo || "-";
  const guestName = d?.guest?.fullName;

  const roomLabel =  <div className="flex w-full items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-neutral-800">
              {d?.room?.roomNo}
            </span>
            <span className="whitespace-nowrap rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              {d?.roomType?.name}
            </span>
          </div>
        </div>

  const checkinDate = d?.checkinDate;
  const checkoutDate = d?.checkoutDate;
  const nights = d?.totalNight;

  const stayText =
    checkinDate && checkoutDate
      ? `${dayjs(checkinDate).format("DD MMM YYYY")} - ${dayjs(checkoutDate).format("DD MMM YYYY")}${nights !== null && nights !== undefined ? ` (${nights} Night${nights !== 1 ? "s" : ""})` : ""}`
      : "-";

  const sourceType = d?.reservation?.sourceType?.name;
  const sourceName = d?.reservation?.source?.name;
  const chargeValue = d?.reservation?.source?.chargeValue;

  const isSourceWithCharge = ["agency", "company", "referral_agent"].includes(
    d?.reservation?.sourceType?.code,
  );
  const isFlat = d?.reservation?.source?.chargeType?.code === "flat";
  const chargeType = isFlat ? "MMK" : "%";

  const handleClose = () => {
    setDrawerOpen(false);
    setRoomPostModal({ open: false, stayDate: null });
    if (setSelectedData) setSelectedData(null);
  };

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
      },
    );
  };

  const getExtraTotalCharge = (dc) =>
    (dc?.babyCotTotal || 0) +
    (dc?.childChargeTotal || 0) +
    (dc?.extraBedTotal || 0) +
    (dc?.extraPersonTotal || 0);

  const columns = [
    {
      title: "Date",
      key: "stayDate",
      align: "left",
      render: (_, record) => (
        <span className="font-medium text-slate-700 dark:text-gray-200">
          {record?.stayDate
            ? dayjs(record.stayDate).format("YYYY-MM-DD")
            : "-"}
        </span>
      ),
    },
    {
      title: "Room Rate(MMK)",
      key: "roomRate",
      align: "right",
      render: (_, record) => (
        <span className="text-slate-600 dark:text-gray-300">
          <PriceTag value={record?.dailyCharge?.roomRate || 0} />
        </span>
      ),
    },
    {
      title: "Extra(MMK)",
      key: "extra",
      align: "right",
      render: (_, record) => (
        <span className="text-slate-600 dark:text-gray-300">
          <PriceTag value={getExtraTotalCharge(record?.dailyCharge)} />
        </span>
      ),
    },
    {
      title: "Tax(MMK)",
      key: "tax",
      align: "right",
      render: (_, record) => (
        <span className="text-slate-600 dark:text-gray-300">
          <PriceTag value={record?.dailyCharge?.taxTotal || 0} />
        </span>
      ),
    },
    {
      title: "Total(MMK)",
      key: "grandTotal",
      align: "right",
      render: (_, record) => (
        <div className="flex items-center justify-end gap-1.5">
          {record?.isComplimentary && (
            <Gift className="w-3.5 h-3.5 text-emerald-500" title="Complimentary" />
          )}
          <span className="dark:text-gray-100 flex items-center gap-1">
            <PriceTag value={record?.dailyCharge?.grandTotal || 0} />
          </span>
        </div>
      ),
    },
    {
      title: "Room Posting",
      key: "roomPosting",
      align: "center",
      render: (_, record) => {
        const isTodayOrPast = !dayjs(record.stayDate).isAfter(dayjs(), "day");
        const isPosted = record?.dailyCharge?.postedToFolio === true;

        if (isPosted) {
          return (
            <div
              className="flex items-center justify-center gap-2 border-2 border-green-400 p-2 rounded bg-green-50"
              onClick={(e) => e.stopPropagation()}
            >
              <CheckCircleFilled className="!text-green-600" />
              <div className="flex flex-col">
                <span className="text-green-600 whitespace-nowrap">Posted</span>
                {record?.dailyCharge?.postedAt && (
                  <span className="text-black text-xs whitespace-nowrap">
                    {dayjs(record?.dailyCharge?.postedAt)?.format(
                      "YYYY-MM-DD HH:mm",
                    )}
                  </span>
                )}
              </div>
            </div>
          );
        }

        return (
          <div
            className={`flex items-center justify-center gap-2 border-2 p-2 rounded ${
              isTodayOrPast
                ? "border-blue-400 bg-blue-50 cursor-pointer hover:bg-blue-100"
                : "border-gray-300 bg-gray-100 cursor-not-allowed opacity-50 pointer-events-none"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (!isTodayOrPast) return;
              setRoomPostModal({ open: true, stayDate: record.stayDate });
            }}
            title={isTodayOrPast ? "Room Post" : "Only available today"}
          >
            <BedDouble
              className={isTodayOrPast ? "text-blue-500" : "text-gray-400"}
              size={20}
            />
            <span
              className={`whitespace-nowrap ${
                isTodayOrPast ? "text-blue-500" : "text-gray-400"
              }`}
            >
              Post Room
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <style>{modalStyles}</style>
      <Drawer
        open={drawerOpen}
        onClose={handleClose}
        width={850}
        title={
          <div className="flex items-center gap-3">
            <div>
              <span
                className={`font-bold text-lg text-slate-800 block ${textWhiteInDarkStyle}`}
              >
                Room Posted
              </span>
            </div>
          </div>
        }
      >
        {reservationRoomsDetailFetching ? (
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <Loader />
          </div>
        ) : (
          <div className="space-y-2">
            {/* Reservation Info Card */}
            <div>
              <div className="relative rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800/60 px-5 py-4">
                <div className="space-y-0.5">
                  <InfoLine label="Reservation No" value={reservationCode || "-"} />
                  <InfoLine label="Guest" value={guestName || "-"} />
                  <InfoLine label="Room" value={roomLabel || "-"} />
                  <InfoLine label="Stay" value={stayText || "-"} />
                  <InfoLine
                    label="Source"
                    value={
                      sourceType ? (
                        <>
                          {sourceType}
                          {isSourceWithCharge && (
                            <>
                              <span className="text-indigo-600">
                                {" "}( {sourceName} -
                              </span>{" "}

                              <span className="text-indigo-600">
                                {isFlat ? (
                                  <PriceTag value={chargeValue} />
                                ) : (
                                  chargeValue
                                )}{" "}
                                {chargeType} )
                              </span>
                            </>
                          )}
                        </>
                      ) : (
                        "-"
                      )
                    }
                  />
                </div>
              </div>
            </div>

            {/* Daily Breakdown Table */}
            {d?.dailyOccupancies && d.dailyOccupancies.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200/60 dark:border-gray-600 overflow-hidden">
                <div className="overflow-x-auto">
                  <Table
                    size="small"
                    expandable={{
                      showExpandColumn: false,
                    }}
                    rowKey={(record) => record.uuid || record.stayDate}
                    columns={columns}
                    dataSource={d?.dailyOccupancies ?? []}
                    pagination={false}
                    scroll={{ x: 760 }}
                    rowClassName={(_, index) =>
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-800"
                        : "bg-slate-50/50 dark:bg-gray-800/50"
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-slate-300 dark:border-gray-600 bg-slate-50 dark:bg-gray-800/40 px-5 py-8 text-center">
                <div className="text-sm text-slate-400 dark:text-gray-500">
                  Daily occupancy is not available for this room yet.
                </div>
              </div>
            )}
          </div>
        )}

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
                  {dayjs(roomPostModal.stayDate)?.format("YYYY-MM-DD")}
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
                  Room status must be{" "}
                  <span className="font-medium text-red-500">"Checked In"</span>{" "}
                  to post this room.
                </p>
              </div>
            </div>
          )}
        </Modal>
      </Drawer>
    </>
  );
};

export default RoomPostDrawer;
