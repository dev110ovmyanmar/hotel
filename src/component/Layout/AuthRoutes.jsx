/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, useMemo } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Loader from "../../component/Loader/Loader";
import NotFound from "../../pages/404/NotFound";
import PermissionRoute from "../../app/permissionRoute";
import _ from "lodash";
import { lazy } from "react";
import {
  DashboardOutlined,
  UserOutlined,
  CalendarOutlined,
  ScheduleOutlined,
  ShopOutlined,
  SecurityScanOutlined,
  UserSwitchOutlined,
  CustomerServiceOutlined,
  FileProtectOutlined,
  DeploymentUnitOutlined,
  DollarOutlined,
  WalletOutlined,
  SafetyOutlined,
  SettingOutlined,
  AuditOutlined,
  UsergroupAddOutlined,
  CoffeeOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import {
  IoBedOutline,
  IoBusinessSharp,
  IoConstructOutline,
  IoDocumentTextOutline,
  IoFastFoodOutline,
  IoFlowerOutline,
  IoLayersOutline,
  IoRestaurantOutline,
} from "react-icons/io5";
import {
  MdApartment,
  MdBathtub,
  MdFitnessCenter,
  MdOutlineAutoGraph,
  MdOutlineInventory2,
  MdOutlineKingBed,
  MdOutlinePolicy,
  MdOutlineTableRestaurant,
  MdRoomPreferences,
  MdViewList,
  MdGroups3,
  MdOutlineSupportAgent,
  MdPayments,
  MdOutlineCategory,
  MdOutlinePeople,
  MdMeetingRoom,
} from "react-icons/md";
import { PERMISSIONS } from "../../variables/permission";
import { BiFoodMenu, BiGroup } from "react-icons/bi";
import { GiBroom, GiModernCity, GiVacuumCleaner } from "react-icons/gi";
import { LuPackageSearch, LuSalad } from "react-icons/lu";
import { LiaHotelSolid } from "react-icons/lia";
import { FaPeopleGroup } from "react-icons/fa6";
import { GrUserSettings } from "react-icons/gr";
import { RiCalendarScheduleLine, RiServiceBellLine } from "react-icons/ri";
import { BsBuildingFillGear, BsBuildings } from "react-icons/bs";
import { AiOutlineSolution } from "react-icons/ai";
import NetworkErrorPage from "../NetworkErrorPage/NetworkErrorPage";
import { Grid } from "antd";

const Dashboard = lazy(() => import("../../pages/Dashboard/Dashboard"));
const Calendar = lazy(() => import("../../pages/Calendar/Calendar"));
const Reservation = lazy(
  () => import("../../pages/Reservation/ReservationList"),
);
// const ReservationForm = lazy(
//   () => import("../../pages/ReservationForm/ReservationForm"),
// );
const GuestDetails = lazy(
  () => import("../../pages/EditReservation/Menu/GuestDetails/GuestList"),
);
// const Booking = lazy(() => import("../../pages/Booking/Booking"));
const Department = lazy(
  () => import("../../pages/Departments/DepartmentsList"),
);
const RoomType = lazy(() => import("../../pages/RoomType/RoomTypeList"));
const Room = lazy(() => import("../../pages/Room/RoomList"));
const RoomAttribute = lazy(
  () => import("../../pages/RoomAttribute/RoomAttributeList"),
);
const Floor = lazy(() => import("../../pages/Floor/FloorList"));
const AdminList = lazy(() => import("../../pages/Admins/AdminList"));
const LocationList = lazy(() => import("../../pages/Location/LocationList"));
const AmenitiesList = lazy(() => import("../../pages/Amenities/AmenitiesList"));
const PolicyList = lazy(() => import("../../pages/Policy/PolicyList"));
const ChangePassword = lazy(
  () => import("../../pages/Authentication/ChangePassword/ChangePasswordPage"),
);
const Profile = lazy(() => import("../../pages/Profile/ProfilePage"));
const PermissionListing = lazy(
  () => import("../../pages/Permissions/PermissionsListing"),
);
const RolesListing = lazy(() => import("../../pages/Roles/RolesListing"));
const PropertiesListing = lazy(
  () => import("../../pages/Properties/PropertiesListing"),
);
const ServiceList = lazy(() => import("../../pages/Services/ServiceList"));

const PrivacyPolicy = lazy(
  () => import("../../pages/PrivacyPolicy/PrivacyPolicy"),
);

const CategoryListing = lazy(
  () => import("../../pages/Categories/CategoryListing"),
);
const UnitListing = lazy(() => import("../../pages/Units/UnitListing"));
const ServiceInventoryListing = lazy(
  () => import("../../pages/ServicesInventories/ServiceInventoryListing"),
);

const MeanPlanList = lazy(() => import("../../pages/MealPlan/MealPlanList"));

const PaymentList = lazy(() => import("../../pages/Payment/PaymentList"));

const Taxs = lazy(() => import("../../pages/Tax/TaxList"));

const Agencies = lazy(() => import("../../pages/Agencies/AgencyList"));

const Company = lazy(() => import("../../pages/Company/CompanyList"));

const ReferralAgent = lazy(
  () => import("../../pages/ReferralAgent/ReferralList"),
);

const FacilityList = lazy(() => import("../../pages/Facility/FacilityList"));
const FacilityPackageList = lazy(
  () => import("../../pages/FacilityPackage/FacilityPackageList"),
);
const FacilityListPackagesTable = lazy(
  () => import("../../pages/Facility/FacilityListPackagesTable"),
);
const Staff = lazy(() => import("../../pages/Staffs/StaffsList"));
const RatePlan = lazy(() => import("../../pages/RatePlan/RatePlanList"));

const GuestListing = lazy(
  () => import("../../pages/GuestsListing/NewGuestListing"),
);

const GuestNotesListing = lazy(
  () => import("../../pages/GuestsListing/GuestNotes/GuestNotesListing"),
);
const GuestProfile = lazy(
  () => import("../../pages/GuestsListing/GuestProfile/GuestProfile"),
);

const RoomRateList = lazy(() => import("../../pages/RoomRate/RoomRateList"));

const SeasonalRate = lazy(
  () => import("../../pages/SeasonalRate/SeasonalRateList"),
);

const MenuCategoryList = lazy(
  () => import("../../pages/MenuCategory/MenuCategoryList"),
);

const MenuModifierList = lazy(
  () => import("../../pages/MenuModifier/MenuModifierList"),
);

const AgencyContractList = lazy(
  () => import("../../pages/AgencyContract/AgencyContractList"),
);

const RoomInventoryList = lazy(
  () => import("../../pages/RoomInventory/RoomInventoryList"),
);

const SupplierList = lazy(
  () => import("../../pages/Suppliers/SuppliersListing"),
);
const RestauranttableList = lazy(
  () => import("../../pages/RestaurantTable/RestaurantTableLisitng"),
);
const FAndBInventoryList = lazy(
  () => import("../../pages/FAndBInventory/FAndBInventoryList"),
);

const CompanyContractList = lazy(
  () => import("../../pages/CompanyContract/CompanyContractList"),
);

const MenuItemList = lazy(() => import("../../pages/MenuItem/MenuItemList"));

const ExtraBedRateList = lazy(
  () => import("../../pages/ExtraBedRate/ExtraBedRateList"),
);

const GuestFileUpload = lazy(
  () => import("../../pages/GuestsListing/Components/NewGuestUploadForm"),
);

const HouseKeepingStatusesListing = lazy(
  () => import("../../pages/HouseKeeping/HouseKeepingStatusesListing"),
);

const HouseKeepingTaskListing = lazy(
  () => import("../../pages/HouseKeepingTask/HouseKeepingTaskListing"),
);

const MaintenanceRequestListing = lazy(
  () => import("../../pages/MaintenanceRequest/MaintenanceRequestListing"),
);

const RoomRestrictionList = lazy(
  () => import("../../pages/RoomRestriction/RoomRestrictionList"),
);

const RoomInformation = lazy(
  () =>
    import("../../pages/EditReservation/Menu/RoomInformation/RoomInformationList"),
);

const BookingDetail = lazy(
  () => import("../../pages/BookingDetail/BookingDetailList"),
);

const FolioOperations = lazy(
  () =>
    import("../../pages/EditReservation/Menu/FolioOperations/FolioOperationsList"),
);

const NightAudit = lazy(() => import("../../pages/NightAudit/NightAudit"));

const EventFacilityOrderList = lazy(
  () =>
    import("../../pages/EditReservation/Menu/EventFacilityOrder/EventFacilityOrderList"),
);

const AddOnServiceList = lazy(
  () =>
    import("../../pages/EditReservation/Menu/ServiceAddOn/ServiceAddOnList"),
);

const RateAndInventoryCalendar = lazy(
  () => import("../../pages/RateAndInventoryCalendar/RateAndInventoryCalendar"),
);

const ReservationsMenu = lazy(
  () => import("../../pages/NewReservation/Components/ReservationsMenu"),
);

const ServicePackage = lazy(
  () => import("../../pages/ServicePackage/ServicePackageList"),
);

const FacilityBookingList = lazy(
  () => import("../../pages/FacilityBooking/FacilityBookingList"),
);

const ServiceOrderList = lazy(
  () =>
    import("../../pages/EditReservation/Menu/ServiceOrder/ServiceOrderList"),
);

const FoodBeverageOrderList = lazy(
  () =>
    import("../../pages/EditReservation/Menu/FoodBeverageOrder/FoodBeverageOrderList"),
);
// const Email =lazy(()=> import("../../pages/Email/Email"))
export const authRoutes = [
  {
    key: 1,
    path: "/dashboard/",
    label: "Dashboard",
    icon: <DashboardOutlined style={{ fontSize: "20px" }} />,
    component: <Dashboard />,
    isPrivate: false,
  },
  {
    key: 2,
    id: "/calendar",
    label: "Calendar",
    isPrivate: false,
    icon: <CalendarOutlined style={{ fontSize: "20px" }} />,
    nested: [
      {
        key: 2.1,
        path: "/calendar/reservation-calender/",
        label: "Reservation Calendar",
        icon: <CalendarOutlined style={{ fontSize: "20px" }} />,
        component: <Calendar />,
        isPrivate: false,
        permission: PERMISSIONS.AVAILABILITY_CALENDAR_LIST,
      },
      {
        key: 2.2,
        label: "Rate & Inventory Calendar",
        path: "/calendar/rate-&-inventory-calendar",
        component: <RateAndInventoryCalendar />,
        icon: <CalendarOutlined style={{ fontSize: "20px" }} />,
        isPrivate: false
      },
    ]
  },
  {
    key: 3,
    id: "/front-office",
    label: "Front Office",
    isPrivate: false,
    icon: <ScheduleOutlined style={{ fontSize: "20px" }} />,
    nested: [
      {
        key: 3.1,
        path: "/reservation/create-new-reservation",
        icon: <ScheduleOutlined style={{ fontSize: "20px" }} />,
        component: <Reservation />,
        isPrivate: false,
      },
      {
        key: 3.2,
        id: "/reservations",
        label: "Reservations",
        path: "/reservations/:status",
        icon: <ScheduleOutlined style={{ fontSize: "20px" }} />,
        component: <ReservationsMenu />,
        isPrivate: false,
      }
    ],
  },
  {
    key: 4,
    id: "/rates-&-revenue",
    label: "Rates & Revenue",
    isPrivate: false,
    icon: <MdOutlineAutoGraph style={{ fontSize: "20px" }} />,
    nested: [
      {
        key: 4.1,
        label: "Room Type Rate",
        path: "/rates-&-revenue/room-type-rate",
        icon: <IoFlowerOutline style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <SeasonalRate />,
        permission: PERMISSIONS.SEASONAL_RATE_LIST,
      },
      {
        key: 4.2,
        path: "/rates-&-revenue/rate-plans",
        label: "Rate Plans",
        icon: <IoDocumentTextOutline style={{ fontSize: "20px" }} />,
        component: <RatePlan />,
        permission: PERMISSIONS.RATE_PLAN_LIST,
      },
      {
        key: 4.3,
        path: "/rates-&-revenue/room-inventory/",
        label: "Room Inventory",
        component: <RoomInventoryList />,
        icon: <LiaHotelSolid style={{ fontSize: "20px" }} />,
        isPrivate: false,
        permission: PERMISSIONS.AVAILABILITY_CALENDAR_LIST,
      },
      {
        key: 4.4,
        label: "Meal Plans",
        path: "/rates-&-revenue/meal-plans",
        icon: <IoFastFoodOutline style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <MeanPlanList />,
        permission: PERMISSIONS.MEAL_PLAN_LIST,
      },
      {
        key: 4.5,
        path: "/rates-&-revenue/room-restriction/",
        label: "Room Restriction",
        component: <RoomRestrictionList />,
        icon: <RiCalendarScheduleLine style={{ fontSize: "20px" }} />,
        isPrivate: true,
        permission: PERMISSIONS.ROOM_RESTRICTION_LIST,
      },
      {
        key: 4.6,
        path: "/rates-&-revenue/exta-rate/",
        label: "Extra Rate",
        component: <ExtraBedRateList />,
        icon: <IoBedOutline style={{ fontSize: "20px" }} />,
        isPrivate: true,
        permission: PERMISSIONS.EXTRA_RATE_LIST,
      },
    ],
  },
  {
    key: 3.1,
    // path: "/reservations/booking-detail/",
    path: "/reservations/:bookingId/booking-detail",
    component: <BookingDetail />,
  },
  {
    key: 3.2,
    path: "/reservations/:bookingId/guest-details",
    component: <GuestDetails />,
  },
  // {
  //   key: 3.3,
  //   path: "/reservations/room-information/",
  //   component: <RoomInformation />,
  // },
  {
    key: 3.3,
    path: "/reservations/:bookingId/room-information",
    component: <RoomInformation />,
  },
  {
    key: 3.4,
    path: "/reservations/:bookingId/event-facility-booking",
    component: <EventFacilityOrderList />,
  },
  {
    key: 3.5,
    path: "/reservations/:bookingId/folio-operations",
    component: <FolioOperations />,
  },
  {
    key: 3.6,
    path: "/reservations/:bookingId/service-add-on",
    component: <AddOnServiceList />,
  },
  {
    key: 3.6,
    path: "/reservations/:bookingId/service-order",
    component: <ServiceOrderList />,
  },
   {
    key: 3.6,
    path: "/reservations/:bookingId/food-beverage-order",
    component: <FoodBeverageOrderList />,
  },
  {
    key: 4.9,
    path: "/rates-availability/rate-plans/:ratePlanId/room-rate",
    component: <RoomRateList />,
    isPrivate: false,
    // permission: PERMISSIONS.ROOM_RATE_LIST,
  },
  {
    key: 5,
    id: "/rooms",
    label: "Rooms",
    isPrivate: false,
    icon: <MdOutlineKingBed style={{ fontSize: "20px" }} />,
    nested: [
      {
        key: 5.1,
        path: "/rooms/room-lists",
        label: "Rooms",
        icon: <MdOutlineKingBed style={{ fontSize: "20px" }} />,
        component: <Room />,
        permission: PERMISSIONS.ROOM_LIST,
      },
      {
        key: 5.2,
        path: "/rooms/room-types",
        label: "Room Types",
        icon: <MdMeetingRoom style={{ fontSize: "20px" }} />,
        component: <RoomType />,
        permission: PERMISSIONS.ROOM_TYPE_LIST,
      },
      {
        key: 5.3,
        path: "/rooms/room-attributes",
        label: "Room Attributes",
        icon: <MdBathtub style={{ fontSize: "20px" }} />,
        component: <RoomAttribute />,
        permission: PERMISSIONS.ROOM_ATTRIBUTE_LIST,
      },
      {
        key: 5.4,
        label: "Room Amenities",
        path: "/rooms/room-amenities",
        icon: <MdFitnessCenter style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <AmenitiesList />,
        permission: PERMISSIONS.AMENITY_LIST,
      },
      {
        key: 5.5,
        path: "/rooms/floor-rooms",
        label: "Floor Rooms",
        icon: <IoLayersOutline style={{ fontSize: "20px" }} />,
        component: <Floor />,
        permission: PERMISSIONS.FLOOR_LIST,
      },

    ],
  },
  {
    key: 6,
    id: "/events-&-facilities",
    label: "Events & Facilities",
    isPrivate: false,
    icon: <BsBuildingFillGear style={{ fontSize: "20px" }} />,
    nested: [
      {
        key: 6.1,
        label: "Booking",
        path: "/events-&-facilities/booking",
        icon: <LuPackageSearch style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <FacilityBookingList />,
        permission: PERMISSIONS.FACILITY_BOOKING_LIST,
      },
      {
        key: 6.2,
        label: "Events & Facilities",
        path: "/events-&-facilities/facilities",
        icon: <RiServiceBellLine style={{ fontSize: "20px" }} />,
        component: <FacilityList />,
        permission: PERMISSIONS.FACILITY_LIST,
      },
      {
        key: 6.3,
        label: "Package",
        path: "/events-&-facilities/package",
        icon: <LuPackageSearch style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <FacilityPackageList />,
        permission: PERMISSIONS.FACILITY_PACKAGE_LIST,
      },

    ],
  },
  {
    key: 6.4,
    path: `/events-&-facilities/facilities/:facilityId/packages`,
    component: <FacilityListPackagesTable />,
  },
  {
    key: 7,
    path: "/guest-list/guests/",
    label: "Guests",
    component: <GuestListing />,
    icon: <UsergroupAddOutlined style={{ fontSize: "20px" }} />,
    isPrivate: false,
    permission: PERMISSIONS.GUEST_LIST,
  },
  // {
  //   key: 7,
  //   label: "Guests",
  //   isPrivate: false,
  //   icon: <ShopOutlined style={{ fontSize: "20px" }} />,
  // nested: [
  // {
  //   key: 6.1,
  //   label: "Guests",
  //   path: "/guests/guests",
  //   icon: <ApartmentOutlined style={{ fontSize: "20px" }} />,
  //   // component: < />,
  //   // permission: ".list",
  // },
  // {
  //   key: 6.2,
  //   label: "Guest Notes",
  //   path: "/guests/guest-notes",
  //   icon: <DatabaseOutlined style={{ fontSize: "20px" }} />,
  //   // isPrivate: true,
  //   // component: </>,
  //   // permission: ".list",
  // },
  // ],
  // },
  // {
  //   key: 7,
  //   path: "/property-management/properties",
  //   label: "Properties",
  //   icon: <PropertySafetyOutlined style={{ fontSize: "20px" }} />,
  //   component: <PropertiesListing />,
  //   permission: "property.list",
  // },
  // {
  //   key: 7,
  //   label: "Settings",
  //   isPrivate: false,
  //   icon: <PropertySafetyOutlined style={{ fontSize: "20px" }} />,
  //   nested: [
  //     {
  //       key: 7.1,
  //       path: "/property-management/properties",
  //       label: "Properties",
  //       icon: <PropertySafetyOutlined style={{ fontSize: "20px" }} />,
  //       component: <PropertiesListing />,
  //       permission: "property.list",
  //     },
  //     {
  //       key: 7.2,
  //       label: "Policy",
  //       path: "/policy",
  //       icon: <MdOutlinePolicy style={{ fontSize: "20px" }} />,
  //       isPrivate: true,
  //       component: <PolicyList />,
  //       permission: "policy.list",
  //     },
  //     {
  //       key: 7.3,
  //       label: "Privacy Policy",
  //       path: "/privacy-policy",
  //       icon: <FileProtectOutlined style={{ fontSize: "20px" }} />,
  //       isPrivate: true,
  //       component: <PrivacyPolicy />,
  //       // permission: "privacy-policy.list",
  //     },
  //     {
  //       key: 7.4,
  //       label: "Location",
  //       path: "/location",
  //       icon: <EnvironmentOutlined style={{ fontSize: "20px" }} />,
  //       isPrivate: true,
  //       component: <LocationList />,
  //       permission: "location.list",
  //     },
  //   ],
  // },
  {
    key: 8,
    id: "/booking-source",
    label: "Booking Source",
    icon: <MdGroups3 style={{ fontSize: "20px" }} />,
    nested: [
      {
        key: 8.1,
        label: "Travel Agents",
        path: "/booking-source/travel-agents",
        icon: <BiGroup style={{ fontSize: "20px" }} />,
        component: <Agencies />,
        permission: PERMISSIONS.PARTNER_LIST,
      },
      {
        key: 8.2,
        label: "Companies / Corporates",
        path: "/booking-source/companies-or-corporates",
        icon: <IoBusinessSharp style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <Company />,
        permission: PERMISSIONS.PARTNER_LIST,
      },
      {
        key: 8.3,
        label: "Referral Agents",
        path: "/booking-source/referral-agents",
        icon: <MdOutlineSupportAgent style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <ReferralAgent />,
        permission: PERMISSIONS.PARTNER_LIST,
      },
    ],
  },
  {
    key: 8.4,
    path: "/booking-source/travel-agents/:agencyId/agency-contract",
    component: <AgencyContractList />,
  },
  {
    key: 8.5,
    path: "/booking-source/company/:companyId/company-contract",
    component: <CompanyContractList />,
  },
  {
    key: 9,
    id: "/restaurant",
    label: "Restaurant",
    isPrivate: false,
    icon: <IoRestaurantOutline style={{ fontSize: "20px" }} />,
    nested: [{
      key: 9.1,
      label: "Menu Items",
      path: "/restaurant/menu-items",
      icon: <CoffeeOutlined style={{ fontSize: "20px" }} />,
      isPrivate: true,
      component: <MenuItemList />,
      permission: PERMISSIONS.MENU_MODIFIER_LIST,
    },
    {
      key: 9.2,
      label: "Menu Categories",
      path: "/restaurant/menu-categories",
      icon: <BiFoodMenu style={{ fontSize: "20px" }} />,
      component: <MenuCategoryList />,
      permission: PERMISSIONS.MENU_CATEGORY_LIST,
    },

    {
      key: 9.3,
      label: "Menu Modifiers",
      path: "/restaurant/menu-modifiers",
      icon: <LuSalad style={{ fontSize: "20px" }} />,
      component: <MenuModifierList />,
      isPrivate: true,
      permission: PERMISSIONS.MENU_MODIFIER_LIST,
    },
    {
      key: 9.4,
      path: "/restaurant/table-management",
      label: "Table Management",
      component: <RestauranttableList />,
      icon: <MdOutlineTableRestaurant style={{ fontSize: "20px" }} />,
      isPrivate: true,
      permission: PERMISSIONS.RESTAURANT_TABLE_LIST,
    },
    {
      key: 9.5,
      path: "/restaurant/f-&-b-inventory-item/",
      label: "F & B Inventory Item",
      component: <FAndBInventoryList />,
      icon: <TrophyOutlined style={{ fontSize: "20px" }} />,
      isPrivate: false,
      permission: PERMISSIONS.FOOD_AND_BEVERAGE_INVENTORY_LIST,
    },

      // {
      //   key: 14.4,
      //   label: "Tables",
      //   path: "/f&b-management/tables",
      //   icon: <DiffOutlined style={{ fontSize: "20px" }} />,
      //   // component: </>,
      //   // permission: ".list",
      // },
      // {
      //   key: 14.5,
      //   label: "Order List",
      //   path: "/f&b-management/order-list",
      //   icon: <ApartmentOutlined style={{ fontSize: "20px" }} />,
      //   // component: < />,
      //   // permission: ".list",
      // },
      // {
      //   key: 14.6,
      //   label: "Order Items / Modifiers",
      //   // path: "/f&b-management/service-orders",
      //   icon: <DatabaseOutlined style={{ fontSize: "20px" }} />,
      //   isPrivate: true,
      //   // component: < />,
      //   // permission: ".list",
      // },
      // {
      //   key: 14.7,
      //   label: "Kitchen Tickets",
      //   path: "/f&b-management/kitchen-tickets",
      //   icon: <DiffOutlined style={{ fontSize: "20px" }} />,
      //   // component: </>,
      //   // permission: ".list",
      // },
      // {
      //   key: 14.8,
      //   label: "Service Inventory Items",
      //   path: "/f&b-management/service-inventory-items",
      //   icon: <DiffOutlined style={{ fontSize: "20px" }} />,
      //   // component: </>,
      //   // permission: ".list",
      // },
    ],
  },
  {
    key: 10,
    id: "/house-keeping",
    label: "House Keeping",
    icon: <GiVacuumCleaner style={{ fontSize: "20px" }} />,
    nested: [
      {
        key: 10.1,
        label: "Room Status Board",
        path: "/house-keeping/room-status-board",
        icon: <MdRoomPreferences style={{ fontSize: "20px" }} />,
        component: <HouseKeepingStatusesListing />,
        permission: PERMISSIONS.HK_STATUS_LIST,
      },
      {
        key: 10.2,
        label: "Housekeeping Task",
        path: "/house-keeping/housekeeping-task",
        icon: <GiBroom style={{ fontSize: "20px" }} />,
        component: <HouseKeepingTaskListing />,
        permission: PERMISSIONS.HK_TASK_LIST,
      },
    ],
  },
  {
    key: 11,
    label: "Maintenance & Support",
    path: "/maintenance-&-support",
    component: <MaintenanceRequestListing />,
    icon: <IoConstructOutline style={{ fontSize: "20px" }} />,
    permission: PERMISSIONS.MAINTENANCE_REQUEST_LIST,
  },
  {
    key: 12,
    id: "/hotel-services",
    label: "Hotel Services",
    isPrivate: false,
    icon: <CustomerServiceOutlined style={{ fontSize: "20px" }} />,
    nested: [
      {
        key: 12.1,
        label: "Services",
        path: "/hotel-services/services",
        icon: <SecurityScanOutlined style={{ fontSize: "20px" }} />,
        component: <ServiceList />,
        permission: PERMISSIONS.SERVICE_LIST,
      },
      {
        key: 13.2,
        label: "Service Inventories",
        path: "/hotel-services/services-inventories",
        icon: <MdOutlineInventory2 style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <ServiceInventoryListing />,
        permission: PERMISSIONS.SERVICE_INVENTORY_LIST,
      },
      {
        key: 13.3,
        label: "Service Packages",
        path: "/hotel-services/service-packages",
        icon: <LuPackageSearch style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <ServicePackage />,
        permission: PERMISSIONS.SERVICE_PACKAGE_LIST,
      },
      // {
      //   key: 13.3,
      //   label: "Service Packages",
      //   path: "/services-management/service-packages",
      //   icon: <DiffOutlined style={{ fontSize: "20px" }} />,
      //   // component: < />,
      //   // permission: ".list",
      // },
      // {
      //   key: 13.4,
      //   label: "Inventory Consumption",
      //   path: "/services-management/inventory-consumption",
      //   icon: <DiffOutlined style={{ fontSize: "20px" }} />,
      //   // component: </>,
      //   // permission: ".list",
      // },
    ],
  },
  {
    key: 13,
    label: "Night Audit",
    path: "/night-audit",
    component: <NightAudit />,
    icon: <AiOutlineSolution style={{ fontSize: "20px" }} />,
  },
  {
    key: 14,
    id: "/hr-management",
    label: "HR Management",
    isPrivate: false,
    icon: <GrUserSettings style={{ fontSize: "20px" }} />,
    nested: [
      {
        key: 14.1,
        label: "Staffs",
        path: "/hR-management/staffs",
        icon: <FaPeopleGroup style={{ fontSize: "20px" }} />,
        component: <Staff />,
        permission: PERMISSIONS.STAFF_LIST,
      },
      {
        key: 14.2,
        label: "Departments",
        path: "/hR-management/departments",
        icon: <MdApartment style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <Department />,
        permission: PERMISSIONS.DEPARTMENT_LIST,
      },
    ],
  },
  {
    key: 15,
    id: "/manage-access",
    label: "Manage Access",
    isPrivate: false,
    icon: <SafetyOutlined style={{ fontSize: "20px" }} />,
    nested: [
      {
        key: 15.1,
        label: "Administrators",
        path: "/access-control/administrators",
        icon: <UserOutlined style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <AdminList />,
        permission: PERMISSIONS.ADMIN_LIST,
      },
      {
        key: 15.2,
        label: "Roles",
        path: "/access-control/roles/",
        icon: <UserSwitchOutlined style={{ fontSize: "20px" }} />,
        component: <RolesListing />,
        permission: PERMISSIONS.ROLE_LIST,
      },
      {
        key: 15.3,
        label: "Permissions",
        path: "/access-control/permissions/",
        icon: <SecurityScanOutlined style={{ fontSize: "20px" }} />,
        component: <PermissionListing />,
        permission: PERMISSIONS.PERMISSION_LIST,
      },
    ],
  },
  {
    key: 16,
    id: "/payment-&-billing",
    label: "Payment & Billing",
    icon: <WalletOutlined style={{ fontSize: "20px" }} />,
    nested: [
      {
        key: 16.1,
        label: "Invoices",
        path: "/payment-&-billing/invoices",
        icon: <DollarOutlined style={{ fontSize: "20px" }} />,
        // component: <Taxs />,
        permission: PERMISSIONS.TAX_LIST,
      },
      {
        key: 16.2,
        label: "Payment History",
        path: "/payment-&-billing/payment-history",
        icon: <MdPayments style={{ fontSize: "20px" }} />,
        isPrivate: true,
        // component: <PaymentList />,
        permission: PERMISSIONS.PAYMENT_LIST,
      },
      {
        key: 16.3,
        label: "Pending Payment",
        path: "/payment-&-billing/pending-payment",
        icon: <DollarOutlined style={{ fontSize: "20px" }} />,
        // component: <Taxs />,
        permission: PERMISSIONS.TAX_LIST,
      },
      {
        key: 16.4,
        label: "Refunds",
        path: "/payment-&-billing/refunds",
        icon: <MdPayments style={{ fontSize: "20px" }} />,
        isPrivate: true,
        // component: <PaymentList />,
        permission: PERMISSIONS.PAYMENT_LIST,
      },
      {
        key: 16.5,
        label: "Taxes & Service Charges",
        path: "/payment-&-billing/taxes",
        icon: <DollarOutlined style={{ fontSize: "20px" }} />,
        component: <Taxs />,
        permission: PERMISSIONS.TAX_LIST,
      },
      {
        key: 16.6,
        label: "Payment Method",
        path: "/payment-&-billing/payment-method",
        icon: <MdPayments style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <PaymentList />,
        permission: PERMISSIONS.PAYMENT_LIST,
      },
    ],
  },
  {
    key: 17,
    id: "/procument-/-purchasing-system",
    label: "Procument / Purchasing System",
    isPrivate: false,
    icon: <AuditOutlined style={{ fontSize: "20px" }} />,
    nested: [
      // {
      //   key: 9.1,
      //   label: "Items",
      //   path: "/procument-/-purchasing-system/items",
      //   icon: <ApartmentOutlined style={{ fontSize: "20px" }} />,
      //   // component: < />,
      //   // permission: ".list",
      // },
      {
        key: 17.1,
        path: "/procument-/-purchasing-system/suppliers",
        label: "Suppliers",
        icon: <MdOutlinePeople style={{ fontSize: "20px" }} />,
        component: <SupplierList />,
        isPrivate: true,
        permission: PERMISSIONS.SUPPLIER_LIST,
      },
      {
        key: 17.2,
        label: "Inventory Categories",
        path: "/procument-/-purchasing-system/inventory-categories",
        icon: <MdOutlineCategory style={{ fontSize: "20px" }} />,
        component: <CategoryListing />,
        isPrivate: true,
        permission: PERMISSIONS.CATEGORY_LIST,
      },
      {
        key: 17.3,
        label: "Units",
        path: "/procument-/-purchasing-system/units",
        icon: <DeploymentUnitOutlined style={{ fontSize: "20px" }} />,
        component: <UnitListing />,
        isPrivate: true,
        permission: PERMISSIONS.UNIT_LIST,
      },

    ],
  },
  {
    key: 18,
    id: "/hotel-settings",
    label: "Hotel Settings",
    isPrivate: false,
    icon: <SettingOutlined style={{ fontSize: "20px" }} />,
    nested: [
      {
        key: 18.1,
        label: "Hotel Profile",
        path: "/hotel-settings/hotel-profile",
        icon: <BsBuildings style={{ fontSize: "20px" }} />,
        component: <PropertiesListing />,
        permission: PERMISSIONS.PROPERTY_LIST,
      },
      {
        key: 18.2,
        label: "Hotel Policies",
        path: "/hotel-settings/hotel-policies",
        icon: <MdOutlinePolicy style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <PolicyList />,
        permission: PERMISSIONS.POLICY_LIST,
      },
      // {
      //   key: 15.3,
      //   label: "NRC Data",
      //   path: "/hotel-settings/nrc-data",
      //   icon: <DiffOutlined style={{ fontSize: "20px" }} />,
      //   // component: < />,
      //   // permission: ".list",
      // },
      // {
      //   key: 15.4,
      //   label: "Currency",
      //   path: "/hotel-settings/currency",
      //   icon: <DiffOutlined style={{ fontSize: "20px" }} />,
      //   // component: </>,
      //   // permission: ".list",
      // },
      {
        key: 18.3,
        label: "Hotel Terms & Policies",
        path: "/hotel-settings/hotel-terms-&-policies",
        icon: <FileProtectOutlined style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <PrivacyPolicy />,
        permission: PERMISSIONS.PRIVACY_POLICY_VIEW,
      },
      {
        key: 18.4,
        label: "Country & City Setting",
        path: "/hotel-settings/country-&-city-setting",
        icon: <GiModernCity style={{ fontSize: "20px" }} />,
        component: <LocationList />,
        permission: PERMISSIONS.LOCATION_LIST,
      },

    ],
  },
  // ---------------------------------------
  // {
  // key: 11,
  // label: "Room Operations",
  // isPrivate: false,
  // icon: <ShopOutlined style={{ fontSize: "20px" }} />,
  // nested: [
  // {
  //   key: 11.1,
  //   label: "Room Status",
  //   path: "/room-operations/room-status",
  //   icon: <ApartmentOutlined style={{ fontSize: "20px" }} />,
  //   // component: < />,
  //   // permission: ".list",
  // },
  // {
  //   key: 11.2,
  //   label: "Housekeeping",
  //   path: "/room-operations/housekeeping",
  //   icon: <DatabaseOutlined style={{ fontSize: "20px" }} />,
  //   isPrivate: true,
  //   // component: < />,
  //   // permission: ".list",
  // },
  // {
  //   key: 11.3,
  //   label: "Maintenance",
  //   path: "/room-operations/maintenance",
  //   icon: <DiffOutlined style={{ fontSize: "20px" }} />,
  //   // component: </>,
  //   // permission: ".list",
  // },
  // ],
  // },
  {
    key: 25,
    path: `/guest-list/guests/:guestId/notes`,
    component: <GuestNotesListing />,
    permission: PERMISSIONS.GUEST_NOTE_LIST,
  },
  {
    key: 26,
    path: `/guest-list/guests/:guestId/profile`,
    component: <GuestProfile />,
    // permission: PERMISSIONS.GUEST_PROFILE_VIEW,
  },
  {
    key: 22,
    path: "/change-password/",
    component: <ChangePassword />,
    isPrivate: false,
  },
  {
    key: 23,
    path: "/profile/",
    component: <Profile />,
    isPrivate: false,
  },
  // {
  //   key: 24,
  //   path: "/reservation-form/",
  //   component: <ReservationForm />,
  //   isPrivate: false,
  // },
  // {
  //   key: 26,
  //   path: "/room-inventory/",
  //   label: "Room Inventory",
  //   component: <RoomInventoryList />,
  //   icon: <FormOutlined style={{ fontSize: "20px" }} />,
  //   isPrivate: false,
  //   permission: PERMISSIONS.AVAILABILITY_CALENDAR_LIST,
  // },
  // {
  //   key: 30,
  //   label: "Email",
  //   path: "/email",
  //   component: <Email />,
  //   icon: <CalendarOutlined style={{ fontSize: "20px" }} />,
  // },
];

const AuthRoutes = () => {
  const routesOptions = useMemo(() => {
    return _.flatten(
      _.map(authRoutes, (route) => (route.nested ? route.nested : route)),
    );
  }, []);

  return (
    <>
      <NetworkErrorPage />
      <Suspense
        fallback={
          <div className="w-full h-full flex justify-center items-center text-center">
            <Loader />
          </div>
        }
      >
        <Routes>
          {routesOptions.map((option) => (
            <Route
              key={option.key}
              path={option.path}
              element={
                <PermissionRoute permission={option.permission}>
                  {option.component}
                </PermissionRoute>
              }
            />
          ))}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default AuthRoutes;
