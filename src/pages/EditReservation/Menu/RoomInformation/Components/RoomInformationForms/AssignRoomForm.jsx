// import React, { useEffect, useState } from "react";
// import {
//   Form,
//   Input,
//   Drawer,
//   Button,
//   Card,
//   DatePicker,
//   TimePicker,
//   Select,
// } from "antd";
// import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
// import FormButtons from "../../../../../../component/FormButtons/FormButtons";
// import GetRoomForm from "./GetRoomForm";
// import { FaSalesforce } from "react-icons/fa6";

// const { TextArea } = Input;

// const AssignRoomForm = ({
//   mode,
//   setMode,
//   open,
//   onClose,
//   selectedData,
//   onSuccess,
//   drawerOpen,
// }) => {
//   const [form] = Form.useForm();
//   const isView = mode === "view";
//   const [getRoomOpen, setGetRoomOpen] = useState(false);

//   useEffect(() => {
//     if (drawerOpen && selectedData) {
//       form.setFieldsValue({
//         ...selectedData,

//         arrivalDate: selectedData.arrivalDate
//           ? dayjs(selectedData.arrivalDate)
//           : null,
//         departureDate: selectedData.departureDate
//           ? dayjs(selectedData.departureDate)
//           : null,
//       });
//     } else if (drawerOpen && mode === "add") {
//       form.resetFields();
//     }
//   }, [selectedData, drawerOpen, form, mode]);

//   const onFinish = (values) => {
//     const formattedValues = {
//       ...values,
//       arrivalDate: getFormattedDate(values.arrivalDate, false),
//       departureDate: getFormattedDate(values.departureDate, false),
//     };

//     //  API
//     console.log("Submitted Values:", formattedValues);

//     // LocalStorage
//     const existingData = JSON.parse(localStorage.getItem("roomInfo")) || [];
//     if (mode === "add") {
//       localStorage.setItem(
//         "roomInfo",
//         JSON.stringify([
//           ...existingData,
//           { ...formattedValues, id: Date.now() },
//         ]),
//       );
//     } else {
//       const updated = existingData.map((item) =>
//         item.id === selectedData.id
//           ? { ...formattedValues, id: item.id }
//           : item,
//       );
//       localStorage.setItem("roomInfo", JSON.stringify(updated));
//     }

//     setDrawerOpen(false);
//     onSuccess();
//     form.resetFields();
//   };

//   return (
//     <>
//       <Drawer
//         open={open}
//         onClose={onClose}
//         size={650}
//         destroyOnClose
//         title={
//           <div className="flex justify-between items-center">
//             <span>Assign Room</span>
//           </div>
//         }
//       >
//         <div className="border border-gray-200 rounded px-4 py-2">
//           <Form
//             form={form}
//             layout="vertical"
//             onFinish={onFinish}
//             disabled={isView}
//             className="w-full"
//           >
//             <h1 className="text-base font-semibold mb-6 text-gray-700">
//               Assign Room
//             </h1>

//             {/* row 1 */}
//             <div className="flex items-center gap-3">
//               <div className="flex-1">
//                 <Form.Item label="Check-In Date" name="arrivalDate">
//                   <DatePicker className="w-full" />
//                 </Form.Item>
//               </div>

//               <div className="flex flex-col items-center bg-gray-200 rounded px-2 py-1 mt-[6px] min-w-[55px] min-h-[32px]">
//                 <span className="text-[10px] font-bold leading-none">6</span>
//                 <span className="text-[10px] leading-none text-gray-600">
//                   Nights
//                 </span>
//               </div>

//               <div className="flex-1">
//                 <Form.Item label="Check-Out Date" name="departureDate">
//                   <DatePicker className="w-full" />
//                 </Form.Item>
//               </div>
//             </div>

//             {/* row 2 */}
//             <div className="grid grid-cols-2 gap-6">
//               <Form.Item label="Room Type" name="roomType">
//                 <Input disabled />
//               </Form.Item>

//               <Form.Item label="Floor Type" name="floorType">
//                 <Select
//                   placeholder="Select Floor Type"
//                   options={[
//                     { value: "Garden View", label: "Garden View" },
//                     { value: "Sea View", label: "Sea View" },
//                   ]}
//                   className="w-full"
//                 />
//               </Form.Item>
//             </div>

