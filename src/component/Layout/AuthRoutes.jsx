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
} from "@ant-design/icons";
import { lazy } from "react";
import AdminList from "../../pages/Admins/AdminList";

const Dashboard = lazy(() => import("../../pages/Dashboard/Dashboard"));
const Calendar = lazy(() => import("../../pages/Calendar/Calendar"));
// const Reservation = lazy(() => import("../../pages/Reservation/Reservation"));
const Booking = lazy(() => import("../../pages/Booking/Booking"));
const Room = lazy(() => import("../../pages/Room/RoomList"));
const Floor = lazy(() => import("../../pages/Floor/FloorList"));
const ChangePassword = lazy(
  () => import("../../pages/Authentication/ChangePassword/ChangePasswordPage"),
);
const Profile = lazy(() => import("../../pages/Profile/ProfilePage"));
const ReservationForm = lazy(
  () => import("../../pages/Reservation/ReservationForm"),
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
        path: "/manage-rooms/room",
        label: "Room",
        icon: <IdcardOutlined style={{ fontSize: "20px" }} />,
        component: <Room />,
      },
      {
        key: 5.1,
        path: "/manage-rooms/floor",
        label: "Floor",
        icon: <IdcardOutlined style={{ fontSize: "20px" }} />,
        component: <Floor />,
      },
    ],
  },
  {
    key: 6,
    path: "/change-password/",
    component: <ChangePassword />,
    isPrivate: false,
  },
  {
    key: 7,
    path: "/profile/",
    component: <Profile />,
    isPrivate: false,
  },
  {
    key: 8,
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
