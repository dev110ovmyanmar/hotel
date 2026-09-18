import React from "react";
import { Button, Spin, Empty, Modal } from "antd";
import dayjs from "dayjs";
import {
  reservationRoomAssign,
  reservationRoomSearch,
} from "./../../../../../../api/reservationSectionApi";
import useApiQuery from "../../../../../../hooks/useApiQuery";
import { useApiMutation } from "../../../../../../hooks/useApiMutation";
import Toast from "../../../../../../component/Toast/Toast";
import {
  textColorDarkMode,
  textWhiteInDarkStyle,
} from "../../../../../../utils";
import ColorStatusTag from "../../../../../../component/ColorStatusTag/ColorStatusTag";

const GetRoomForm = ({ selectedData, onSelectRoom, onClose, floorUuid }) => {

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
      icon: null,
      title: (
        <>
          {" "}
          <div className={textWhiteInDarkStyle}>Confirm Assign Room</div>
        </>
      ),
      content: (
        <>
          Are you sure you want to assign{" "}
          <strong>
            Room {room.roomNo} ({room.roomType?.name || ""})
          </strong>{" "}
          to this reservation?
        </>
      ),
      okText: "Confirm",
      okButtonProps: {
        className: "bg-blue-600 hover:bg-blue-500 text-white border-none",
      },
      cancelText: "Cancel",
      onOk: () => {
        executeRoomAssignment(room);
      },
      rootClassName: "dark-confirm-modal",
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
              <span
                className={`font-bold text-gray-800 text-sm ${textColorDarkMode}`}
              >
                {room.roomNo}
              </span>
              <span
                className={`text-[11px] text-gray-500 ${textWhiteInDarkStyle}`}
              >
                {room.roomType?.name}
              </span>
            </div>

            <div className="flex items-center gap-14">

              <ColorStatusTag status={room?.status} iconType="bed" />

              <ColorStatusTag status={room?.cleanStatus} iconType="broom" />

              <Button
                loading={assignMutation.isLoading}
                disabled={["Out of Service", "Out of Order"].includes(room.status?.name)}
                onClick={() => handleAssignClick(room)}
                className={
                  ["Out of Service", "Out of Order"].includes(room.status?.name)
                    ? ""
                    : "custom-blue-btn"
                }
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
