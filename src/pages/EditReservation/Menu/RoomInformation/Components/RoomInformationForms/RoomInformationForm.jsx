// import React, { useEffect, useRef } from "react";
// import {
//   Form,
//   Input,
//   Select,
//   Drawer,
//   DatePicker,
//   Button,
//   InputNumber,
//   Tag,
// } from "antd";
// import dayjs from "dayjs";
// import FormButtons from "../../../../../../component/FormButtons/FormButtons";
// import { useApiMutation } from "../../../../../../hooks/useApiMutation";
// import {
//   availabilitySearch,
//   createReservationRoom,
//   reservationRoomDetails,
// } from "../../../../../../api/reservationSectionApi";
// import Toast from "../../../../../../component/Toast/Toast";
// import { FaMoon, FaSun } from "react-icons/fa";
// import { Gift } from "lucide-react";

// const { RangePicker } = DatePicker;

// const RoomInformationForm = ({
//   data,
//   mode,
//   setMode,
//   drawerOpen,
//   setDrawerOpen,
//   selectedData,
//   setSelectedData,
//   page,
//   onSuccess,
// }) => {
//   const [form] = Form.useForm();
//   const isView = mode === "view";

//   const isInitializing = useRef(false);

//   const selectedDates = Form.useWatch("dates", form);
//   const selectedRoomUuid = Form.useWatch("roomTypeUuid", form);

//   const sharedProps = {
//     mode: "spinner",
//     min: 1,
//     defaultValue: 1,
//     style: { width: 150 },
//   };

//   let totalNight = 0;
//   if (selectedDates && selectedDates[0] && selectedDates[1]) {
//     const diff = selectedDates[1].diff(selectedDates[0], "day");
//     totalNight = diff > 0 ? diff : 0;
//   }

//   const roomAvailabilitySearchs = useApiMutation({
//     mutationFn: availabilitySearch,
//     invalidateKeys: [["availability-search"]],
//   });

//   const createReservationRooms = useApiMutation({
//     mutationFn: createReservationRoom,
//   });

//   const reservationRoomsDetails = useApiMutation({
//     mutationFn: reservationRoomDetails,
//   });

//   const availableRoomsData = roomAvailabilitySearchs.data?.rooms || [];

//   useEffect(() => {
//     if (drawerOpen && isView && selectedData?.uuid) {
//       reservationRoomsDetails.mutate({ uuid: selectedData.uuid });
//     }
//   }, [drawerOpen, isView, selectedData]);

//   useEffect(() => {
//     if (isView && reservationRoomsDetails.data) {
//       const viewData = reservationRoomsDetails.data;
//       form.setFieldsValue({
//         dates: [
//           viewData?.checkinDate ? dayjs(viewData.checkinDate) : null,
//           viewData?.checkoutDate ? dayjs(viewData.checkoutDate) : null,
//         ],
//         roomTypeUuid: viewData?.roomType?.uuid || null,
//         ratePlanId: viewData?.ratePlan?.id || null,
//         totalRooms: viewData?.totalRooms || 1,
//       });
//     }
//   }, [isView, reservationRoomsDetails.data, form]);

//   useEffect(() => {
//     if (drawerOpen && data && !isView) {
//       isInitializing.current = true;

//       const today = dayjs();
//       const Day = today.format("YYYY-MM-DD");

//       const checkinDateObj = data?.actualCheckin
//         ? dayjs(data?.actualCheckin)
//         : null;
//       let finalCheckin = null;

//       if (checkinDateObj) {
//         if (checkinDateObj.isBefore(today, "day")) {
//           finalCheckin = Day;
//         } else {
//           finalCheckin = checkinDateObj.format("YYYY-MM-DD");
//         }
//       }

//       const checkoutDateObj = data?.actualCheckout
//         ? dayjs(data?.actualCheckout)
//         : null;
//       let finalCheckout = null;

//       if (checkoutDateObj) {
//         if (checkoutDateObj.isBefore(today, "day")) {
//           finalCheckout = Day;
//         } else {
//           finalCheckout = checkoutDateObj.format("YYYY-MM-DD");
//         }
//       }

