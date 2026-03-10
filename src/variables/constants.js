const {
  VITE_API_URL,
  VITE_BASE_PATH,
  VITE_BASE_VERSION,
  VITE_HASH_SIGN_KEY,
  VITE_ACCESS_KEY_ID,
  VITE_SECRET_ACCESS_KEY,
} = import.meta.env;

export const API_URL = VITE_API_URL;
export const APP_VERSION = VITE_BASE_VERSION;
export const BASE_PATH = VITE_BASE_PATH;
export const HASH_SIGN_KEY = VITE_HASH_SIGN_KEY;
export const ACCESS_KEY_ID = VITE_ACCESS_KEY_ID;
export const SECRET_ACCESS_KEY = VITE_SECRET_ACCESS_KEY;

/* String Constant */

// Admin roles
export const ADMIN = "admin";
export const SUPER_ADMIN = "superAdmin";
export const SUPER_ADMIN_SK = "superadmin";

//Gender options
export const MALE = "male";
export const FEMALE = "female";

// Status
export const ACTIVE = "active";
export const INACTIVE = "inactive";
export const CHANGED = "changed";
export const SENT = "sent";
export const DRAFTED = "drafted";
export const EXPIRED = "expired";

export const CREATE = "create";
export const EDIT = "edit";
export const VIEW = "view";

export const PASSPORT = "passport";
export const NRC = "nrc";

export const RESET_PASSWORD = "resetPassword";
export const GET_PASSWORD = "getPassword";

export const DATE_FORMAT = "YYYY-MM-DD";
export const TIME_FORMAT = "HH:mm:ss";
export const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

export const START_OF_DAY = "start of day";
export const END_OF_DAY = "end of day";

// File Category
export const ADMIN_SK = "admin";
export const USER_SK = "user";
export const TRAINER_SK = "trainer";
export const ADVERTISEMENT_SK = "advertisement";
export const TUTORIAL_SK = "tutorial";

// File Directory
export const PROFILE_PHOTO_SK = "profilePhoto";
export const ADVERTISEMENT_PHOTO_SK = "advertisementPhoto";
export const TUTORIAL_PHOTO_SK = "tutorialPhoto";

// Message Status
export const JOIN_SK = "Join";
export const OVERDUE_SK = "Overdue";
export const EXPIRED_SK = "Expired";
export const ACTIVE_SK = "Active";
export const COMPLETED_SK = "Completed";

// Message Status
export const JOIN_LK = "Join";
export const OVERDUE_LK = "Overdue";
export const EXPIRED_LK = "Expired";
export const ACTIVE_LK = "Active";
export const COMPLETED_LK = "Completed";

//Page Mode
export const TRAINER_LK = "trainer";
export const PERSONAL_TRAINER_LK = "personal trainer";
export const USER_PT_SESSION_LK = "user pt session";

export const LOCAL_STORAGE_KEYS = {
  sessionId: "SessionId",
  adminIdentifier: "AdminIdentifier",
  adminRole: "AdminRole",
  superAdmin: "SuperAdmin",
  deviceId:"DeviceId",
  deviceName:"DeviceName",
  initData: "Init_Data",
  loginAdminDetails: "Admin_Details",
};

export const LIMITS = {
  PAGE_SIZE: 10,
};

export const SERVER_ERROR_CODES = {
  sessionExpired: "1000",
};

export const makeid = (prefix, length) => {
  let result = "";
  const characters = "0123456789";

  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return prefix + result;
};

export const emailValidator = (_, value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value || emailRegex.test(value)) {
    return Promise.resolve();
  }
  return Promise.reject("Please enter a valid email address");
};

export const phoneValidator = (_, value) => {
  const phoneRegex = /^\+?[0-9]{5,15}$/; // Adjust this regex based on your phone number format
  if (!value || phoneRegex.test(value)) {
    return Promise.resolve();
  }
  return Promise.reject("Please enter a valid phone number");
};

export const numberValidator = (_, value) => {
  const numberRegex = /^[1-9]\d*$/; // Regular expression disallowing numbers starting with 0
  if (!value || numberRegex.test(value)) {
    return Promise.resolve();
  }
  return Promise.reject(
    "Please enter a valid number. Numbers cannot start with 0.",
  );
};

