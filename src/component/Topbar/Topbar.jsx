import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Layout } from "antd";
import withDirection from "../../utils/rtl.jsx";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  API_URL,
  BASE_PATH,
  SERVER_ERROR_CODES,
} from "../../variables/constants";
import axios from "axios";
import Toast from "../Toast/Toast";
import { appSelector, toggleCollapsed } from "../../services/appSlice.js";

const { Header } = Layout;

const Topbar = withDirection(function (props) {

  const { collapsed, openDrawer } = useSelector(appSelector);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleToggle = useCallback(
    () => dispatch(toggleCollapsed()),
    [dispatch],
  );

  const isCollapsed = collapsed && !openDrawer;

  return (
    <Header
      className={`bg-white! fixed w-full h-[100px] flex justify-between z-1000 border-b border-gray transition-all ${
        isCollapsed
          ? props["data-rtl"] === "rtl"
            ? "px-[15px] md:pl-[31px] md:pr-[109px]!"
            : "px-[15px] md:pr-[31px] md:pl-[109px]!"
          : props["data-rtl"] === "rtl"
            ? "pl-[260px] pr-[15px] md:pl-[265px] md:pr-[31px]!"
            : "pr-[15px] pl-[260px] md:pr-[31px] md:pl-[265px]!"
      }`}
    >

      <div className="flex items-center gap-4">
        <div className="cursor-pointer" onClick={handleToggle}>
          {isCollapsed ? (
            <MenuUnfoldOutlined className="text-xl" />
          ) : (
            <MenuFoldOutlined className="text-xl" />
          )}
        </div>
        <div className="text-lg font-bold">Azura Hotel PMS</div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-6">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="middle"
          iconPlacement="end"
          className="bg-purple-600 hover:bg-purple-700 border-none"
        >
          Add Reservation
        </Button>

        {/* Print Reservation Button */}
        <Button
          type="default"
          icon={<PrinterOutlined />}
          size="middle"
          iconPlacement="end"
          className="bg-gray-200 hover:bg-gray-300 border-none text-gray-700"
        >
          Print Reservation
        </Button>
        <div className="relative cursor-pointer">
          <span className="w-2.5 h-2.5 bg-red-500 rounded-full absolute -top-1 -right-1 animate-pulse"></span>
          {/* Replace with notification icon */}
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
        </div>
        <div className="relative group cursor-pointer">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-300"></div>
            <span className="hidden md:block text-gray-700 font-medium">
              Admin
            </span>
          </div>
        </div>
      </div>
    </Header>
  );
});

export default Topbar;