//       form.setFieldsValue({
//         dates: [
//           finalCheckin ? dayjs(finalCheckin) : null,
//           finalCheckout ? dayjs(finalCheckout) : null,
//         ],
//         roomTypeUuid: data?.roomType?.uuid || null,
//         ratePlanId: data?.roomRate?.id || null,
//         totalRooms: 1,
//       });

//       setTimeout(() => {
//         isInitializing.current = false;
//       }, 100);
//     }
//   }, [drawerOpen, data, form, isView]);

//   useEffect(() => {
//     if (drawerOpen && !isView && selectedDates?.[0] && selectedDates?.[1]) {
//       if (!isInitializing.current) {
//         form.setFieldsValue({
//           roomTypeUuid: null,
//           ratePlanId: null,
//           totalRooms: 1,
//         });
//       }

//       const checkin = selectedDates[0].format("YYYY-MM-DD");
//       const checkout = selectedDates[1].format("YYYY-MM-DD");

//       const diffNights = selectedDates[1].diff(selectedDates[0], "day");
//       const payloadTotalNight = diffNights > 0 ? diffNights : 0;

//       const payload = {
//         filter: {
//           checkinDate: checkin,
//           checkoutDate: checkout,
//         },
//         bookedVia: { uuid: data?.bookedVia?.uuid },
//         sourceType: { uuid: data?.sourceType?.uuid },
//         source: { uuid: data?.source?.uuid },
//         totalNight: payloadTotalNight,
//         reservation: { uuid: data?.uuid },
//       };

//       roomAvailabilitySearchs.mutate(payload);
//     }
//   }, [drawerOpen, selectedDates, data, isView]);

//   const disabledDate = (current) => {
//     if (!current || !data) return false;

//     const today = dayjs().startOf("day");

//     let arrivalLimit = data.actualCheckin
//       ? dayjs(data.actualCheckin).startOf("day")
//       : today;
//     if (arrivalLimit.isBefore(today, "day")) {
//       arrivalLimit = today;
//     }

//     const isBeforeArrival = current.isBefore(arrivalLimit, "day");
//     return isBeforeArrival;
//   };

//   const roomTypeOptions =
//     isView && reservationRoomsDetails.data
//       ? [
//           {
//             label: reservationRoomsDetails.data?.roomType?.name,
//             value: reservationRoomsDetails.data?.roomType?.uuid,
//           },
//         ]
//       : availableRoomsData.map((item) => ({
//           label: `${item.roomType?.name} (${item.totalRooms} available)`,
//           value: item.roomType?.uuid,
//         }));

//   const targetRoomDetails = availableRoomsData.find(
//     (item) => item.roomType?.uuid === selectedRoomUuid,
//   );

//   const ratePlanOptions =
//     isView && reservationRoomsDetails.data
//       ? [
//           {
//             label:
//               reservationRoomsDetails.data?.ratePlan?.name || "Selected Plan",
//             value: reservationRoomsDetails.data?.ratePlan?.id,
//           },
//         ]
//       : targetRoomDetails?.ratePlans
//         ? targetRoomDetails.ratePlans.map((rate) => ({
//             label: `${rate.name}`,
//             value: rate.id,
//           }))
//         : [];

//   const handleRoomTypeChange = () => {
//     form.setFieldsValue({ ratePlanId: null, totalRooms: 1 });
//   };

//   const handleClose = () => {
//     setDrawerOpen(false);
//     setSelectedData(null);
//     form.resetFields();
//   };

//   const onFinish = (values) => {
//     const [checkin, checkout] = values.dates || [];

//     const formattedPayload = {
//       filter: {
//         checkinDate: checkin ? checkin.format("YYYY-MM-DD") : null,
//         checkoutDate: checkout ? checkout.format("YYYY-MM-DD") : null,
//       },
//       reservation: { uuid: data?.uuid },
//       totalNight: totalNight,
//       rooms: [
//         {
//           roomType: {
//             uuid: values.roomTypeUuid,
//           },
//           ratePlans: [
//             {
//               id: values.ratePlanId,
//               totalRooms: values.totalRooms,
//             },
//           ],
//         },
//       ],
//     };

