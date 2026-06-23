import React, { useMemo, useEffect } from "react";
import { Drawer, Form, Input, Select, Checkbox, Button } from "antd";
import { queryClient } from "../../../../app/queryClient";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import Toast from "../../../../component/Toast/Toast";
import {
  reservationRoomList,
  updateReservationStatus,
} from "../../../../api/reservationSectionApi";
import dayjs from "dayjs";
import { useApiQuery } from "./../../../../hooks/useApiQuery";
import { useLocation } from "react-router-dom";

const ChangeStatusForm = ({ reservationDetails, open, onClose }) => {
  const [form] = Form.useForm();
  const location = useLocation();
  const uuid = location.state?.bookingId;

  const selectedStatusUuid = Form.useWatch("changeBookingStatusTo", form);
  const selectedRooms = Form.useWatch("reservationRooms", form) || [];
  const initData = queryClient.getQueryData(["initData", "authenticated"]);

  const { data } = useApiQuery({
    fetchQueryFunction: reservationRoomList,
    params: {
      reservationRoom: {
        uuid: uuid,
      },
    },
    enabled: !!uuid && open,
  });

  const reservationStatuses = useMemo(() => {
    if (!initData?.statuses?.reservation_room_status) return [];

    const roomsArray = Array.isArray(data?.data)
      ? data.data
      : data?.data
        ? [data.data]
        : [];

    return initData.statuses.reservation_room_status
      .filter((status) => {
        const statusCode = status.code?.toLowerCase();
        return (
          statusCode !== "pending" &&
          statusCode !== "reserved" &&
          statusCode !== "booked"
        );
      })
      .map((status) => {
        const statusCode = status.code?.toLowerCase();
        let isDisabled = false;

        if (data?.data) {
          const hasValidRooms = roomsArray.some((roomItem) => {
            const allowableStatuses = Array.isArray(roomItem?.checkStatus)
              ? roomItem.checkStatus.map((s) => String(s).toLowerCase())
              : [];
            return allowableStatuses.includes(statusCode);
          });
          isDisabled = !hasValidRooms;
        }

        return {
          value: status.uuid,
          label: status.name,
          code: statusCode,
          disabled: isDisabled,
        };
      });
  }, [initData, data]);

  const currentActiveStatus = useMemo(() => {
    return reservationStatuses.find(
      (status) => status.value === selectedStatusUuid,
    );
  }, [selectedStatusUuid, reservationStatuses]);

  const roomOptions = useMemo(() => {
    if (!data?.data || !currentActiveStatus) return [];

    const roomsArray = Array.isArray(data.data) ? data.data : [data.data];

    const statusColorMap = {
      booked: "text-[#0958D9] bg-[#E6F4FF] text-xs p-1 rounded ",
      confirmed: "text-[#389E0D] bg-[#F6FFED] text-xs p-1 rounded",
      checked_in: "text-[#08979C] bg-[#E6FFFB] text-xs p-1 rounded",
      checked_out: "text-[#FF8D28] bg-[#FFF4F1] text-xs p-1 rounded",
      "no-show": "text-gray-800 bg-gray-100 text-xs p-1 rounded",
      cancelled: "text-red-600 bg-red-100 text-xs p-1 rounded",
    };

    return roomsArray
      .filter((roomItem) => {
        const allowableStatuses = Array.isArray(roomItem?.checkStatus)
          ? roomItem.checkStatus.map((s) => String(s).toLowerCase())
          : [];

        return allowableStatuses.includes(currentActiveStatus.code);
      })
      .map((roomItem) => {
        const checkIn = roomItem?.checkinDate
          ? dayjs(roomItem.checkinDate).format("YYYY-MM-DD")
          : "";
        const checkOut = roomItem?.checkoutDate
          ? dayjs(roomItem.checkoutDate).format("YYYY-MM-DD")
          : "";

        const roomNo = roomItem?.room?.roomNo || roomItem?.roomNo;
        const roomTypeName = roomItem?.roomType?.name || "Standard Room";
        const roomStatus = roomItem?.roomStatus?.name || "";
        const statusCode = roomStatus.toLowerCase().trim();
        const statusColorClass =
          statusColorMap[statusCode] ||
          "text-gray-600 bg-gray-100 text-xs p-1 rounded";

        const isCheckedInStatusSelected =
          currentActiveStatus.code === "checked_in";
        const isRoomNull = !roomNo;
        const isDisabledRoom = isCheckedInStatusSelected && isRoomNull;

        return {
          label: (
            <div
              className={`flex flex-col line-height-tight py-0.5 ${isDisabledRoom ? "opacity-50" : ""}`}
            >
              <span className="font-medium text-slate-800">
                {roomNo ? `${roomNo} - ` : ""}
                {roomTypeName}{" "}
                {roomStatus && (
                  <span className={statusColorClass}>{roomStatus}</span>
                )}
                {isDisabledRoom && (
                  <span className="text-red-500 bg-red-50 text-xs p-1 rounded ml-2 font-normal">
                    Assign room first
                  </span>
                )}
              </span>
              {checkIn && checkOut && (
                <span className="text-xs text-slate-500">
                  ({checkIn} - {checkOut})
                </span>
              )}
            </div>
          ),
          value: roomItem?.id,
          disabled: isDisabledRoom,
        };
      });
  }, [data, currentActiveStatus]);

  const enabledRoomOptions = useMemo(
    () => roomOptions.filter((o) => !o.disabled),
    [roomOptions],
  );

  const isStatusSelected = !!selectedStatusUuid;
  const shouldShowRoomSelection = roomOptions.length > 0;

  const isButtonDisabled = isStatusSelected && roomOptions.length === 0;
  const isCancelledSelected = currentActiveStatus?.code === "cancelled";

  const updateReservationStatusMutation = useApiMutation({
    mutationFn: updateReservationStatus,
    invalidateKeys: [["reservation-details"], ["reservation-room"]],
  });

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  const onFinish = (values) => {
    let collectedRoomIds = [];

    if (values.reservationRooms && values.reservationRooms.length > 0) {
      collectedRoomIds = values.reservationRooms;
    } else {
      collectedRoomIds = enabledRoomOptions.map((opt) => opt.value);
    }

    const payload = {
      uuid:
        reservationDetails?.uuid ||
        reservationDetails?.reservation?.uuid ||
        uuid,
      reservationRoomStatus: { uuid: values.changeBookingStatusTo },
      reservationRoom: {
        ids: collectedRoomIds,
      },
      reason: values?.reason || "",
    };

    updateReservationStatusMutation.mutate(payload, {
      onSuccess: () => {
        Toast.success("Reservation Status Updated Successfully!");
        onClose();
      },
    });
  };

  const isAllSelected =
    enabledRoomOptions.length > 0 &&
    selectedRooms.length === enabledRoomOptions.length;
  const isIndeterminate =
    selectedRooms.length > 0 &&
    selectedRooms.length < enabledRoomOptions.length;

  const handleSelectAllChange = (e) => {
    form.setFieldsValue({
      reservationRooms: e.target.checked
        ? enabledRoomOptions.map((opt) => opt.value)
        : [],
    });
  };

  useEffect(() => {
    form.setFieldsValue({ reservationRooms: [] });
  }, [selectedStatusUuid, form]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size={500}
      destroyOnClose
      title={
        <div className="flex justify-between items-center">
          <span>Change Status</span>
          <Button
            type="primary"
            disabled={isButtonDisabled}
            onClick={() => form.submit()}
            className={`transition-all duration-300 ${
              isButtonDisabled
                ? "!bg-blue-100 !text-blue-400 !border-blue-200 opacity-60 filter blur-[0.4px] cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Update
          </Button>
        </div>
      }
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label={<span>Change Booking Status</span>}
          name="changeBookingStatusTo"
          rules={[{ required: true, message: "Please select a status" }]}
        >
          <Select
            showSearch
            className="w-full"
            placeholder="Select a reservation status..."
            options={reservationStatuses}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            optionRender={(option) => (
              <span
                className={
                  option.data.disabled
                    ? "text-gray-500 font-normal opacity-90"
                    : "text-slate-800 font-medium"
                }
              >
                {option.data.label}
              </span>
            )}
          />
        </Form.Item>

        {shouldShowRoomSelection && (
          <div className="mb-4">
            <Form.Item
              label={
                <div className="flex">
                  <span className="text-slate-800">Select Room to Update</span>
                  <div className="text-slate-800 ml-50 font-medium">
                    <Checkbox
                      className="room-select"
                      indeterminate={isIndeterminate}
                      onChange={handleSelectAllChange}
                      checked={isAllSelected}
                    >
                      Select All
                    </Checkbox>
                  </div>
                </div>
              }
              name="reservationRooms"
              rules={[
                { required: true, message: "Please select at least one room" },
              ]}
            >
              <Checkbox.Group
                options={roomOptions}
                className="flex flex-col gap-2 w-full "
              />
            </Form.Item>
          </div>
        )}

        {isCancelledSelected && (
          <Form.Item label={<span>Cancellation Reason</span>} name="reason">
            <Input.TextArea
              rows={3}
              placeholder="Please provide a reason for cancelling this reservation..."
            />
          </Form.Item>
        )}
      </Form>
    </Drawer>
  );
};

export default ChangeStatusForm;
