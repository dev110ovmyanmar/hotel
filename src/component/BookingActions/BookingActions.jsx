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
};

export const status_actions = {
  PENDING: ["changeStatus", "amendBooking", "addPayment"],
  BOOKED: ["changeStatus", "amendBooking", "addPayment"],
  CONFIRMED: ["changeStatus", "amendBooking", "addPayment", "overtimeCharges"],
  CANCELLED: ["changeStatus", "amendBooking", "addPayment", "overtimeCharges"],
  CHECK_IN: [
    "changeStatus",
    "amendBooking",
    "addPayment",
    "overtimeCharges",
    "addRefund",
    "roomMove",
    "printInvoice",
  ],
};
