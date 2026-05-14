// import React from "react";
// import {
//   Drawer,
//   Form,
//   Input,
//   DatePicker,
//   InputNumber,
//   Button,
//   Space,
//   Radio,
//   Tag,
// } from "antd";
// import FormButtons from "../../../../component/FormButtons/FormButtons";

// const ChangeStatusForm = ({ reservationDetails,open, onClose, reservationId }) => {
//   console.log("status-data", reservationDetails);
//   const [form] = Form.useForm();

//   const onFinish = (values) => {
//     console.log("Change Status Data:", {
//       reservationId,
//       ...values,
//     });

//     onClose();
//     form.resetFields();
//   };

//   return (
//     <Drawer
//       open={open}
//       onClose={onClose}
//       size={500}
//       destroyOnClose
//       title={
//         <div className="flex justify-between items-center">
//           <span>Change Status</span>
//           <FormButtons onClick={() => form.submit()} />
//         </div>
//       }
//     >
//       <Form layout="vertical" form={form} onFinish={onFinish}>
//         <Form.Item
//           label={
//             <span className="font-bold text-md">Current Booking Status</span>
//           }
//           name="currentBookingStatus"
//         >
//           <div className="py-1">
//             <Tag color="green" className="font-semibold  px-5  py-5   text-sm">
//               {reservationDetails?.reservationStatus?.name}
//             </Tag>
//           </div>
//         </Form.Item>

//         <Form.Item
//           label={
//             <span className="font-bold text-md">Change Booking Status To</span>
//           }
//           name="changeBookingStatusTo"
//         >
//           <Radio.Group>
//             <Space direction="vertical" className="w-full">
//               <Radio value="checked_in">Booked</Radio>
//               <Radio value="cancelled">Cancelled</Radio>
//               <Radio value="confirmed">Confirmed</Radio>
//             </Space>
//           </Radio.Group>
//         </Form.Item>
//       </Form>
//     </Drawer>
//   );
// };

// export default ChangeStatusForm;

import React, { useMemo, useEffect } from "react";
import { Drawer, Form, Space, Radio, Tag } from "antd";
import FormButtons from "../../../../component/FormButtons/FormButtons";
import { queryClient } from "../../../../app/queryClient";
import { useApiMutation } from "../../../../hooks/useApiMutation";
import Toast from "../../../../component/Toast/Toast";
import { updateReservationStatus } from "../../../../api/reservationSectionApi";

const STATUS_FLOW = {
  pending: ["booked", "cancelled"],
  booked: ["confirmed", "cancelled"],
  confirmed: ["checked_in", "cancelled", "no_show"],
  checked_in: ["checked_out"],
};

const ChangeStatusForm = ({
  reservationDetails,
  open,
  onClose,
  reservationId,
}) => {
  const [form] = Form.useForm();

  const initData = queryClient.getQueryData(["initData", "authenticated"]);

  //Normalize status list
  const reservationStatus = useMemo(() => {
    return (
      initData?.statuses?.reservation_status?.map((status) => ({
        code: status.code,
        uuid: status.uuid,
        label: status.name,
      })) || []
    );
  }, [initData]);

  //Current status
  const currentStatus =
    reservationDetails?.reservation?.reservationStatus?.code;

  //Allowed next codes
  const nextStatusCodes = STATUS_FLOW[currentStatus] || [];

  //Filter next statuses
  const nextStatuses = useMemo(() => {
    return reservationStatus.filter((status) =>
      nextStatusCodes.includes(status.code),
    );
  }, [reservationStatus, nextStatusCodes]);

  //Mutation api call
  const updateReservationStatusMutation = useApiMutation({
    mutationFn: updateReservationStatus,
    invalidateKeys: [["reservation-details"]],
  });

  //Reset form when drawer closes
  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  //Submit handler
  const onFinish = (values) => {
    const payload = {
      uuid: reservationDetails?.reservation?.uuid,
      reservationStatus: {
        uuid: values.changeBookingStatusTo,
      },
    };

    updateReservationStatusMutation.mutate(payload, {
      onSuccess: () => {
        Toast.success("Reservation Status Updated Successfully!");
        onClose();
      },
      onError: (error) => {
        console.error("Change status failed:", error);
      },
    });
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size={500}
      destroyOnClose
      title={
        <div className="flex justify-between items-center">
          <span>Change Status</span>
          <FormButtons onClick={() => form.submit()} />
        </div>
      }
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        {/* Current Status */}
        <Form.Item
          label={
            <span className="font-bold text-md">Current Booking Status</span>
          }
          name="currentBookingStatus"
        >
          <div className="py-1">
            <Tag color="green" className="font-semibold px-5 py-5 text-sm">
              {reservationDetails?.reservation?.reservationStatus?.name}
            </Tag>
          </div>
        </Form.Item>

        {/* Change Status */}
        <Form.Item
          label={
            <span className="font-bold text-md">Change Booking Status To</span>
          }
          name="changeBookingStatusTo"
          rules={[{ required: true, message: "Please select status" }]}
        >
          <Radio.Group>
            <Space direction="vertical" className="w-full">
              {nextStatuses.map((status) => (
                <Radio key={status.uuid} value={status.uuid}>
                  {status.label}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ChangeStatusForm;
