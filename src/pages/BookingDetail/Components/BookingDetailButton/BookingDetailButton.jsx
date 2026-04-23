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

const BookingDetailButton = ({ reservationId }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [amendOpen, setAmendOpen] = useState(false);
  const [overtimeOpen, setOvertimeOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [roomMoveOpen, setRoomMoveOpen] = useState(false);
  const [amendStayOpen, setAmendStayOpen] = useState(false);
  const [addPaymentOpen, setAddPaymentOpen] = useState(false);

  const handleSubmit = (values) => {
    console.log("Status update:", values);
    setOpen(false);
  };

  return (
    <div>
      <div className="text-sm mb-2 mt-1.5">
        Reservation id: {reservationId}
      </div>

      <div className="flex flex-row gap-2 items-center w-full">
        <Button onClick={() => setOpen(true)} className="custom-blue-btn">
          Change Status
        </Button>

        <Button onClick={() => setAmendOpen(true)} className="custom-blue-btn">
          Amend Booking
        </Button>

        <Button
          onClick={() => setAddPaymentOpen(true)}
          className="custom-blue-btn"
        >
          Add Payment <PlusOutlined />
        </Button>

        <Button onClick={() => setRefundOpen(true)} className="custom-blue-btn">
          Add Refund <PlusOutlined />
        </Button>

        <Button
          onClick={() => setAmendStayOpen(true)}
          className="custom-blue-btn"
        >
          Amend Stay
        </Button>

        <Button
          onClick={() => setOvertimeOpen(true)}
          className="custom-blue-btn"
        >
          Overtime Charges
        </Button>

        <Button
          onClick={() => setRoomMoveOpen(true)}
          className="custom-blue-btn"
        >
          Room Move
        </Button>
        <Button className="custom-blue-btn" icon={<IoPrintOutline />}>
          Print Invoice
        </Button>
      </div>

      <ChangeStatusForm
        open={open}
        onClose={() => setOpen(false)}
        reservationId={reservationId}
      />

      <AmendBookingForm
        open={amendOpen}
        onClose={() => setAmendOpen(false)}
        reservationId={reservationId}
      />

      <AddPaymentForm
        open={addPaymentOpen}
        onClose={() => setAddPaymentOpen(false)}
        reservationId={reservationId}
      />

      <AddReundForm
        open={refundOpen}
        onClose={() => setRefundOpen(false)}
        reservationId={reservationId}
      />

      <AmendStayForm
        open={amendStayOpen}
        onClose={() => setAmendStayOpen(false)}
        reservationId={reservationId}
      />

      <OvertimeChargeForm
        open={overtimeOpen}
        onClose={() => setOvertimeOpen(false)}
        reservationId={reservationId}
      />

      <RoomMoveForm
        open={roomMoveOpen}
        onClose={() => setRoomMoveOpen(false)}
        reservationId={reservationId}
      />
    </div>
  );
};

export default BookingDetailButton;
