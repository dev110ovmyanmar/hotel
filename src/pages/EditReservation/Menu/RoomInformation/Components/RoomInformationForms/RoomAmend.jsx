import React, { useState } from "react";
import { Form, DatePicker, Button, Spin, Drawer } from "antd";
import {
  User,
  BedDouble,
  Calendar,
  PlusCircle,
  MinusCircle,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";

import { reservationNoteCreate } from "../../../../../../api/reservationSectionApi"; // Swap this with your actual Update API endpoint
import useApiQuery from "../../../../../../hooks/useApiQuery";
import { useApiMutation } from "../../../../../../hooks/useApiMutation";
import Toast from "../../../../../../component/Toast/Toast";

const RoomAmend = ({ mode, open, onClose, selectedData, onSuccess }) => {
  const location = useLocation();
  const bookingId = location.state?.bookingId;
  const [form] = Form.useForm();

  // Component UI States
  const [amendType, setAmendType] = useState("reduce");
  const [newDepartureDate, setNewDepartureDate] = useState(null);
  const [nightDifference, setNightDifference] = useState(0);

  // Mocked/Derived Current Stay Data from selectedData props
  const currentStay = {
    guestName: selectedData?.guestName || "Mr. Liam Johnson Smith",
    room: selectedData?.roomName || "DBD - 1001",
    checkIn: selectedData?.checkInDate || "2026-11-11",
    checkOut: selectedData?.checkOutDate || "2026-11-13",
    totalNights: selectedData?.totalNights || 3,
  };

  // Replace with your real Stay Details API Hook if needed
  const { data, isFetching } = useApiQuery({
    fetchQueryName: ["room-stay-detail", selectedData?.uuid],
    enabled: !!selectedData?.uuid,
  });

  // Stay Amendment Mutation setup
  const roomAmendMutation = useApiMutation({
    mutationFn: reservationNoteCreate, // Replace with your actual reservationAmend API function
  });

  // Calculate Night Modifications dynamically
  const handleDateChange = (date) => {
    setNewDepartureDate(date);
    if (!date) {
      setNightDifference(0);
      return;
    }
    const originalCheckOut = dayjs(currentStay.checkOut);
    const diffDays = date.diff(originalCheckOut, "day");
    setNightDifference(diffDays);
  };

  // Restrict calendar choices based on Extend/Reduce logic
  const disabledDate = (current) => {
    const today = dayjs().startOf("day");
    const originalCheckOut = dayjs(currentStay.checkOut);

    if (amendType === "reduce") {
      return current.isBefore(today) || current.isAfter(originalCheckOut);
    } else {
      return current.isBefore(originalCheckOut.add(1, "day"));
    }
  };

  const onFinish = () => {
    if (!newDepartureDate) {
      Toast.error("Please select a new departure date first.");
      return;
    }

    const payload = {
      bookingId: bookingId,
      roomUuid: selectedData?.uuid,
      amendType: amendType,
      newDepartureDate: newDepartureDate.format("YYYY-MM-DD"),
      nightDifference: Math.abs(nightDifference),
    };

    roomAmendMutation.mutate(payload, {
      onSuccess: () => {
        Toast.success("Stay amended successfully!");
        onSuccess?.();
        onClose?.();
      },
    });
  };

  return (
    <Drawer
      title={
        <span className="text-xl font-bold text-gray-800">Room Amend</span>
      }
      placement="right"
      width={520}
      onClose={onClose}
      open={open}
      destroyOnClose
      extra={
        <Button
          type="primary"
          loading={roomAmendMutation.isPending}
          onClick={() => form.submit()}
          className="bg-[#0066cc] text-white font-medium h-auto px-5 py-1.5 rounded hover:bg-[#0052a3] border-none text-sm"
        >
          Update
        </Button>
      }
    >
      <Spin spinning={isFetching}>
        <div className="space-y-6 font-sans">
          {/* Current Stay Details Card */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">
              Current Stay Detail
            </h2>
            <div className="border border-gray-200 rounded-lg p-4 space-y-3 bg-white">
              <div className="flex items-center gap-3 text-gray-700">
                <User size={20} className="text-gray-500 shrink-0" />
                <span className="text-sm font-medium">
                  {currentStay.guestName}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <BedDouble size={20} className="text-gray-500 shrink-0" />
                <span className="text-sm font-medium">{currentStay.room}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar size={20} className="text-gray-500 shrink-0" />
                <span className="text-sm font-medium">
                  {dayjs(currentStay.checkIn).format("DD/MM/YYYY")} →{" "}
                  {dayjs(currentStay.checkOut).format("DD/MM/YYYY")} (
                  {currentStay.totalNights} Nights)
                </span>
              </div>
            </div>
          </section>

          {/* Select Amend Type Switchers */}
          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">
              Select Amend Type
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Extend Button */}
              <button
                type="button"
                onClick={() => {
                  setAmendType("extend");
                  setNewDepartureDate(null);
                  setNightDifference(0);
                }}
                className={`flex flex-col items-center justify-center p-5 rounded-lg border-2 transition-all ${
                  amendType === "extend"
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                <PlusCircle
                  size={28}
                  className={
                    amendType === "extend" ? "text-blue-600" : "text-gray-600"
                  }
                />
                <span className="mt-2 font-semibold text-sm">Extend Stay</span>
              </button>

              {/* Reduce Button */}
              <button
                type="button"
                onClick={() => {
                  setAmendType("reduce");
                  setNewDepartureDate(null);
                  setNightDifference(0);
                }}
                className={`flex flex-col items-center justify-center p-5 rounded-lg border-2 transition-all ${
                  amendType === "reduce"
                    ? "border-red-200 bg-red-50 text-red-600"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
              >
                <MinusCircle
                  size={28}
                  className={
                    amendType === "reduce" ? "text-red-500" : "text-gray-600"
                  }
                />
                <span className="mt-2 font-semibold text-sm">Reduce Stay</span>
              </button>
            </div>
          </section>

          {/* Date Mutation Input Box */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-gray-900 capitalize">
              {amendType} Departure Date
            </h2>

            {/* Informative Alert Helper Box */}
            <div
              className={`p-2.5 rounded border text-xs font-medium transition-colors ${
                amendType === "reduce"
                  ? "bg-red-50 border-red-100 text-red-600"
                  : "bg-blue-50 border-blue-100 text-blue-600"
              }`}
            >
              {amendType === "reduce"
                ? "Select a checkout date between today and the current departure date"
                : "Select a checkout date after your current departure date"}
            </div>

            {/* AntD Form Wrapper */}
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500">
                  New Departure Date
                </label>
                <div className="flex gap-2 items-center">
                  <Form.Item
                    name="newDate"
                    className="w-full mb-0"
                    rules={[
                      {
                        required: true,
                        message: "Please select a departure date",
                      },
                    ]}
                  >
                    <DatePicker
                      className="w-full h-11 border-gray-300 rounded hover:border-gray-400 focus:border-blue-500"
                      disabledDate={disabledDate}
                      onChange={handleDateChange}
                      value={newDepartureDate}
                      format="DD/MM/YYYY"
                      placeholder="Select date"
                    />
                  </Form.Item>

                  {/* Badge showing Night calculations dynamically */}
                  <div
                    className={`h-11 flex items-center justify-center px-3 border rounded text-xs font-bold whitespace-nowrap min-w-[140px] ${
                      nightDifference === 0
                        ? "bg-red-50 border-red-100 text-red-500"
                        : amendType === "reduce"
                          ? "bg-red-100 border-red-200 text-red-600"
                          : "bg-blue-100 border-blue-200 text-blue-600"
                    }`}
                  >
                    {nightDifference === 0
                      ? "- 0 Night Reduction"
                      : `${nightDifference > 0 ? "+" : ""} ${nightDifference} Night ${amendType === "reduce" ? "Reduction" : "Extension"}`}
                  </div>
                </div>
              </div>
            </Form>
          </section>
        </div>
      </Spin>
    </Drawer>
  );
};

export default RoomAmend;