//             <div className="flex justify-end ">
//               <Button
//                 type="primary"
//                 htmlType="submit"
//                 onClick={() => setGetRoomOpen(true)}
//               >
//                 Search
//               </Button>
//             </div>
//           </Form>
//         </div>
//       </Drawer>
//       <GetRoomForm open={getRoomOpen} onClose={() => setGetRoomOpen(false)} />
//     </>
//   );
// };

// export default AssignRoomForm;

import React, { useEffect, useState } from "react";
import { Form, Input, Drawer, Button, DatePicker, Select, Divider } from "antd";
import dayjs from "dayjs";
import GetRoomForm from "./GetRoomForm";

const AssignRoomForm = ({ mode, open, onClose, selectedData, onSuccess }) => {
  const [form] = Form.useForm();
  const isView = mode === "view";
  const [showRoomResults, setShowRoomResults] = useState(false);

  // Watch dates to calculate nights
  const arrivalDate = Form.useWatch("arrivalDate", form);
  const departureDate = Form.useWatch("departureDate", form);

  const calculateNights = () => {
    if (arrivalDate && departureDate) {
      const diff = dayjs(departureDate).diff(dayjs(arrivalDate), "day");
      return diff > 0 ? diff : 0;
    }
    return 0;
  };

  useEffect(() => {
    if (open && selectedData) {
      form.setFieldsValue({
        ...selectedData,
        arrivalDate: selectedData.arrivalDate
          ? dayjs(selectedData.arrivalDate)
          : null,
        departureDate: selectedData.departureDate
          ? dayjs(selectedData.departureDate)
          : null,
      });
      setShowRoomResults(false); // Reset search view when opening for new data
    }
  }, [selectedData, open, form]);

  const handleSelectRoom = (roomNo) => {
    // When a room is clicked in the results, update the "newRoom" status
    const values = form.getFieldsValue();
    const formattedValues = {
      ...values,
      arrivalDate: values.arrivalDate?.toISOString(),
      departureDate: values.departureDate?.toISOString(),
      newRoom: roomNo, // The actual room number from GetRoomForm
    };

    const existingData = JSON.parse(localStorage.getItem("roomInfo")) || [];
    const updated = existingData.map((item) =>
      item.id === selectedData.id ? { ...item, ...formattedValues } : item,
    );

    localStorage.setItem("roomInfo", JSON.stringify(updated));
    setShowRoomResults(false);
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={650}
      title="Assign Room"
      destroyOnClose
    >
      <div className="flex flex-col gap-6">
        <div className="border border-gray-200 rounded px-4 py-2">
          <Form form={form} layout="vertical" disabled={isView}>
            <h1 className="text-base font-semibold mb-6 text-gray-700">
              Assign Room
            </h1>

            <div className="flex items-center gap-3">
              <Form.Item
                label="Check-In Date"
                name="arrivalDate"
                className="flex-1"
              >
                <DatePicker className="w-full" format="DD/MM/YYYY" />
              </Form.Item>

              <div className="flex flex-col items-center bg-gray-200 rounded px-2 py-1 mt-[6px] min-w-[55px]">
                <span className="text-[10px] font-bold">
                  {calculateNights()}
                </span>
                <span className="text-[10px] text-gray-600">Nights</span>
              </div>

              <Form.Item
                label="Check-Out Date"
                name="departureDate"
                className="flex-1"
              >
                <DatePicker className="w-full" format="DD/MM/YYYY" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Form.Item label="Room Type" name="roomType">
                <Input disabled />
              </Form.Item>

              <Form.Item label="Floor Type" name="floorType">
                <Select
                  placeholder="Select Floor Type"
                  options={[
                    { value: "Garden View", label: "Garden View" },
                    { value: "Sea View", label: "Sea View" },
                  ]}
                />
              </Form.Item>
            </div>

            <div className="flex justify-end">
              <Button type="primary" onClick={() => setShowRoomResults(true)}>
                Search
              </Button>
            </div>
          </Form>
        </div>

        {/* This is where the results appear under the search form */}
        {showRoomResults && (
          <div className="mt-4">
            <Divider orientation="left">Available Rooms</Divider>
            <GetRoomForm onSelectRoom={handleSelectRoom} />
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default AssignRoomForm;
