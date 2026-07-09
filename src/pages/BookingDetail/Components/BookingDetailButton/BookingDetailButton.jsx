import React, { useState } from "react";
import { Button, Drawer, Form, Select } from "antd";
import AmendBookingForm from "../BookingDetailForms/AmendBookingForm";
import ChangeStatusForm from "../BookingDetailForms/ChangeStatusForm";
import OvertimeChargeForm from "../BookingDetailForms/OvertimeChargeForm";
import AddReundForm from "../BookingDetailForms/AddRefundForm";
import RoomMoveForm from "../BookingDetailForms/RoomMoveForm";
import AmendStayForm from "../BookingDetailForms/AmendStayForm";
import AddDepoistForm from "../BookingDetailForms/AddDepoistForm";
import AddPaymentForm from "../BookingDetailForms/AddPaymentForm";
import {
  button_config,
  status_actions,
} from "./../../../../component/BookingActions/BookingActions";
import ReservationNoteForm from "../BookingDetailForms/ReservationNoteForm";
import { reservationMeta } from "../../../../api/reservationSectionApi";
import useApiQuery from "../../../../hooks/useApiQuery";
import { queryClient } from "../../../../app/queryClient";

const BookingDetailButton = ({ data }) => {
  const reservation = data?.reservationRoom;
  const status = reservation?.roomStatus?.code?.toUpperCase();
  const actions = status_actions[status] || [];

  const { data: reservationMetaData } = useApiQuery({
    fetchQueryName: "reservation-meta",
    fetchQueryFunction: reservationMeta,
    params: {
      uuid: data?.reservation?.uuid
    }
  })

  const initData = queryClient.getQueryData(["initData", "authenticated"]);

  const providerTypes = initData?.statuses.provider_type;

  const paymentMethods = reservationMetaData?.payment_methods || [];
  const guests = reservationMetaData?.guests || [];
  const folios = reservationMetaData?.folios || [];
  const paymentStatuses = initData?.statuses?.payment_status;
  const paymentCompletedStatus = paymentStatuses.find((item) => item?.code == "completed");
  console.log('paymentCompletedStatus', paymentCompletedStatus);

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [amendOpen, setAmendOpen] = useState(false);
  const [overtimeOpen, setOvertimeOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [roomMoveOpen, setRoomMoveOpen] = useState(false);
  const [amendStayOpen, setAmendStayOpen] = useState(false);
  const [addPaymentOpen, setAddPaymentOpen] = useState(false);
  const [addDepositOpen, setAddDepositOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);

  const handleAction = (key) => {
    switch (key) {
      case "changeStatus":
        setOpen(true);
        break;

      case "amendBooking":
        setAmendOpen(true);
        break;

      case "addDeposit":
        setAddDepositOpen(true);
        break;

      case "addRefund":
        setRefundOpen(true);
        break;

      case "addPayment":
        setAddPaymentOpen(true);
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

      case "addNote":
        setNoteOpen(true);
        break;
    }
  };

  return (
    <div>
      <div className="text-sm mb-6 mt-1.5">
        Reservation No:
        <strong className="text-indigo-700">
          {" "}
          {reservation?.reservation?.reservationNo}
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

      {open && (
        <ChangeStatusForm
          open={open}
          onClose={() => setOpen(false)}
          reservationId={data?.reservationNo}
          reservationDetails={data}
        />
      )}

      <AmendBookingForm
        open={amendOpen}
        onClose={() => setAmendOpen(false)}
        reservationId={data?.reservationNo}
      />

      <AddDepoistForm
        open={addDepositOpen}
        onClose={() => setAddDepositOpen(false)}
        bookingDetails={data}
        providerTypes={providerTypes}
        paymentMethodsData={paymentMethods}
        paymentCompletedStatus={paymentCompletedStatus}
        guests={guests}
      />

      <AddReundForm
        open={refundOpen}
        onClose={() => setRefundOpen(false)}
        bookingDetails={data}
        providerTypes={providerTypes}
        paymentMethodsData={paymentMethods}
        paymentCompletedStatus={paymentCompletedStatus}
        guests={guests}
      />

      <AddPaymentForm
        open={addPaymentOpen}
        onClose={() => setAddPaymentOpen(false)}
        bookingDetails={data}
        providerTypes={providerTypes}
        paymentMethodsData={paymentMethods}
        paymentCompletedStatus={paymentCompletedStatus}
        guests={guests}
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

      {noteOpen && (
        <ReservationNoteForm
          open={noteOpen}
          onClose={() => setNoteOpen(false)}
          reservationId={data?.reservationNo}
          reservationUuid={data?.reservation?.uuid}
        />
      )}
    </div>
  );
};

export default BookingDetailButton;