//     createReservationRooms.mutate(formattedPayload, {
//       onSuccess: () => {
//         form.resetFields();
//         handleClose();
//         if (onSuccess) onSuccess();
//         Toast.success("Room Created Successfully!");
//       },
//     });
//   };

//   const maxAvailableRooms = targetRoomDetails?.totalRooms ?? 10;

//   const STATUS_CONFIG = {
//     Confirmed: {
//       tagColor: "success",
//     },
//     Pending: {
//       tagColor: "warning",
//     },
//     Cancelled: {
//       tagColor: "error",
//     },
//     "Checked Out": {
//       tagColor: "error",
//     },
//     "Checked In": {
//       tagColor: "success",
//     },
//     default: {
//       tagColor: "default",
//     },
//   };

//   return (
//     <Drawer
//       open={drawerOpen}
//       onClose={handleClose}
//       width={650}
//       title={
//         <div className="flex justify-between items-center">
//           <span className="font-semibold text-lg text-slate-800">
//             {mode === "view"
//               ? "Room Information Details"
//               : "Create Room Information"}
//           </span>

//           {isView ? (
//             <Button className="custom-blue-btn" onClick={handleClose}>
//               Close
//             </Button>
//           ) : (
//             <FormButtons
//               onClick={() => form.submit()}
//               mode={mode}
//               isPending={createReservationRooms.isPending}
//             />
//           )}
//         </div>
//       }
//     >
//       {isView ? (
//         <div className="space-y-6">
//           {(() => {
//             const currentStatus =
//               reservationRoomsDetails.data?.roomStatus?.name;
//             const statusStyle =
//               STATUS_CONFIG[currentStatus] || STATUS_CONFIG.default;
//             const d = reservationRoomsDetails.data;

//             return (
//               <>
//                 <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden w-full max-w-xl">
//                   <div className="relative grid grid-cols-2 gap-2 px-6 py-2 bg-gradient-to-r from-slate-50 to-white">
//                     <div>
//                       <span className="flex items-center gap-2 text-[11px] font-semibold text-amber-600 uppercase tracking-wider">
//                         <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
//                         Check-In
//                       </span>

//                       <div className="text-slate-900 font-bold text-lg">
//                         {d?.checkinDate
//                           ? dayjs(d.checkinDate).format("DD MMM YYYY")
//                           : "--"}
//                       </div>

//                       <div className="text-slate-400 text-xs">
//                         {d?.checkinDate
//                           ? dayjs(d.checkinDate).format("dddd")
//                           : "—"}
//                       </div>
//                     </div>

//                     <div className="text-right">
//                       <span className="flex items-center justify-end gap-2 text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
//                         Check-Out
//                         <span className="w-2 h-2 rounded-full bg-indigo-500" />
//                       </span>

//                       <div className="text-slate-900 font-bold text-lg">
//                         {d?.checkoutDate
//                           ? dayjs(d.checkoutDate).format("DD MMM YYYY")
//                           : "--"}
//                       </div>

//                       <div className="text-slate-400 text-xs">
//                         {d?.checkoutDate
//                           ? dayjs(d.checkoutDate).format("dddd")
//                           : "—"}
//                       </div>
//                     </div>

//                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                       <div className="w-16 border-t border-line border-slate-300" />
//                     </div>
//                   </div>

//                   <div className="border-t border-slate-100" />

//                   <div className="px-6 py-2 space-y-2">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <div className=" font-bold text-slate-800">
//                           {d?.room === null ? (
//                             <span className="text-amber-600 text-sm  bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
//                               Assign Room
//                             </span>
//                           ) : (
//                             `Room : ${d?.room?.roomNo}`
//                           )}
//                         </div>
//                       </div>

//                       <Tag
//                         color={statusStyle.tagColor}
//                         className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusStyle.bg}`}
//                       >
//                         {currentStatus}
//                       </Tag>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4 ">
//                       <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
//                         <span className="text-xs text-slate-400 font-medium">
//                           Room Type
//                         </span>
//                         <div className="text-sm font-semibold text-slate-700 mt-1">
//                           {d?.roomType?.name || "—"}
//                         </div>
//                       </div>

