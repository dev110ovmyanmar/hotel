/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loader from "../../component/Loader/Loader";
import NotFound from "../../pages/404/NotFound";
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
} from "@ant-design/icons";
import { lazy } from "react";
import AdminList from "../../pages/Admins/AdminList";

const Dashboard = lazy(() => import("../../pages/Dashboard/Dashboard"));
const Calendar = lazy(() => import("../../pages/Calendar/Calendar"));
// const Reservation = lazy(() => import("../../pages/Reservation/Reservation"));
const Booking = lazy(() => import("../../pages/Booking/Booking"));
const RoomPlan = lazy(() => import("../../pages/RoomPlan/RoomPlanList"));
const RoomType = lazy(() => import("../../pages/RoomType/RoomTypeList"));
const RoomList = lazy(() => import("../../pages/Room/RoomList"));
const Floor = lazy(() => import("../../pages/Floor/FloorList"));
const ChangePassword = lazy(
  () => import("../../pages/Authentication/ChangePassword/ChangePasswordPage"),
);
const Profile = lazy(() => import("../../pages/Profile/ProfilePage"));
const ReservationForm = lazy(
  () => import("../../pages/Reservation/ReservationForm"),
);
const PermissionListing = lazy(() => import("../../pages/Permissions/PermissionsListing"));
const RolesListing = lazy(() => import("../../pages/Roles/RolesListing"));
const PropertiesListing = lazy(() => import("../../pages/Properties/PropertiesListing"));


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
  // {
  //   key: 3,
  //   path: "/reservation/",
  //   label: "Reservation",
  //   icon: <ScheduleOutlined style={{ fontSize: "20px" }} />,
  //   component: <Reservation />,
  //   isPrivate: false,
  // },
  {
    key: 4,
    label: "Admin",
    path: "/admins",
    icon: <UserOutlined style={{ fontSize: "20px" }} />,
    isPrivate: true,
    component: <AdminList />,
  },
  {
    key: 4.1,
    path: "/admins/:mode/:id",
    isPrivate: false,
    // component: <AdminDetails />,
  },
  {
    key: 5,
    label: "Manage Rooms",
    isPrivate: false,
    icon: <ShopOutlined style={{ fontSize: "20px" }} />,
    nested: [
      {
        key: 5.1,
        path: "/manage-rooms/room-plan",
        label: "Room Plan",
        icon: <IdcardOutlined style={{ fontSize: "20px" }} />,
        component: <RoomPlan />,
      },
      {
        key: 5.2,
        path: "/manage-rooms/room-type",
        label: "Room Type",
        icon: <IdcardOutlined style={{ fontSize: "20px" }} />,
        component: <RoomType />,
      },
      {
        key: 5.3,
        path: "/manage-rooms/room-list",
        label: "Room List",
        icon: <IdcardOutlined style={{ fontSize: "20px" }} />,
        component: <RoomList />,
      },
      {
        key: 5.2,
        path: "/manage-rooms/floor",
        label: "Floor",
        icon: <IdcardOutlined style={{ fontSize: "20px" }} />,
        component: <Floor />,
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
        component: <PermissionListing />
      },
      {
        key: 6.2,
        path: "/role-management/roles/",
        label: "Roles",
        icon: <UserSwitchOutlined style={{ fontSize: "20px" }} />,
        component: <RolesListing />
      },
    ],
  },
  {
    key: 7,
    path: "/property-management/properties",
    label: "Properties",
    icon: <UserSwitchOutlined style={{ fontSize: "20px" }} />,
    component: <PropertiesListing/>,
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
];

const AuthRoutes = () => {
  const routesOptions = _.flatten(
    _.map(authRoutes, (route) => {
      if (route.nested) {
        return route.nested;
      }
      return route;
    }),
  );

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
            path={`/${option?.path}`}
            element={option.component}
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AuthRoutes;
