import React, { useState } from "react";
import { Button, Spin, Empty, Modal } from "antd"; // Import Modal from antd
import dayjs from "dayjs";
import {
  reservationRoomAssign,
  reservationRoomSearch,
} from "./../../../../../../api/reservationSectionApi";
import { LIMITS } from "../../../../../../variables/constants";
import useApiQuery from "../../../../../../hooks/useApiQuery";
import { useApiMutation } from "../../../../../../hooks/useApiMutation";
import Toast from "../../../../../../component/Toast/Toast";

const GetRoomForm = ({ selectedData, onSelectRoom, onClose, floorUuid }) => {

  const statusColorMap = {
    Available: "text-[#389E0D] bg-[#F6FFED] text-xs p-1 px-2 rounded border border-[#B7EB8F]",
    Occupied: "text-[#0958D9] bg-[#E6F4FF] text-xs p-1 px-2 rounded border border-[#91CAFF]",
    Dirty: "text-[#D4A106] bg-[#FDFFE0] text-xs p-1 px-2 rounded border border-[#F4E34F]",
    Maintenance: "text-[#CF1322] bg-[#FFF1F0] text-xs p-1 px-2 rounded border border-[#FFA39E]",
    "Out of Service": "text-[#CF1322] bg-[#FFF1F0] text-xs p-1 px-2 rounded border border-[#FFA39E]",
    "Cleaning":"text-[#389E0D] bg-[#F6FFED] text-xs p-1 px-2 rounded border border-[#B7EB8F]",
  };

  const { data, isLoading } = useApiQuery({
    fetchQueryName: "reservationRoom",
    fetchQueryFunction: reservationRoomSearch,
    params: {
      filter: {
        checkinDate: selectedData?.checkinDate
          ? dayjs(selectedData.checkinDate).format("YYYY-MM-DD")
          : null,
        checkoutDate: selectedData?.checkoutDate
          ? dayjs(selectedData.checkoutDate).format("YYYY-MM-DD")
          : null,
      },
      roomType: { uuid: selectedData?.roomType?.uuid },
      floor: { uuid: floorUuid },
    },
  });

  const assignMutation = useApiMutation({
    mutationFn: reservationRoomAssign,
    invalidateKeys: [["reservation-room"]],
  });

  const executeRoomAssignment = (room) => {
    const payload = {
      reservationRoom: {
        uuid: selectedData?.uuid,
      },
      room: {
        uuid: room?.uuid,
      },
    };

    assignMutation.mutate(payload, {
      onSuccess: () => {
        Toast.success(`Room ${room.roomNo} assigned successfully!`);
        if (onSelectRoom) onSelectRoom(room);
        onClose();
      },
    });
  };

  const handleAssignClick = (room) => {
    Modal.confirm({
      title: "Confirm Room Assign",
      content: `Are you sure you want to assign Room ${room.roomNo} (${room.roomType?.name || ""}) to this reservation?`,
      okText: "Confirm",
      okButtonProps: { className: "bg-blue-600 hover:bg-blue-500 text-white border-none" }, 
      cancelText: "Cancel",
      onOk: () => {
        executeRoomAssignment(room);
      },
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <Spin />
      </div>
    );

  return (
    <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto p-2">
      {data?.rooms?.length > 0 ? (
        data.rooms.map((room) => (
          <div
            key={room.uuid || room.id}
            className="flex justify-between items-center p-3 border border-gray-100 shadow-sm rounded-lg hover:border-blue-300 transition-all bg-white"
          >
            <div className="flex flex-col">
              <span className="font-bold text-gray-800 text-sm">
                Room {room.roomNo}
              </span>
              <span className="text-[11px] text-gray-500">
                {room.roomType?.name}
              </span>
            </div>

            <div className="flex items-center gap-25">
              <span className={statusColorMap[room.status?.name]}>
                {room.status?.name}
              </span>

              <Button
                loading={assignMutation.isLoading}
                onClick={() => handleAssignClick(room)}
                className="custom-blue-btn"
              >
                Assign
              </Button>
            </div>
          </div>
        ))
      ) : (
        <Empty description="No rooms available" />
      )}
    </div>
  );
};

export default GetRoomForm;