//                       <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
//                         <span className="text-xs text-slate-400 font-medium">
//                           Rate Plan
//                         </span>
//                         <div className="text-sm font-semibold text-slate-700 mt-1">
//                           {d?.ratePlan?.name || "—"}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             );
//           })()}

//           <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
//             <h3 className="font-semibold text-base text-slate-800 mb-4">
//               Payment Summary
//             </h3>

//             {(() => {
//               const d = reservationRoomsDetails.data;

//               return (
//                 <div className="space-y-3 text-sm">
//                   <div className="flex justify-between text-slate-600">
//                     <span>Adults</span>
//                     <span className="font-medium">{d?.adults || 0} Guests</span>
//                   </div>
//                   <div className="flex justify-between text-slate-600">
//                     <span>Nights</span>
//                     <span className="font-medium">
//                       {d?.totalNight} {d?.totalNight === 1 ? "Night" : "Nights"}
//                     </span>
//                   </div>

//                   <div className="border-t my-2" />

//                   <div className="flex justify-between text-slate-600">
//                     <span>Sub Total</span>
//                     <span>{(d?.subTotal || 0).toLocaleString()} MMK</span>
//                   </div>

//                   <div className="flex justify-between text-slate-600">
//                     <span>Tax ({d?.taxPercentage || 0}%)</span>
//                     <span>{(d?.taxTotal || 0).toLocaleString()} MMK</span>
//                   </div>

//                   <div className="flex justify-between text-slate-600">
//                     <span>Service Charge</span>
//                     <span>
//                       {(d?.serviceChargeTotal || 0).toLocaleString()} MMK
//                     </span>
//                   </div>

//                   <div className="flex justify-between text-slate-600">
//                     <span>Discount</span>
//                     <span className="text-rose-500 font-medium">
//                       - {(d?.discountTotal || 0).toLocaleString()} MMK
//                     </span>
//                   </div>

//                   <div className="border-t my-2" />

//                   <div className="flex justify-between text-base font-semibold text-slate-900">
//                     <span>Grand Total</span>
//                     <span className="text-indigo-600 text-lg">
//                       {(d?.grandTotal || 0).toLocaleString()} MMK
//                     </span>
//                   </div>

//                   {d?.isComplimentary && (
//                     <div className="mt-3">
//                       <Tag color="purple">
//                         Complimentary ({d?.complimentaryStatus?.name})
//                       </Tag>
//                     </div>
//                   )}
//                 </div>
//               );
//             })()}
//           </div>

//           <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
//             <h3 className="font-semibold text-base text-slate-800 mb-4">
//               Daily Breakdown
//             </h3>
//             <div className="overflow-hidden rounded-xl border border-slate-100 shadow-sm">
//               <table className="w-full text-sm">
//                 <thead className="bg-slate-50 text-slate-600 font-medium border-b">
//                   <tr>
//                     <th className="p-3 text-left">Date</th>
//                     <th className="p-3 text-left">Extra</th>
//                     <th className="p-3 text-right">Total</th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-100 text-slate-700">
//                   {reservationRoomsDetails.data?.reservationRoomRates?.map(
//                     (r) => (
//                       <tr
//                         key={r.uuid}
//                         className="hover:bg-slate-50/80 transition"
//                       >
//                         <td className="p-3 font-medium">
//                           {dayjs(r.date).format("DD-MM-YYYY")}
//                         </td>

//                         <td className="p-3 text-xs">
//                           {r?.reservationRoomExtras?.length > 0 ? (
//                             r.reservationRoomExtras.map((extra) => {
//                               const quantity = extra.quantity
//                                 ? `${extra.quantity}`
//                                 : "";
//                               const price = extra.grandTotal
//                                 ? ` (${extra.grandTotal.toLocaleString()} MMK)`
//                                 : "";

