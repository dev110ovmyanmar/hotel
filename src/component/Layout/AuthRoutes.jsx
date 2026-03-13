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
} from "@ant-design/icons";
import { lazy } from "react";
import { FiMap } from "react-icons/fi";
import { MdOutlinePolicy } from "react-icons/md";
import { MdPayments } from "react-icons/md";

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
const InventoryListing = lazy(
  () => import("../../pages/Inventories/InventoryListing"),
);

const MeanPlanList = lazy(() => import("../../pages/MealPlan/MealPlanList"));

const PaymentList = lazy(() => import("../../pages/Payment/PaymentList"));

const Taxs = lazy(() => import("../../pages/Tax/TaxList"));

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
    key: 4,
    label: "Rates & Availability",
    isPrivate: false,
    icon: <RiseOutlined style={{ fontSize: "20px" }} />,
    nested: [
      // {
      //   key: 4.1,
      //   path: "/rates-availability/rate-plans",
      //   label: "Rate Plans",
      //   icon: <ApartmentOutlined style={{ fontSize: "20px" }} />,
      //   // component: < />,
      //   // permission: ".list",
      // },
      {
        key: 4.2,
        label: "Inventories",
        path: "/rates-availability/inventory",
        icon: <DatabaseOutlined style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <InventoryListing />,
        // permission: ".list",
      },
      // {
      //   key: 4.3,
      //   path: "/rates-availability/",
      //   label: "Restrictions / Stop Sell",
      //   icon: <DiffOutlined style={{ fontSize: "20px" }} />,
      //   // component: </>,
      // },
    ],
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
        permission: "room.list",
      },
      {
        key: 5.2,
        path: "/manage-rooms/room-type",
        label: "Room Types",
        icon: <AppstoreOutlined style={{ fontSize: "20px" }} />,
        component: <RoomType />,
        permission: "room-type.list",
      },
      {
        key: 5.3,
        path: "/manage-rooms/room-attribute",
        label: "Room Attributes",
        icon: <DiffOutlined style={{ fontSize: "20px" }} />,
        component: <RoomAttribute />,
      },
      {
        key: 5.4,
        path: "/manage-rooms/floor",
        label: "Floors",
        icon: <LayoutOutlined style={{ fontSize: "20px" }} />,
        component: <Floor />,
        permission: "floor.list",
      },
      {
        key: 5.5,
        label: "Amenities",
        path: "/amenities",
        icon: <FiMap style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <AmenitiesList />,
        permission: "amenity.list",
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
  {
    key: 7,
    label: "Partners",
    isPrivate: false,
    icon: <ShopOutlined style={{ fontSize: "20px" }} />,
    nested: [
      // {
      //   key: 7.1,
      //   label: "Agencies",
      //   path: "/partners/agencies",
      //   icon: <ApartmentOutlined style={{ fontSize: "20px" }} />,
      //   // component: < />,
      //   // permission: ".list",
      // },
      // {
      //   key: 7.2,
      //   label: "Companies",
      //   path: "/partners/companies",
      //   icon: <DatabaseOutlined style={{ fontSize: "20px" }} />,
      //   isPrivate: true,
      //   // component: < />,
      //   // permission: ".list",
      // },
      // {
      //   key: 7.3,
      //   label: "Referral Agents",
      //   path: "/partners/referral-agents",
      //   icon: <DiffOutlined style={{ fontSize: "20px" }} />,
      //   // component: </>,
      //   // permission: ".list",
      // },
    ],
  },
  {
    key: 8,
    label: "Staff Management",
    isPrivate: false,
    icon: <ShopOutlined style={{ fontSize: "20px" }} />,
    nested: [
      // {
      //   key: 8.1,
      //   label: "Staffs",
      //   path: "/staff-management/staffs",
      //   icon: <ApartmentOutlined style={{ fontSize: "20px" }} />,
      //   // component: < />,
      //   // permission: ".list",
      // },
      // {
      //   key: 8.2,
      //   label: "Departments",
      //   path: "/staff-management/departments",
      //   icon: <DatabaseOutlined style={{ fontSize: "20px" }} />,
      //   isPrivate: true,
      //   // component: < />,
      //   // permission: ".list",
      // },
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
      },
      {
        key: 9.3,
        label: "Units",
        path: "/inventory-management/unit",
        icon: <DeploymentUnitOutlined style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <UnitListing />,
        // permission: "unit.list",
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
        permission: "admin.list",
      },
      {
        key: 10.2,
        label: "Roles",
        path: "/access-control/roles/",
        icon: <UserSwitchOutlined style={{ fontSize: "20px" }} />,
        component: <RolesListing />,
        // permission: "role.list",
      },
      {
        key: 10.3,
        label: "Permissions",
        path: "/access-control/permissions/",
        icon: <SecurityScanOutlined style={{ fontSize: "20px" }} />,
        component: <PermissionListing />,
        // permission: "permission.list",
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
      // {
      //   key: 12.1,
      //   label: "Facilities",
      //   path: "/facility-management/facilities",
      //   icon: <ApartmentOutlined style={{ fontSize: "20px" }} />,
      //   // component: < />,
      //   // permission: ".list",
      // },
      // {
      //   key: 12.2,
      //   label: "Packages",
      //   path: "/facility-management/packages",
      //   icon: <DatabaseOutlined style={{ fontSize: "20px" }} />,
      //   isPrivate: true,
      //   // component: < />,
      //   // permission: ".list",
      // },
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
        // permission: ".list",
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
    icon: <ShopOutlined style={{ fontSize: "20px" }} />,
    nested: [
      // {
      //   key: 14.1,
      //   label: "Menu Categories",
      //   path: "/f&b-management/menu-categories",
      //   icon: <ApartmentOutlined style={{ fontSize: "20px" }} />,
      //   // component: < />,
      //   // permission: ".list",
      // // },
      // {
      //   key: 14.2,
      //   label: "Menu Items",
      //   path: "/f&b-management/menu-items",
      //   icon: <DatabaseOutlined style={{ fontSize: "20px" }} />,
      //   isPrivate: true,
      //   // component: < />,
      //   // permission: ".list",
      // },
      // {
      //   key: 14.3,
      //   label: "Menu Modifiers",
      //   path: "/f&b-management/menu-modifiers",
      //   icon: <DiffOutlined style={{ fontSize: "20px" }} />,
      //   // component: < />,
      //   // permission: ".list",
      // },
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
        // permission: ".list",
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
        component: <ServiceList />,
        // permission: ".list",
      },
      {
        key: 15.6,
        label: "Privacy Policy / Terms & Conditions",
        path: "/settings/privacy-policy",
        icon: <FileProtectOutlined style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <PrivacyPolicy />,
        // permission: ".list",
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
        // permission: "Taxs.list",
      },
      {
        key: 16.2,
        label: "Payment Methods",
        path: "/billing-finance/payment-method",
        icon: <MdPayments style={{ fontSize: "20px" }} />,
        isPrivate: true,
        component: <PaymentList />,
        // permission:"meal-plan.list",
      },
    ],
  },
  {
    key: 17,
    label: "Location",
    path: "/location",
    icon: <EnvironmentOutlined style={{ fontSize: "20px" }} />,
    isPrivate: true,
    component: <LocationList />,
    permission: "location.list",
  },

  {
    key: 19,
    label: "Meal Plan",
    path: "/meal-plan",
    icon: <JavaOutlined style={{ fontSize: "20px" }} />,
    isPrivate: true,
    component: <MeanPlanList />,
    // permission: "meal-plan.list",
  },
  {
    key: 20,
    path: "/change-password/",
    component: <ChangePassword />,
    isPrivate: false,
  },
  {
    key: 21,
    path: "/profile/",
    component: <Profile />,
    isPrivate: false,
  },
  {
    key: 22,
    path: "/reservation-form/",
    component: <ReservationForm />,
    isPrivate: false,
  },
];

const AuthRoutes = () => {
  // const routesOptions = _.flatten(
  //   _.map(authRoutes, (route) => {
  //     if (route.nested) {
  //       return route.nested;
  //     }
  //     return route;
  //   }),
  // );

  // Flatten routes including nested ones

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
            // key={option.key}
            // path={`/${option?.path}`}
            // element={option.component}

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
