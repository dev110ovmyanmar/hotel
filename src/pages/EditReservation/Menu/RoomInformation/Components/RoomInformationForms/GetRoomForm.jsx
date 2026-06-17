import React, { useState } from "react";
import { Button, Spin, Empty, Tag } from "antd";
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
  const [page] = useState(1);
  const [perPage] = useState(LIMITS.PAGE_SIZE);

  const statusColorMap = {
    Available: "text-[#389E0D] bg-[#F6FFED] text-xs p-1 px-2 rounded border border-[#B7EB8F]",
    Occupied: "text-[#0958D9] bg-[#E6F4FF] text-xs p-1 px-2 rounded border border-[#91CAFF]",
    Dirty: "text-[#D4A106] bg-[#FDFFE0] text-xs p-1 px-2 rounded border border-[#F4E34F]",
    Maintenance: "text-[#CF1322] bg-[#FFF1F0] text-xs p-1 px-2 rounded border border-[#FFA39E]",
    "Out of Order": "text-[#CF1322] bg-[#FFF1F0] text-xs p-1 px-2 rounded border border-[#FFA39E]",
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
// import React, { useState } from "react";
// import { Button, Spin, Empty, Tag } from "antd";
// import dayjs from "dayjs";
// import {
//   reservationRoomAssign,
//   reservationRoomSearch,
// } from "./../../../../../../api/reservationSectionApi";
// import { LIMITS } from "../../../../../../variables/constants";
// import useApiQuery from "../../../../../../hooks/useApiQuery";
// import { useApiMutation } from "../../../../../../hooks/useApiMutation";
// import Toast from "../../../../../../component/Toast/Toast";

// const GetRoomForm = ({ selectedData, onSelectRoom, onClose, floorUuid }) => {
//   const [page] = useState(1);
//   const [perPage] = useState(LIMITS.PAGE_SIZE);

//   // Modern semantic color configuration mapping perfectly to your Ant Design tokens
//   const statusConfig = {
//     Available: { color: "success", text: "Available" },
//     Occupied: { color: "error", text: "Occupied" },
//     Dirty: { color: "warning", text: "Dirty" },
//     Maintenance: { color: "default", text: "Maintenance" },
//     out_of_order: { color: "orange", text: "Out of Order" },
//   };

//   const { data, isLoading } = useApiQuery({
//     fetchQueryName: "reservationRoom",
//     fetchQueryFunction: reservationRoomSearch,
//     params: {
//       filter: {
//         checkinDate: selectedData?.checkinDate
//           ? dayjs(selectedData.checkinDate).format("YYYY-MM-DD")
//           : null,
//         checkoutDate: selectedData?.checkoutDate
//           ? dayjs(selectedData.checkoutDate).format("YYYY-MM-DD")
//           : null,
//       },
//       roomType: { uuid: selectedData?.roomType?.uuid },
//       floor: { uuid: floorUuid },
//       pagination: { page, perPage },
//     },
//   });

//   const assignMutation = useApiMutation({
//     mutationFn: reservationRoomAssign,
//     invalidateKeys: [["reservation-room"]],
//   });

//   const handleAssignClick = (room) => {
//     const payload = {
//       reservationRoom: { uuid: selectedData?.uuid },
//       room: { uuid: room?.uuid },
//     };

//     assignMutation.mutate(payload, {
//       onSuccess: () => {
//         Toast.success(`Room ${room.roomNo} assigned successfully!`);
//         if (onSelectRoom) onSelectRoom(room);
//         onClose();
//       },
//     });
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center p-12">
//         <Spin size="large" />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto p-1 pr-2">
//       {data?.rooms?.length > 0 ? (
//         data.rooms.map((room) => {
//           const statusName = room.status?.name;
//           const currentStatus = statusConfig[statusName] || {
//             color: "default",
//             text: statusName || "Unknown",
//           };

//           return (
//             <div
//               key={room.uuid || room.id}
//               className="flex justify-between items-center p-4 border border-gray-100 rounded-xl shadow-xs hover:border-blue-400 hover:shadow-sm transition-all duration-200 bg-white"
//             >
//               {/* Left Side: Room details */}
//               <div className="flex flex-col gap-0.5">
//                 <span className="font-semibold text-gray-900 text-sm tracking-tight">
//                   Room {room.roomNo}
//                 </span>
//                 <span className="text-[11px] text-gray-400 font-medium">
//                   {room.roomType?.name}
//                 </span>
//               </div>

//               {/* Right Side: Beautiful tags & actions aligned uniformly */}
//               <div className="flex items-center gap-8">
//                 <div className="min-w-[100px] flex justify-end">
//                   <Tag
//                     bordered={false}
//                     color={currentStatus.color}
//                     className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md m-0 text-center"
//                   >
//                     {currentStatus.text}
//                   </Tag>
//                 </div>

//                 <Button
//                   type="text"
//                   loading={assignMutation.isLoading}
//                   onClick={() => handleAssignClick(room)}
//                   className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold rounded-lg px-4 h-8 border-0 transition-all duration-150 text-xs"
//                 >
//                   Assign
//                 </Button>
//               </div>
//             </div>
//           );
//         })
//       ) : (
//         <div className="py-8">
//           <Empty description={<span className="text-gray-400 font-medium">No rooms match your search criteria</span>} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default GetRoomForm;