//                               return (
//                                 <div
//                                   key={extra.uuid}
//                                   className="mb-1 last:mb-0"
//                                 >
//                                   {extra.extraType === "baby_cot" &&
//                                     `Baby Cot: ${quantity}${price}`}
//                                   {extra.extraType === "extra_bed" &&
//                                     `Extra Bed: ${quantity}${price}`}
//                                   {extra.extraType === "extra_person" &&
//                                     `Extra Person: ${quantity}${price}`}
//                                 </div>
//                               );
//                             })
//                           ) : (
//                             <span>—</span>
//                           )}
//                         </td>

//                         <td className="p-3 text-right font-semibold text-slate-800">
//                           <div className="flex items-center justify-end gap-1">
//                             {r.isComplimentary && (
//                               <span
//                                 title="Complimentary"
//                                 className="cursor-pointer flex items-center"
//                               >
//                                 <Gift className="w-4 h-4 text-emerald-600" />
//                               </span>
//                             )}

//                             <span>
//                               {(() => {
//                                 const extrasTotal =
//                                   r?.reservationRoomExtras?.reduce(
//                                     (sum, extra) =>
//                                       sum + (extra.grandTotal || 0),
//                                     0,
//                                   ) || 0;

//                                 const total =
//                                   (r.grandTotal || 0) +
//                                   (r.tax || 0) +
//                                   extrasTotal;

//                                 return `${total.toLocaleString()} MMK`;
//                               })()}
//                             </span>
//                           </div>
//                         </td>
//                       </tr>
//                     ),
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <Form
//           form={form}
//           layout="vertical"
//           onFinish={onFinish}
//           disabled={isView}
//         >
//           <div className="flex items-end gap-6 w-full ">
//             <Form.Item
//               label="Stay Duration (Arrival - Departure)"
//               name="dates"
//               className="w-3/4 mb-0"
//               rules={[
//                 { required: true, message: "Please pick duration dates" },
//               ]}
//             >
//               <RangePicker
//                 className="w-full"
//                 format="YYYY-MM-DD"
//                 disabledDate={disabledDate}
//               />
//             </Form.Item>

//             <Form.Item className="w-1/5 mb-0 bg-gray-200 rounded">
//               <div className="flex items-center gap-2 px-2 py-1.5 ml-3">
//                 <FaMoon className="text-xs" />
//                 <span className="text-xs font-bold whitespace-nowrap">
//                   {`${totalNight} ${totalNight === 1 ? "Night" : "Nights"}`}
//                 </span>
//               </div>
//             </Form.Item>
//           </div>

//           <div className="grid grid-cols-2 gap-6">
//             <Form.Item
//               label="Room Type"
//               name="roomTypeUuid"
//               rules={[{ required: true, message: "Please select a room type" }]}
//             >
//               <Select
//                 placeholder="Select Room Type"
//                 options={roomTypeOptions}
//                 onChange={handleRoomTypeChange}
//                 loading={
//                   roomAvailabilitySearchs.isPending ||
//                   reservationRoomsDetails.isPending
//                 }
//               />
//             </Form.Item>

//             <Form.Item
//               label="Rate Plan"
//               name="ratePlanId"
//               rules={[{ required: true, message: "Please select a room rate" }]}
//             >
//               <Select
//                 placeholder={
//                   selectedRoomUuid
//                     ? "Select Room Rate Plan"
//                     : "Choose Room Type First"
//                 }
//                 options={ratePlanOptions}
//                 disabled={!selectedRoomUuid || isView}
//               />
//             </Form.Item>
//           </div>

//           <div className="grid grid-cols-2 gap-6">
//             <Form.Item
//               label="Total Room"
//               name="totalRooms"
//               rules={[
//                 { required: true, message: "Please input total rooms" },
//                 ...(!isView
//                   ? [
//                       {
//                         type: "number",
//                         max: maxAvailableRooms,
//                         message: `Cannot exceed available rooms (${maxAvailableRooms})`,
//                       },
//                     ]
//                   : []),
//               ]}
//             >
//               <InputNumber
//                 {...sharedProps}
//                 min={1}
//                 max={isView ? undefined : maxAvailableRooms}
//                 placeholder="Quantity"
//                 readOnly={isView}
//                 style={{ width: "100%" }}
//                 disabled={!selectedRoomUuid || isView}
//               />
//             </Form.Item>
//           </div>
//         </Form>
//       )}
//     </Drawer>
//   );
// };

