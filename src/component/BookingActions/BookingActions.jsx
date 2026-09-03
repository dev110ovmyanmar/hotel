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
  addDeposit: {
    label: "Add Deposit",
    icon: <PlusOutlined style={{ fontSize: "12px" }} />,
  },
  addRefund: {
    label: "Add Refund",
    icon: <PlusOutlined style={{ fontSize: "12px" }} />,
  },

  // overtimeCharges: {
  //   label: "Overtime Charges",
  // },
  roomMove: {
    label: "Room Move",
  },
  printInvoice: {
    label: "Print Invoice",
  },
  addNote: {
    label: "Add Note",
    icon: <PlusOutlined style={{ fontSize: "12px" }} />,
  },

  ChargeNoshowFee: {
    label: "Charge No-show Fee",
  },
};

export const status_actions = {
  PENDING: [],
  BOOKED: ["addNote"],
  CONFIRMED: ["overtimeCharges", "addNote", "addDeposit"],
  CHECKED_IN: [
    "addPayment",
    "addDeposit",
    "overtimeCharges",
    "printInvoice",
    "addNote",
  ],
  CHECKED_OUT: ["addRefund", "printInvoice", "addNote"],
  CANCELLED: ["overtimeCharges", "addRefund", "addNote"],
  NO_SHOW: ["overtimeCharges", "addRefund", "ChargeNoshowFee", "addNote"],
};
