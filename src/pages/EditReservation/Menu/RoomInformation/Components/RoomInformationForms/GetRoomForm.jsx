import React, { useState } from "react";
import { Button, Spin, Empty } from "antd";
import dayjs from "dayjs";
import {
  reservationRoomAssign,
  reservationRoomSearch,
} from "./../../../../../../api/reservationSectionApi";
import { LIMITS } from "../../../../../../variables/constants";
import useApiQuery from "../../../../../../hooks/useApiQuery";
import { useApiMutation } from "../../../../../../hooks/useApiMutation";
import Toast from "../../../../../../component/Toast/Toast";
import ColorStatusTag from "./../../../../../../component/ColorStatusTag/ColorStatusTag";

const GetRoomForm = ({ selectedData, onSelectRoom, onClose, floorUuid }) => {
  const [page] = useState(1);
  const [perPage] = useState(LIMITS.PAGE_SIZE);

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
      pagination: { page, perPage },
    },
  });

  const assignMutation = useApiMutation({
    mutationFn: reservationRoomAssign,
    invalidateKeys: [["reservation-room"]],
  });

  const handleAssignClick = (room) => {
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

            <div className="flex items-center gap-5">
              <div className="flex flex-col items-center gap-1 mr-40">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600 ">
                  {room.status?.name || "Available"}
                </span>
              </div>

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