export const onRow = (record, index) => {
  return {
    onMouseEnter: () => {
      // Handle mouse enter event (change background color on hover)
      document
        .getElementsByClassName("ant-table-tbody")[0]
        .querySelector(
          `.ant-table-row:nth-child(${index + 1})`,
        ).style.backgroundColor = "#e6f7ff"; // Light blue background on hover
    },
    onMouseLeave: () => {
      // Handle mouse leave event (reset background color on leave)
      document
        .getElementsByClassName("ant-table-tbody")[0]
        .querySelector(
          `.ant-table-row:nth-child(${index + 1})`,
        ).style.backgroundColor = index % 2 === 0 ? "#f5f5f5" : "#ffffff"; // Reset to alternating row colors
    },
  };
};

export const nrcNo = [
  { id: 1, label: "1", value: "1" },
  { id: 2, label: "2", value: "2" },
  { id: 3, label: "3", value: "3" },
  { id: 4, label: "4", value: "4" },
  { id: 5, label: "5", value: "5" },
  { id: 6, label: "6", value: "6" },
  { id: 7, label: "7", value: "7" },
  { id: 8, label: "8", value: "8" },
  { id: 9, label: "9", value: "9" },
  { id: 10, label: "10", value: "10" },
  { id: 11, label: "11", value: "11" },
  { id: 12, label: "12", value: "12" },
  { id: 13, label: "13", value: "13" },
  { id: 14, label: "14", value: "14" },
];

export const nrcTypes = [
  { id: 1, label: "C (နိုင်ငံသား)", value: "C" },
  { id: 2, label: "AC (ဧည့်နိုင်ငံသား)", value: "AC" },
  { id: 3, label: "NC (နိုင်ငံသားပြု)", value: "NC" },
  { id: 4, label: "V (နိုင်ငံသားစိစစ်ခံ)", value: "V" },
];

export const groupTypes = [
  { id: 1, label: "All", value: "" },
  { id: 2, label: "Memberships", value: "Memberships" },
  { id: 3, label: "Guests", value: "Guests" },
  { id: 4, label: "Individual PT Members", value: "Individual PT Members" },
  { id: 5, label: "Group PT Members", value: "Group PT Members" },
];

export const messageTypes = [
  { id: 1, label: "Introduction", value: "Introduction" },
  { id: 2, label: "Promotion", value: "Promotion" },
  { id: 3, label: "Activity", value: "Activity" },
  { id: 4, label: "Expiration", value: "Expiration" },
  { id: 5, label: "Warning", value: "Warning" },
];
export const genders = [
  { id: 1, label: "Male", value: MALE },
  { id: 2, label: "Female", value: FEMALE },
];

export const statuses = [
  { id: 1, label: "Active", value: ACTIVE },
  { id: 2, label: "Inactive", value: INACTIVE },
];

export const trainerSessionStatuses = [
  { id: 1, label: "Active", value: ACTIVE },
  { id: 2, label: "Inactive", value: INACTIVE },
  { id: 3, label: "Changed", value: CHANGED },
];

export const membershipStatuses = [
  { id: 1, label: "Active", value: ACTIVE },
  { id: 2, label: "Inactive", value: INACTIVE },
  { id: 3, label: "Expired", value: EXPIRED },
];

export const nrcStatuses = [
  { id: 1, label: "NRC", value: NRC },
  { id: 2, label: "Passport", value: PASSPORT },
];

export const giftVouchers = [
  { id: 1, label: "Yes", value: 1 },
  { id: 2, label: "No", value: 0 },
];

export const monthDurations = [
  { id: 0, label: "1 Day", value: 0 },
  { id: 1, label: "1 Month", value: 1 },
  { id: 2, label: "2 Months", value: 2 },
  { id: 3, label: "3 Months", value: 3 },
  { id: 4, label: "4 Months", value: 4 },
  { id: 5, label: "5 Months", value: 5 },
  { id: 6, label: "6 Months", value: 6 },
  { id: 7, label: "7 Months", value: 7 },
  { id: 8, label: "8 Months", value: 8 },
  { id: 9, label: "9 Months", value: 9 },
  { id: 10, label: "10 Months", value: 10 },
  { id: 11, label: "11 Months", value: 11 },
  { id: 12, label: "12 Months", value: 12 },
];

export const DEFAULT_IP_ADDRESS = "127.0.0.1";
