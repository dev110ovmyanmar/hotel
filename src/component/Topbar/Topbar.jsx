import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Layout, Drawer, Popover, Modal } from "antd";
import withDirection from "../../utils/rtl.jsx";
import {
  LockOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  PlusOutlined,
  PrinterOutlined,
  SunOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  appSelector,
  toggleCollapsed,
  toggleTheme,
} from "../../services/appSlice.js";
import ChangePasswordPage from "../../pages/Authentication/ChangePassword/ChangePasswordPage.jsx";
import ProfilePage from "../../pages/Profile/ProfilePage.jsx";
import { useCallback, useState } from "react";
import { adminLogout } from "../../api/logoutApi.js";
import { useApiMutation } from "../../hooks/useApiMutation.js";
import { ReloadOutlined } from "@ant-design/icons";
import { queryClient } from "../../app/queryClient.js";
import { setUserData } from "../../services/authSlice.js";

const { Header } = Layout;

const Topbar = withDirection(function (props) {
  const { collapsed, openDrawer, theme } = useSelector(appSelector);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [passwordDrawerOpen, setPasswordDrawerOpen] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefetchInitData = async () => {
    try {
      setRefreshing(true);

      await queryClient.refetchQueries({
        queryKey: ["initData", "authenticated"],
        exact: true, // Only refresh the logged-in data
      });

      const freshData = queryClient.getQueryData(["initData", "authenticated"]);

      if (freshData?.permissions) {
        dispatch(setUserData({ permissions: freshData.permissions }));
      }

    } catch (error) {
      console.error("Refetch failed", error);
    } finally {
      setRefreshing(false);
    }
  };

  const logout = useApiMutation({
    mutationFn: adminLogout,
  });

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout.mutateAsync();
      queryClient.clear();
      localStorage.clear();
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
      setIsOpenModal(false);
    }
  };

  const handleModalOpen = () => {
    setIsOpenModal(true);
  };

  const cancelButton = () => {
    setIsOpenModal(false);
  };

  const handleToggle = useCallback(
    () => dispatch(toggleCollapsed()),
    [dispatch],
  );

  const handleMenuClick = (action) => {
    if (action === "profile") {
      setProfileDrawerOpen(true);
    } else if (action === "password") {
      setPasswordDrawerOpen(true);
    } else if (action === "logout") {
      console.log("Logout clicked");
    }
    setPopoverOpen(false);
  };

  const closePasswordDrawer = () => setPasswordDrawerOpen(false);
  const closeProfileDrawer = () => setProfileDrawerOpen(false);

  const isCollapsed = collapsed && !openDrawer;

  const dropdownContent = (
    <div className="bg-white rounded-md shadow-md min-w-45 z-999">
      <ul>
        <li
          className="flex cursor-pointer p-2.5 pl-0 ml-3 mt-4"
          onClick={() => handleMenuClick("profile")}
        >
          <UserOutlined className="mr-2" />
          <span>Profile</span>
        </li>

        <li
          className="flex cursor-pointer p-2.5 pl-0 ml-3"
          onClick={() => handleMenuClick("password")}
        >
          <LockOutlined className="mr-2" />
          <span>Change Password</span>
        </li>

        <li
          className="flex cursor-pointer p-2.5 pl-0 ml-3"
          onClick={handleModalOpen}
        >
          <LogoutOutlined className="mr-2" />
          <span>Logout</span>
        </li>
      </ul>
    </div>
  );

  return (
    <>
      <Header
        className={`bg-white! fixed w-full h-25 flex justify-between z-1000 border-b border-gray-300 transition-all ${
          isCollapsed
            ? props["data-rtl"] === "rtl"
              ? "px-[15px] md:pl-[31px] md:pr-[109px]!"
              : "px-[15px] md:pr-[31px] md:pl-[109px]!"
            : props["data-rtl"] === "rtl"
              ? "pl-[260px] pr-[15px] md:pl-[265px] md:pr-[31px]!"
              : "pr-[15px] pl-[260px] md:pr-[31px] md:pl-[265px]!"
        }`}
      >
        {/* Left Section */}
        <div className="flex items-center py-2 gap-2">
          <div className="cursor-pointer mt-1" onClick={handleToggle}>
            {isCollapsed ? (
              <MenuUnfoldOutlined className="text-xl" />
            ) : (
              <MenuFoldOutlined className="text-xl" />
            )}
          </div>
          <div className="text-sm sm:text-base md:text-lg lg:text-xl font-bold whitespace-nowrap">
            Azura Hotel PMS
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="middle"
            className="bg-purple-600 hover:bg-purple-700 border-none ml-7"
            onClick={() => navigate("/add-reservation")}
          >
            Add Reservation
          </Button>

          <Button
            type="default"
            icon={<PrinterOutlined />}
            size="middle"
            className="bg-gray-200 hover:bg-gray-300 border-none text-gray-700"
          >
            Print Reservation
          </Button>

          <Button
            type="text"
            icon={
              theme === "light" ? (
                <MoonOutlined style={{ fontSize: 20, marginTop: 30  }} />
              ) : (
                <SunOutlined style={{ fontSize: 20 }} />
              )
            }
            onClick={() => dispatch(toggleTheme())}
            className="text-black dark:text-white transition-all duration-300 rotate-0 dark:rotate-180"
          />

          <Button
            type="text"
            loading={refreshing}
            icon={<ReloadOutlined style={{ fontSize: 18, marginTop: 30  }} />}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700"
            onClick={handleRefetchInitData}
          />

          {/* <div className="relative cursor-pointer">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full absolute -top-1 -right-1 animate-pulse"></span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a1 1 0 10-2 0v.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div> */}

          <Popover
            content={dropdownContent}
            trigger="click"
            placement="bottomLeft"
            open={popoverOpen}
            onOpenChange={(open) => setPopoverOpen(open)}
          >
            <Modal
              title="Are you sure you want to logout?"
              open={isOpenModal}
              onOk={handleLogout}
              okText="Log out"
              okButtonProps={{
                loading: loading,
              }}
              onCancel={cancelButton}
            />

            <div className="cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full  flex items-center justify-center">
                  <UserOutlined />
                </div>
                <span className="hidden md:block text-gray-700 font-medium">
                  Admin
                </span>
              </div>
            </div>
          </Popover>
        </div>
      </Header>

      <Drawer
        title="Change Password"
        placement="right"
        size={500}
        onClose={closePasswordDrawer}
        open={passwordDrawerOpen}
      >
        <ChangePasswordPage onClose={closePasswordDrawer} />
      </Drawer>
      <Drawer
        title="Profile"
        placement="right"
        size={500}
        onClose={closeProfileDrawer}
        open={profileDrawerOpen}
      >
        <ProfilePage onClose={closeProfileDrawer} />
      </Drawer>
    </>
  );
});

export default Topbar;
