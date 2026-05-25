import { PlusOutlined } from "@ant-design/icons";

export const button_config = {
  changeStatus: {
    label: "Change Status",
  },
  amendBooking: {
    label: "Amend Booking",
  },
  addPayment: {
    label: "Add Payment",
    icon: <PlusOutlined style={{ fontSize: "12px" }} />,
  },
  addRefund: {
    label: "Add Refund",
    icon: <PlusOutlined style={{ fontSize: "12px" }} />,
  },
  amendStay: {
    label: "Amend Stay",
  },
  overtimeCharges: {
    label: "Overtime Charges",
  },
  roomMove: {
    label: "Room Move",
  },
  printInvoice: {
    label: "Print Invoice",
  },
  ncillaryService: {
    label: "Ancillary Service",
  },
};

export const status_actions = {
  PENDING: [
    "changeStatus", 
    "amendBooking", 
    "addPayment", 
    "ancillaryService"
  ],
  BOOKED: [
    "changeStatus", 
    "amendBooking", 
    "addPayment", 
    "ancillaryService"
  ],
  CONFIRMED: [
    "changeStatus",
    "amendBooking",
    "addPayment",
    "overtimeCharges",
    "addRefund",
    "ancillaryService",
  ],
  CHECKED_IN: [
    "changeStatus",
    "amendStay",
    "addPayment",
    "overtimeCharges",
    "addRefund",
    "printInvoice",
  ],
  CHECKED_OUT: [
    "addRefund", 
    "printInvoice"
  ],
  CANCELLED: [
    "overtimeCharges", 
    "addRefund"
  ],
  NO_SHOW: [
    "overtimeCharges", 
    "addRefund"
  ],
};
