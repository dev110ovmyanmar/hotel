// import React, { useEffect, useState } from "react";
// import {
//   Form,
//   Input,
//   Drawer,
//   Button,
//   Table,
//   Divider,
//   Space,
//   Popconfirm,
// } from "antd";
// import {
//   DeleteOutlined,
//   EditOutlined,
//   CheckOutlined,
//   CloseOutlined,
// } from "@ant-design/icons";
// import {
//   reservationNoteCreate,
//   reservationNoteDelete,
//   reservationNoteList,
// } from "../../../../../../api/reservationSectionApi";
// import useApiQuery from "../../../../../../hooks/useApiQuery";
// import { LIMITS } from "../../../../../../variables/constants";
// import { useLocation } from "react-router-dom";
// import { useApiMutation } from "../../../../../../hooks/useApiMutation";
// import Toast from "../../../../../../component/Toast/Toast";

// const RoomAmend = ({ mode, open, onClose, selectedData, onSuccess }) => {
//   const location = useLocation();
//   const uuid = location.state?.bookingId;
//   const [form] = Form.useForm();

//   const [editingKey, setEditingKey] = useState("");
//   const [editValue, setEditValue] = useState("");
//   const [keyword, setKeyword] = useState("");
//   const [page, setPage] = useState(1);
//   const [perPage, setPerPage] = useState(LIMITS.PAGE_SIZE);

//   const isView = mode === "view";

//   const { data, isLoading, refetch } = useApiQuery({
//     fetchQueryName: "reservation-note",
//     fetchQueryFunction: reservationNoteList,
//     params: {
//       pagination: {
//         page: page,
//         perPage: perPage,
//       },
//       keyword,
//       reservation: { uuid: uuid },
//       reservationRoom: { uuid: selectedData?.uuid },
//     },
//   });

//   const reservationNotesCreate = useApiMutation({
//     mutationFn: reservationNoteCreate,
//   });

//   const reservationNotesDelete = useApiMutation({
//     mutationFn: reservationNoteDelete,
//     invalidateKeys: [["reservation-note", { uuid: selectedData?.uuid }]],
//   });

//   const onFinish = (values) => {
//     const payload = {
//       note: values.noteContent,
//       reservation: { uuid: uuid },
//       reservationRoom: { uuid: selectedData?.uuid },
//     };

//     reservationNotesCreate.mutate(payload, {
//       onSuccess: () => {
//         Toast.success("Note Created Successfully!");
//         form.resetFields();
//         refetch?.();
//         onSuccess?.();
//       },
//     });
//   };
//   const editNote = (record) => {
//     const payload = {
//       note: editValue,
//       uuid: record?.uuid,
//       reservation: { uuid },
//       reservationRoom: { uuid: selectedData?.uuid || selectedData?.roomUuid },
//     };

//     reservationNotesCreate.mutate(payload, {
//       onSuccess: () => {
//         Toast.success("Note updated successfully!");
//         setEditingKey("");
//         setEditValue("");
//         refetch?.();
//         onSuccess?.();
//       },
//     });
//   };

//   const deleteNote = (record) => {
//     const payload = {
//       uuid: record?.uuid,
//     };

//     reservationNotesDelete.mutate(payload, {
//       onSuccess: () => {
//         Toast.success("Note deleted successfully!");
//         refetch?.();
//         onSuccess?.();
//       },
//     });
//   };

