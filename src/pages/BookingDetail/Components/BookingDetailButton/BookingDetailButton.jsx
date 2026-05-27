import { PlusOutlined } from "@ant-design/icons";
import { IoPrintOutline } from "react-icons/io5";
import React, { useState } from "react";
import { Button, Drawer, Form, Select } from "antd";
import AmendBookingForm from "../BookingDetailForms/AmendBookingForm";
import ChangeStatusForm from "../BookingDetailForms/ChangeStatusForm";
import OvertimeChargeForm from "../BookingDetailForms/OvertimeChargeForm";
import AddReundForm from "../BookingDetailForms/AddRefundForm";
import RoomMoveForm from "../BookingDetailForms/RoomMoveForm";
import AmendStayForm from "../BookingDetailForms/AmendStayForm";
import AddPaymentForm from "../BookingDetailForms/AddPaymentForm";
import {
  button_config,
  status_actions,
} from "./../../../../component/BookingActions/BookingActions";

const BookingDetailButton = ({ data }) => {
  const reservation = data?.reservation;
  const status = reservation?.reservationStatus?.code?.toUpperCase();
  const actions = status_actions[status] || [];

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [amendOpen, setAmendOpen] = useState(false);
  const [overtimeOpen, setOvertimeOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [roomMoveOpen, setRoomMoveOpen] = useState(false);
  const [amendStayOpen, setAmendStayOpen] = useState(false);
  const [addPaymentOpen, setAddPaymentOpen] = useState(false);

  const handleAction = (key) => {
    switch (key) {
      case "changeStatus":
        setOpen(true);
        break;

      case "amendBooking":
        setAmendOpen(true);
        break;

      case "addPayment":
        setAddPaymentOpen(true);
        break;

      case "addRefund":
        setRefundOpen(true);
        break;

      case "overtimeCharges":
        setOvertimeOpen(true);
        break;

      case "roomMove":
        setRoomMoveOpen(true);
        break;

      case "printInvoice":
        setOpen.print();
        break;
    }
  };

  return (
    <div>
      <div className="text-sm mb-6 mt-1.5">
        Reservation id:
        <strong className="text-[#286399] ">
          {" "}
          {reservation?.reservationNo}
        </strong>
      </div>

      <div className="flex gap-2">
        {actions.map((key) => {
          const btn = button_config[key];
          if (!btn) return null;

          return (
            <Button
              key={key}
              className="custom-blue-btn"
              icon={btn.icon || null}
              onClick={() => handleAction(key)}
            >
              {btn.label}
            </Button>
          );
        })}
      </div>

      <ChangeStatusForm
        open={open}
        onClose={() => setOpen(false)}
        reservationId={data?.reservationNo}
        reservationDetails={data}
      />

      <AmendBookingForm
        open={amendOpen}
        onClose={() => setAmendOpen(false)}
        reservationId={data?.reservationNo}
      />

      <AddPaymentForm
        open={addPaymentOpen}
        onClose={() => setAddPaymentOpen(false)}
        reservationId={data?.reservationNo}
      />

      <AddReundForm
        open={refundOpen}
        onClose={() => setRefundOpen(false)}
        reservationId={data?.reservationNo}
      />

      <AmendStayForm
        open={amendStayOpen}
        onClose={() => setAmendStayOpen(false)}
        reservationId={data?.reservationNo}
      />

      <OvertimeChargeForm
        open={overtimeOpen}
        onClose={() => setOvertimeOpen(false)}
        reservationId={data?.reservationNo}
      />

      <RoomMoveForm
        open={roomMoveOpen}
        onClose={() => setRoomMoveOpen(false)}
        reservationId={data?.reservationNo}
      />
    </div>
  );
};

export default BookingDetailButton;