// export default RoomInformationForm;
import React, { useEffect, useRef } from "react";
import { Form, Select, Drawer, DatePicker, InputNumber } from "antd";
import dayjs from "dayjs";
import { FaMoon } from "react-icons/fa";
import FormButtons from "../../../../../../component/FormButtons/FormButtons";
import { useApiMutation } from "../../../../../../hooks/useApiMutation";
import { availabilitySearch, createReservationRoom } from "../../../../../../api/reservationSectionApi";
import Toast from "../../../../../../component/Toast/Toast";

const { RangePicker } = DatePicker;

const RoomInformationForm = ({
  data,
  mode,
  drawerOpen,
  setDrawerOpen,
  setSelectedData,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const isInitializing = useRef(false);

  const selectedDates = Form.useWatch("dates", form);
  const selectedRoomUuid = Form.useWatch("roomTypeUuid", form);

  let totalNight = 0;
  if (selectedDates && selectedDates[0] && selectedDates[1]) {
    const diff = selectedDates[1].diff(selectedDates[0], "day");
    totalNight = diff > 0 ? diff : 0;
  }

  const roomAvailabilitySearchs = useApiMutation({
    mutationFn: availabilitySearch,
    invalidateKeys: [["availability-search"]],
  });

  const createReservationRooms = useApiMutation({
    mutationFn: createReservationRoom,
  });

  const availableRoomsData = roomAvailabilitySearchs.data?.rooms || [];

  // Initialize form fields with incoming basic parent data
  useEffect(() => {
    if (drawerOpen && data) {
      isInitializing.current = true;

      const today = dayjs();
      const Day = today.format("YYYY-MM-DD");

      const checkinDateObj = data?.actualCheckin ? dayjs(data?.actualCheckin) : null;
      let finalCheckin = null;

      if (checkinDateObj) {
        finalCheckin = checkinDateObj.isBefore(today, "day") ? Day : checkinDateObj.format("YYYY-MM-DD");
      }

      const checkoutDateObj = data?.actualCheckout ? dayjs(data?.actualCheckout) : null;
      let finalCheckout = null;

      if (checkoutDateObj) {
        finalCheckout = checkoutDateObj.isBefore(today, "day") ? Day : checkoutDateObj.format("YYYY-MM-DD");
      }

      form.setFieldsValue({
        dates: [
          finalCheckin ? dayjs(finalCheckin) : null,
          finalCheckout ? dayjs(finalCheckout) : null,
        ],
        roomTypeUuid: data?.roomType?.uuid || null,
        ratePlanId: data?.roomRate?.id || null,
        totalRooms: 1,
      });

      setTimeout(() => {
        isInitializing.current = false;
      }, 100);
    }
  }, [drawerOpen, data, form]);

  // Fetch live availability options when dates are ready
  useEffect(() => {
    if (drawerOpen && selectedDates?.[0] && selectedDates?.[1]) {
      if (!isInitializing.current) {
        form.setFieldsValue({
          roomTypeUuid: null,
          ratePlanId: null,
          totalRooms: 1,
        });
      }

      const checkin = selectedDates[0].format("YYYY-MM-DD");
      const checkout = selectedDates[1].format("YYYY-MM-DD");
      const diffNights = selectedDates[1].diff(selectedDates[0], "day");

      const payload = {
        filter: { checkinDate: checkin, checkoutDate: checkout },
        bookedVia: { uuid: data?.bookedVia?.uuid },
        sourceType: { uuid: data?.sourceType?.uuid },
        source: { uuid: data?.source?.uuid },
        totalNight: diffNights > 0 ? diffNights : 0,
        reservation: { uuid: data?.uuid },
      };

      roomAvailabilitySearchs.mutate(payload);
    }
  }, [drawerOpen, selectedDates, data]);

  const disabledDate = (current) => {
    if (!current || !data) return false;
    const today = dayjs().startOf("day");
    let arrivalLimit = data.actualCheckin ? dayjs(data.actualCheckin).startOf("day") : today;
    if (arrivalLimit.isBefore(today, "day")) {
      arrivalLimit = today;
    }
    return current.isBefore(arrivalLimit, "day");
  };

  const roomTypeOptions = availableRoomsData.map((item) => ({
    label: `${item.roomType?.name} (${item.totalRooms} available)`,
    value: item.roomType?.uuid,
  }));

  const targetRoomDetails = availableRoomsData.find((item) => item.roomType?.uuid === selectedRoomUuid);
  const maxAvailableRooms = targetRoomDetails?.totalRooms ?? 10;

  const ratePlanOptions = targetRoomDetails?.ratePlans
    ? targetRoomDetails.ratePlans.map((rate) => ({
        label: `${rate.name}`,
        value: rate.id,
      }))
    : [];

  const handleRoomTypeChange = () => {
    form.setFieldsValue({ ratePlanId: null, totalRooms: 1 });
  };

  const handleClose = () => {
    setDrawerOpen(false);
    if (setSelectedData) setSelectedData(null);
    form.resetFields();
  };

  const onFinish = (values) => {
    const [checkin, checkout] = values.dates || [];

    const formattedPayload = {
      filter: {
        checkinDate: checkin ? checkin.format("YYYY-MM-DD") : null,
        checkoutDate: checkout ? checkout.format("YYYY-MM-DD") : null,
      },
      reservation: { uuid: data?.uuid },
      totalNight: totalNight,
      rooms: [
        {
          roomType: { uuid: values.roomTypeUuid },
          ratePlans: [{ id: values.ratePlanId, totalRooms: values.totalRooms }],
        },
      ],
    };

    createReservationRooms.mutate(formattedPayload, {
      onSuccess: () => {
        form.resetFields();
        handleClose();
        if (onSuccess) onSuccess();
        Toast.success("Room Created Successfully!");
      },
    });
  };

  return (
    <Drawer
      open={drawerOpen}
      onClose={handleClose}
      width={650}
      title={
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg text-slate-800">Create Room Information</span>
          <FormButtons onClick={() => form.submit()} mode={mode} isPending={createReservationRooms.isPending} />
        </div>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="flex items-end gap-6 w-full mb-6">
          <Form.Item
            label="Stay Duration (Arrival - Departure)"
            name="dates"
            className="w-3/4 mb-0"
            rules={[{ required: true, message: "Please pick duration dates" }]}
          >
            <RangePicker className="w-full" format="YYYY-MM-DD" disabledDate={disabledDate} />
          </Form.Item>

          <Form.Item className="w-1/5 mb-0 bg-gray-200 rounded">
            <div className="flex items-center gap-2 px-2 py-1.5 ml-3">
              <FaMoon className="text-xs" />
              <span className="text-xs font-bold whitespace-nowrap">
                {`${totalNight} ${totalNight === 1 ? "Night" : "Nights"}`}
              </span>
            </div>
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Form.Item
            label="Room Type"
            name="roomTypeUuid"
            rules={[{ required: true, message: "Please select a room type" }]}
          >
            <Select
              placeholder="Select Room Type"
              options={roomTypeOptions}
              onChange={handleRoomTypeChange}
              loading={roomAvailabilitySearchs.isPending}
            />
          </Form.Item>

          <Form.Item
            label="Rate Plan"
            name="ratePlanId"
            rules={[{ required: true, message: "Please select a room rate" }]}
          >
            <Select
              placeholder={selectedRoomUuid ? "Select Room Rate Plan" : "Choose Room Type First"}
              options={ratePlanOptions}
              disabled={!selectedRoomUuid}
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Form.Item
            label="Total Room"
            name="totalRooms"
            rules={[
              { required: true, message: "Please input total rooms" },
              {
                type: "number",
                max: maxAvailableRooms,
                message: `Cannot exceed available rooms (${maxAvailableRooms})`,
              },
            ]}
          >
            <InputNumber
              mode="spinner"
              min={1}
              max={maxAvailableRooms}
              placeholder="Quantity"
              style={{ width: "100%" }}
              disabled={!selectedRoomUuid}
            />
          </Form.Item>
        </div>
      </Form>
    </Drawer>
  );
};

export default RoomInformationForm;