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
const RoomPlan = lazy(() => import("../../pages/RoomPlan/RoomPlanList"));
const RoomType = lazy(() => import("../../pages/RoomType/RoomTypeList"));
const RoomList = lazy(() => import("../../pages/Room/RoomList"));
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

// const PaymentList = lazy(() => import("../../pages/Payment/PaymentList"));


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
    path: "/calendar/",
    label: "Calendar",
    icon: <CalendarOutlined style={{ fontSize: "20px" }} />,
    component: <Calendar />,
    isPrivate: false,
  },
  {
    key: 3,
    path: "/reservation/",
    label: "Reservation",
    icon: <ScheduleOutlined style={{ fontSize: "20px" }} />,
    component: <Reservation />,
    isPrivate: false,
  },
  {
    key: 3.1,
    path: "/add-reservation/",
    component: <ReservationForm />,
  },
  {
    key: 3.2,
    path: "/reservation/guest-details/",
    component: <Guest />,
  },
  {
    key: 4,
    label: "Admin",
    path: "/admins",
    icon: <UserOutlined style={{ fontSize: "20px" }} />,
    isPrivate: true,
    component: <AdminList />,
    permission: "admin.list",
  },
  {
    key: 4.1,
    path: "/admins/:mode/:id",
    isPrivate: false,
    // component: <AdminDetails />,
  },
  {
    key: 5,
    label: "Room Management",
    isPrivate: false,
    icon: <ShopOutlined style={{ fontSize: "20px" }} />,
    nested: [
      {
        key: 5.1,
        path: "/manage-rooms/room-plan",
        label: "Room Plan",
        icon: <ApartmentOutlined style={{ fontSize: "20px" }} />,
        component: <RoomPlan />,
        permission: "room-plan.list",
      },
      {
        key: 5.2,
        path: "/manage-rooms/room-type",
        label: "Room Type",
        icon: <AppstoreOutlined style={{ fontSize: "20px" }} />,
        component: <RoomType />,
        permission: "room-type.list",
      },
      {
        key: 5.3,
        path: "/manage-rooms/room-list",
        label: "Room List",
        icon: <UnorderedListOutlined style={{ fontSize: "20px" }} />,
        component: <RoomList />,
        permission: "room.list",
      },
      {
        key: 5.2,
        path: "/manage-rooms/floor",
        label: "Floor",
        icon: <LayoutOutlined style={{ fontSize: "20px" }} />,
        component: <Floor />,
        permission: "floor.list",
      },
    ],
  },
  {
    key: 6,
    label: "Role Management",
    isPrivate: false,
    icon: <TeamOutlined style={{ fontSize: "20px" }} />,
    nested: [
      {
        key: 6.1,
        path: "/permission-management/permissions/",
        label: "Permissions",
        icon: <SecurityScanOutlined style={{ fontSize: "20px" }} />,
        component: <PermissionListing />,
        // permission: "permission.list",
      },
      {
        key: 6.2,
        path: "/role-management/roles/",
        label: "Roles",
        icon: <UserSwitchOutlined style={{ fontSize: "20px" }} />,
        component: <RolesListing />,
        // permission: "role.list",
      },
    ],
  },
  {
    key: 7,
    path: "/property-management/properties",
    label: "Properties",
    icon: <PropertySafetyOutlined style={{ fontSize: "20px" }} />,
    component: <PropertiesListing />,
    permission: "property.list",
  },
  {
    key: 8,
    path: "/change-password/",
    component: <ChangePassword />,
    isPrivate: false,
  },
  {
    key: 9,
    path: "/profile/",
    component: <Profile />,
    isPrivate: false,
  },
  {
    key: 10,
    path: "/reservation-form/",
    component: <ReservationForm />,
    isPrivate: false,
  },
  {
    key: 10,
    label: "Location",
    path: "/location",
    icon: <EnvironmentOutlined style={{ fontSize: "20px" }} />,
    isPrivate: true,
    component: <LocationList />,
    permission: "location.list",
  },
  {
    key: 11,
    label: "Amenities",
    path: "/amenities",
    icon: <FiMap style={{ fontSize: "20px" }} />,
    isPrivate: true,
    component: <AmenitiesList />,
    permission: "amenity.list",
  },
  {
    key: 12,
    label: "Policy",
    path: "/policy",
    icon: <MdOutlinePolicy style={{ fontSize: "20px" }} />,
    isPrivate: true,
    component: <PolicyList />,
    permission: "policy.list",
  },
  {
    key: 13,
    label: "Privacy Policy",
    path: "/privacy-policy",
    icon: <FileProtectOutlined style={{ fontSize: "20px" }} />,
    isPrivate: true,
    component: <PrivacyPolicy />,
    // permission: "privacy-policy.list",
  },
  {
    key: 13,
    label: "Category",
    path: "/category",
    icon: <TagsOutlined style={{ fontSize: "20px" }} />,
    isPrivate: true,
    component: <CategoryListing />,
    // permission: "category.list",
  },
  {
    key: 14,
    label: "Units",
    path: "/unit",
    icon: <DeploymentUnitOutlined style={{ fontSize: "20px" }} />,
    isPrivate: true,
    component: <UnitListing />,
    // permission: "unit.list",
  },
  {
    key: 15,
    label: "Inventories",
    path: "/inventory",
    icon: <DatabaseOutlined style={{ fontSize: "20px" }} />,
    isPrivate: true,
    component: <InventoryListing />,
    // permission: "inventory.list",
  },
  {
    key: 14,
    label: "Services",
    path: "/services",
    icon: <CustomerServiceOutlined style={{ fontSize: "20px" }} />,
    component: <ServiceList />,
    // permission: "service.list",
  },
  {
    key: 16,
    label: "Meal Plan",
    path: "/meal-plan",
    icon: <MdOutlinePolicy style={{ fontSize: "20px" }} />,
    isPrivate: true,
    component: <MeanPlanList />,
    // permission: "meal-plan.list",
  },

  // {
  //   key: 17,
  //   label: "Payment",
  //   path: "/payment",
  //   icon: <MdPayments style={{ fontSize: "20px" }} />,
  //   isPrivate: true,
  //   component: <PaymentList />,
  //   // permission:"meal-plan.list",
  // },
  {
    key: 16,
    label: "Billing & Finance",
    path: "/billing-finance",
    icon: <WalletOutlined style={{ fontSize: "20px" }} />,
    // component: <ServiceList />,
    // permission: "service.list",
    nested: [
      {
        key: 16.1,
        path: "/billing-finance/taxes",
        label: "Taxes",
        icon: <DollarOutlined style={{ fontSize: "20px" }} />,
        component: <Taxs />,
        // permission: "guests.list",
      },
    ],
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