//   const columns = [
//     {
//       title: "Note",
//       dataIndex: "note",
//       key: "note",
//       render: (_, record) =>
//         record.id === editingKey ? (
//           <Input.TextArea
//             value={editValue}
//             onChange={(e) => setEditValue(e.target.value)}
//             autoSize
//           />
//         ) : (
//           record.note
//         ),
//     },
//     {
//       title: "Action",
//       hidden: isView,
//       width: 100,
//       render: (_, record) => (
//         <Space>
//           {record.id === editingKey ? (
//             <>
//               <CheckOutlined
//                 className="text-green-500 cursor-pointer"
//                 onClick={() => editNote(record)}
//               />
//               <CloseOutlined
//                 className="text-red-500 cursor-pointer"
//                 onClick={() => setEditingKey("")}
//               />
//             </>
//           ) : (
//             <>
//               <EditOutlined
//                 className="text-blue-500 cursor-pointer"
//                 onClick={() => {
//                   setEditingKey(record.id);
//                   setEditValue(record.note);
//                 }}
//               />
//               <Popconfirm title="Delete?" onConfirm={() => deleteNote(record)}>
//                 <DeleteOutlined className="text-red-500 cursor-pointer" />
//               </Popconfirm>
//             </>
//           )}
//         </Space>
//       ),
//     },
//   ].filter((c) => !c.hidden);

//   return (
//     <Drawer
//       open={open}
//       onClose={onClose}
//       title="Room Notes"
//       width={500}
//       extra={
//         !isView && (
//           <Button
//             type="primary"
//             htmlType="submit"
//             onClick={() => form.submit()}
//             loading={reservationNotesCreate.isPending}
//           >
//             Create
//           </Button>
//         )
//       }
//     >
//       {!isView && (
//         <Form form={form} layout="vertical" onFinish={onFinish}>
//           <Form.Item
//             label="Note"
//             name="noteContent"
//             rules={[
//               { required: true, message: "Please input your note content!" },
//             ]}
//           >
//             <Input.TextArea placeholder="Add a new note..." />
//           </Form.Item>
//         </Form>
//       )}

//       {data?.data && data.data.length > 0 && (
//         <>
//           <Divider>History</Divider>

//           <Table
//             dataSource={data.data}
//             columns={columns}
//             rowKey="id"
//             pagination={false}
//             loading={
//               isLoading ||
//               reservationNotesDelete.isPending ||
//               reservationNotesCreate.isPending
//             }
//             size="small"
//           />
//         </>
//       )}
//     </Drawer>
//   );
// };

// export default RoomAmend;
import React, { useState, useEffect } from "react";
import { Form, DatePicker, Button, Spin } from "antd";
import {
  X,
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

  const [amendType, setAmendType] = useState("reduce");
  const [newDepartureDate, setNewDepartureDate] = useState(null);
  const [nightDifference, setNightDifference] = useState(0);

  const currentStay = {
    guestName: selectedData?.guestName || "Mr. Liam Johnson Smith",
    room: selectedData?.roomName || "DBD - 1001",
    checkIn: selectedData?.checkInDate || "2026-11-11",
    checkOut: selectedData?.checkOutDate || "2026-11-13",
    totalNights: selectedData?.totalNights || 3,
  };

  const { data, isLoading } = useApiQuery({
    fetchQueryName: ["room-stay-detail", selectedData?.uuid],
    enabled: !!selectedData?.uuid,
  });

  const roomAmendMutation = useApiMutation({
    mutationFn: reservationNoteCreate,
  });

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

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-xl overflow-hidden flex flex-col font-sans">
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-gray-700 hover:bg-gray-100 p-1 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">Room Amend</h1>
          </div>
          <Button
            type="primary"
            loading={roomAmendMutation.isPending}
            onClick={() => form.submit()}
            className="bg-[#0066cc] text-white font-medium h-auto px-5 py-1.5 rounded hover:bg-[#0052a3] border-none text-sm"
          >
            Update
          </Button>
        </header>

        <Spin spinning={isLoading}>
          <main className="p-4 space-y-6">
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
                  <span className="text-sm font-medium">
                    {currentStay.room}
                  </span>
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

            <section className="space-y-2">
              <h2 className="text-base font-bold text-gray-900">
                Select Amend Type
              </h2>
              <div className="grid grid-cols-2 gap-4">
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
                  <span className="mt-2 font-semibold text-sm">
                    Extend Stay
                  </span>
                </button>

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
                  <span className="mt-2 font-semibold text-sm">
                    Reduce Stay
                  </span>
                </button>
              </div>
            </section>

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
          </main>
        </Spin>
      </div>
    </div>
  );
};

export default RoomAmend;
