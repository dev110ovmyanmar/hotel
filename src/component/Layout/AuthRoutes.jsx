/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, useMemo } from "react";
import { Route, Routes } from "react-router-dom";
import Loader from "../../component/Loader/Loader";
import NotFound from "../../pages/404/NotFound";
import PermissionRoute from "../../app/permissionRoute";
import _ from "lodash";
import {
  DashboardOutlined,
  UserOutlined,
  IdcardOutlined,
  CalendarOutlined,
  ScheduleOutlined,
  ShopOutlined,
  TeamOutlined,
  SecurityScanOutlined,
  UserSwitchOutlined,
  PropertySafetyOutlined,
  EnvironmentOutlined,
  CustomerServiceOutlined,
  BankOutlined,
  UnorderedListOutlined,
  ApartmentOutlined,
  AppstoreOutlined,
  BarsOutlined,
  LayoutOutlined,
  FileProtectOutlined,
  DeploymentUnitOutlined,
  TagsOutlined,
  DatabaseOutlined,
  DollarOutlined,
  WalletOutlined,
  DiffOutlined,
  JavaOutlined,
  SafetyOutlined,
  SettingOutlined,
  AuditOutlined,
  RiseOutlined,
  AndroidOutlined,
  QqOutlined,
  CodeSandboxOutlined,
  UsergroupAddOutlined,
  CoffeeOutlined,
  FormOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { lazy } from "react";
import { FiMap } from "react-icons/fi";
import { MdOutlinePolicy } from "react-icons/md";
import { MdPayments } from "react-icons/md";
import { PERMISSIONS } from "../../variables/permission";
import { BiGroup } from "react-icons/bi";
import { BsBuildings } from "react-icons/bs";
import { MdOutlineSupportAgent } from "react-icons/md";
import { MdGroups3 } from "react-icons/md";
import { isPending } from "@reduxjs/toolkit";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { AiOutlineBuild } from "react-icons/ai";

const Dashboard = lazy(() => import("../../pages/Dashboard/Dashboard"));
const Calendar = lazy(() => import("../../pages/Calendar/Calendar"));
const Reservation = lazy(
  () => import("../../pages/Reservation/ReservationList"),
);
const ReservationForm = lazy(
  () => import("../../pages/ReservationForm/ReservationForm"),
);
const Guest = lazy(() => import("../../pages/Guest/GuestList"));
const Booking = lazy(() => import("../../pages/Booking/Booking"));
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
    path: "/reservation-calender/",
    label: "Reservation Calendar",
    icon: <CalendarOutlined style={{ fontSize: "20px" }} />,
    component: <Calendar />,
    isPrivate: false,
    permission: PERMISSIONS.AVAILABILITY_CALENDAR_LIST,
  },
  {
    key: 3,
    path: "/reservations/",
    label: "Reservations",
    icon: <ScheduleOutlined style={{ fontSize: "20px" }} />,
    component: <Reservation />,
    isPrivate: false,
  },
  {
    key: 3.1,
    path: "/reservation/guest-details/",
    component: <Guest />,
  },
  {
    key: 4,
    label: "Rates & Availability",
    isPrivate: false,
    icon: <RiseOutlined style={{ fontSize: "20px" }} />,
    nested: [
      {
        key: 4.1,
        path: "/rates-availability/rate-plans",
        label: "Rate Plans",
        icon: <ApartmentOutlined style={{ fontSize: "20px" }} />,
        component: <RatePlan />,
        permission: PERMISSIONS.RATE_PLAN_LIST,
      },
      {
        key: 4.2,
        path: "/rates-availability/room-inventory/",
        label: "Room Inventory",
        component: <RoomInventoryList />,
        icon: <FormOutlined style={{ fontSize: "20px" }} />,
        isPrivate: false,
        permission: PERMISSIONS.AVAILABILITY_CALENDAR_LIST,
      },
      {
        key: 4.4,
        label: "Meal Plan",
        path: "/rates-availability/meal-plan",
        icon: <JavaOutlined style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <MeanPlanList />,
        permission: PERMISSIONS.MEAL_PLAN_LIST,
      },
      {
        key: 4.5,
        label: "Seasonal Rate",
        path: "/rates-availability/seasonal-rate",
        icon: <DatabaseOutlined style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <SeasonalRate />,
        permission: PERMISSIONS.SEASONAL_RATE_LIST,
      },
    ],
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
    label: "Room Management",
    isPrivate: false,
    icon: <ShopOutlined style={{ fontSize: "20px" }} />,
    nested: [
      {
        key: 5.1,
        path: "/manage-rooms/room",
        label: "Rooms",
        icon: <ApartmentOutlined style={{ fontSize: "20px" }} />,
        component: <Room />,
        permission: PERMISSIONS.ROOM_LIST,
      },
      {
        key: 5.2,
        path: "/manage-rooms/room-type",
        label: "Room Types",
        icon: <AppstoreOutlined style={{ fontSize: "20px" }} />,
        component: <RoomType />,
        permission: PERMISSIONS.ROOM_TYPE_LIST,
      },
      {
        key: 5.3,
        path: "/manage-rooms/room-attribute",
        label: "Room Attributes",
        icon: <DiffOutlined style={{ fontSize: "20px" }} />,
        component: <RoomAttribute />,
        permission: PERMISSIONS.ROOM_ATTRIBUTE_LIST,
      },
      {
        key: 5.4,
        path: "/manage-rooms/floor",
        label: "Floors",
        icon: <LayoutOutlined style={{ fontSize: "20px" }} />,
        component: <Floor />,
        permission: PERMISSIONS.FLOOR_LIST,
      },
      {
        key: 5.5,
        label: "Amenities",
        path: "/amenities",
        icon: <FiMap style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <AmenitiesList />,
        permission: PERMISSIONS.AMENITY_LIST,
      },
    ],
  },

  {
    key: 6,
    label: "Guests",
    isPrivate: false,
    icon: <ShopOutlined style={{ fontSize: "20px" }} />,
    nested: [
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
    ],
  },
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
    label: "Staff Management",
    isPrivate: false,
    icon: <ShopOutlined style={{ fontSize: "20px" }} />,
    nested: [
      {
        key: 8.1,
        label: "Staffs",
        path: "/staff-management/staffs",
        icon: <ApartmentOutlined style={{ fontSize: "20px" }} />,
        component: <Staff />,
        permission: PERMISSIONS.STAFF_LIST,
      },
      {
        key: 8.2,
        label: "Departments",
        path: "/staff-management/departments",
        icon: <DatabaseOutlined style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <Department />,
        permission: PERMISSIONS.DEPARTMENT_LIST,
      },
    ],
  },
  {
    key: 9,
    label: "Inventory Management",
    isPrivate: false,
    icon: <AuditOutlined style={{ fontSize: "20px" }} />,
    nested: [
      // {
      //   key: 9.1,
      //   label: "Items",
      //   path: "/inventory-management/items",
      //   icon: <ApartmentOutlined style={{ fontSize: "20px" }} />,
      //   // component: < />,
      //   // permission: ".list",
      // },
      {
        key: 9.2,
        label: "Categories",
        path: "/inventory-management/category",
        icon: <TagsOutlined style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <CategoryListing />,
        permission: PERMISSIONS.CATEGORY_LIST,
      },
      {
        key: 9.3,
        label: "Units",
        path: "/inventory-management/unit",
        icon: <DeploymentUnitOutlined style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <UnitListing />,
        permission: PERMISSIONS.UNIT_LIST,
      },
      {
        key: 9.4,
        path: "/supplier",
        label: "Supplier",
        component: <SupplierList />,
        icon: <ApartmentOutlined style={{ fontSize: "20px" }} />,
        isPrivate: false,
        permission: PERMISSIONS.SUPPLIER_LIST,
      },
    ],
  },
  {
    key: 10,
    label: "Access Control",
    isPrivate: false,
    icon: <SafetyOutlined style={{ fontSize: "20px" }} />,
    nested: [
      {
        key: 10.1,
        label: "Admin Users",
        path: "/access-control/admin-users",
        icon: <UserOutlined style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <AdminList />,
        permission: PERMISSIONS.ADMIN_LIST,
      },
      {
        key: 10.2,
        label: "Roles",
        path: "/access-control/roles/",
        icon: <UserSwitchOutlined style={{ fontSize: "20px" }} />,
        component: <RolesListing />,
        permission: PERMISSIONS.ROLE_LIST,
      },
      {
        key: 10.3,
        label: "Permissions",
        path: "/access-control/permissions/",
        icon: <SecurityScanOutlined style={{ fontSize: "20px" }} />,
        component: <PermissionListing />,
        permission: PERMISSIONS.PERMISSION_LIST,
      },
    ],
  },
  {
    key: 11,
    label: "Room Operations",
    isPrivate: false,
    icon: <ShopOutlined style={{ fontSize: "20px" }} />,
    nested: [
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
    ],
  },
  {
    key: 12,
    label: "Facility Management",
    isPrivate: false,
    icon: <ShopOutlined style={{ fontSize: "20px" }} />,
    nested: [
      {
        key: 12.1,
        label: "Facilities",
        path: "/facility-management/facilities",
        icon: <ApartmentOutlined style={{ fontSize: "20px" }} />,
        component: <FacilityList />,
        permission: PERMISSIONS.FACILITY_LIST,
      },
      {
        key: 12.2,
        label: "Packages",
        path: "/facility-management/packages",
        icon: <DatabaseOutlined style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <FacilityPackageList />,
        permission: PERMISSIONS.FACILITY_PACKAGE_LIST,
      },
      // {
      //   key: 12.3,
      //   label: "Bookings",
      //   path: "/facility-management/bookings",
      //   icon: <DiffOutlined style={{ fontSize: "20px" }} />,
      //   // component: </>,
      //   // permission: ".list",
      // },
    ],
  },
  {
    key: 25,
    path: `/facility-management/facilities/:facilityId/packages`,
    component: <FacilityListPackagesTable />,
  },
  {
    key: 13,
    label: "Services Management",
    isPrivate: false,
    icon: <CustomerServiceOutlined style={{ fontSize: "20px" }} />,
    nested: [
      {
        key: 13.1,
        label: "Services",
        path: "/services-management/services",
        icon: <SecurityScanOutlined style={{ fontSize: "20px" }} />,
        component: <ServiceList />,
        // permission: PERMISSIONS.SERVICE_LIST,
      },
      {
        key: 13.2,
        label: "Inventories",
        path: "/services-management/inventory",
        icon: <DatabaseOutlined style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <ServiceInventoryListing />,
        permission: PERMISSIONS.SERVICE_INVENTORY_LIST,
      },
      // {
      //   key: 13.2,
      //   label: "Service Orders",
      //   path: "/services-management/service-orders",
      //   icon: <DatabaseOutlined style={{ fontSize: "20px" }} />,
      //   isPrivate: true,
      //   // component: < />,
      //   // permission: ".list",
      // },
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
    key: 14,
    label: "F&B  Management",
    isPrivate: false,
    icon: <CoffeeOutlined style={{ fontSize: "20px" }} />,
    nested: [
      {
        key: 14.1,
        label: "Menu Categories",
        path: "/f&b-management/menu-categories",
        icon: <ApartmentOutlined style={{ fontSize: "20px" }} />,
        component: <MenuCategoryList />,
        permission: PERMISSIONS.MENU_CATEGORY_LIST,
      },
      {
        key: 14.2,
        label: "Menu Items",
        path: "/f&b-management/menu-items",
        icon: <UnorderedListOutlined style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <MenuItemList />,
        permission: PERMISSIONS.MENU_ITEM_LIST,
      },
      {
        key: 14.3,
        label: "Menu Modifiers",
        path: "/f&b-management/menu-modifiers",
        icon: <MdOutlineRestaurantMenu style={{ fontSize: "20px" }} />,
        component: <MenuModifierList />,
        // permission: ".list",
      },
      {
        key: 14.4,
        path: "/f&b-management/restaurant-table",
        label: "Restaurant Table",
        component: <RestauranttableList />,
        icon: <FormOutlined style={{ fontSize: "20px" }} />,
        isPrivate: false,
        permission: PERMISSIONS.RESTAURANT_TABLE_LIST,
      },
      {
        key: 14.5,
        path: "/f&b-management/inventory/",
        label: "Inventory",
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
    key: 15,
    label: "Settings",
    isPrivate: false,
    icon: <SettingOutlined style={{ fontSize: "20px" }} />,
    nested: [
      {
        key: 15.1,
        label: "Properties",
        path: "/settings/properties",
        icon: <ApartmentOutlined style={{ fontSize: "20px" }} />,
        component: <PropertiesListing />,
        permission: PERMISSIONS.PROPERTY_LIST,
      },
      {
        key: 15.2,
        label: "Policies",
        path: "/settings/policies",
        icon: <FileProtectOutlined style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <PolicyList />,
        // permission: ".list",
      },
      // {
      //   key: 15.3,
      //   label: "NRC Data",
      //   path: "/settings/nrc-data",
      //   icon: <DiffOutlined style={{ fontSize: "20px" }} />,
      //   // component: < />,
      //   // permission: ".list",
      // },
      // {
      //   key: 15.4,
      //   label: "Currency",
      //   path: "/settings/currency",
      //   icon: <DiffOutlined style={{ fontSize: "20px" }} />,
      //   // component: </>,
      //   // permission: ".list",
      // },
      {
        key: 15.5,
        label: "Country & City",
        path: "/settings/country-city",
        icon: <DiffOutlined style={{ fontSize: "20px" }} />,
        component: <LocationList />,
        permission: PERMISSIONS.LOCATION_LIST,
      },
      {
        key: 15.6,
        label: "Privacy Policy / Terms & Conditions",
        path: "/settings/privacy-policy",
        icon: <FileProtectOutlined style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <PrivacyPolicy />,
        permission: PERMISSIONS.PRIVACY_POLICY_VIEW,
      },
    ],
  },
  {
    key: 16,
    label: "Billing & Finance",
    path: "/billing-finance",
    icon: <WalletOutlined style={{ fontSize: "20px" }} />,
    nested: [
      {
        key: 16.1,
        label: "Taxes",
        path: "/billing-finance/taxes",
        icon: <DollarOutlined style={{ fontSize: "20px" }} />,
        component: <Taxs />,
        permission: PERMISSIONS.TAX_LIST,
      },
      {
        key: 16.2,
        label: "Payment Methods",
        path: "/billing-finance/payment-method",
        icon: <MdPayments style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <PaymentList />,
        permission: PERMISSIONS.PAYMENT_LIST,
      },
    ],
  },
  {
    key: 17,
    label: "Partners",
    icon: <MdGroups3 style={{ fontSize: "20px" }} />,
    nested: [
      {
        key: 17.1,
        label: "Agencies",
        path: "/partners/agencies",
        icon: <BiGroup style={{ fontSize: "20px" }} />,
        component: <Agencies />,
      },
      {
        key: 17.2,
        label: "Companies",
        path: "/partners/company",
        icon: <BsBuildings style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <Company />,
      },
      {
        key: 17.3,
        label: "Referral Agents",
        path: "/partners/referral-agent",
        icon: <MdOutlineSupportAgent style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <ReferralAgent />,
      },
    ],
  },
  {
    key: 17.9,
    path: "/partners/agencies/:agencyId/agency-contract",
    component: <AgencyContractList />,
  },
  {
    key: 17.9,
    path: "/partners/company/:companyId/company-contract",
    component: <CompanyContractList />,
  },
  {
    key: 20,
    path: "/guest-list/",
    label: "Guests",
    component: <GuestListing />,
    icon: <UsergroupAddOutlined style={{ fontSize: "20px" }} />,
    isPrivate: false,
    permission: PERMISSIONS.GUEST_LIST,
  },
  {
    key: 25,
    path: `/guest-list/guest-notes/:guestId`,
    component: <GuestNotesListing />,
    permission: PERMISSIONS.GUEST_NOTE_LIST,
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
  {
    key: 24,
    path: "/reservation-form/",
    component: <ReservationForm />,
    isPrivate: false,
  },
  {
    key: 26,
    path: "/room-inventory/",
    label: "Room Inventory",
    component: <RoomInventoryList />,
    icon: <FormOutlined style={{ fontSize: "20px" }} />,
    isPrivate: false,
    permission: PERMISSIONS.AVAILABILITY_CALENDAR_LIST,
  },
  {
    key: 27,
    path: "/exta-bed-rate/",
    label: "Extra Bed Rate",
    component: <ExtraBedRateList />,
    icon: <FormOutlined style={{ fontSize: "20px" }} />,
    isPrivate: false,
    permission: PERMISSIONS.EXTRA_BED_RATE_LIST,
  },
  {
    key: 28,
    label: "Guest",
    path: "/guest",
    icon: <ApartmentOutlined style={{ fontSize: "20px" }} />,
    component: <GuestFileUpload />,
  },
];

const AuthRoutes = () => {
  const routesOptions = useMemo(() => {
    return _.flatten(
      _.map(authRoutes, (route) => (route.nested ? route.nested : route)),
    );
  }, []);

  return (
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AuthRoutes;
