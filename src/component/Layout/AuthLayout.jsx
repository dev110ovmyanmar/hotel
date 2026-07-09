import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Layout, Modal, Divider } from "antd";
import Sidebar from "../Sidebar/Sidebar";
import AuthRoutes from "./AuthRoutes";
import { Footer } from "antd/es/layout/layout";
import Topbar from "../Topbar/Topbar";
import { appSelector, toggleAll, sessionExpired as setSessionExpiredAction } from "../../services/appSlice";
import useWindowSize from "../../hooks/useWindowSize";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import { queryClient } from './../../app/queryClient';
// import GlobalIcon from "../GlobalIcon/GlobalIcon";


const { confirm } = Modal;

const { Content } = Layout;

const AuthLayout = () => {
  const dispatch = useDispatch();

  // Theme Header Colors
  // const [headerColor, setHeaderColor] = useState(localStorage.getItem("headerColor"));
  // Sidebar Theme Color
  // const [sideBarColor, setSideBarColor] = useState(localStorage.getItem("sideBarColor"));
  // Footer Theme Color
  // const [footerColor, setFooterColor] = useState(localStorage.getItem("footerColor"));



  const { height: appHeight, sessionExpired } = useSelector(appSelector);

  const { width, height } = useWindowSize();


  useEffect(() => {
    dispatch(toggleAll({ width, height }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, dispatch]);

  useEffect(() => {
    if (sessionExpired) {
      showConfirm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionExpired]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "SessionId" && e.newValue) {
        dispatch(setSessionExpiredAction(false));
        Modal.destroyAll();
        // Reload to ensure all APIs are called with the fresh token
        window.location.reload();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [dispatch]);

  const showConfirm = () => {
    confirm({
      title: "Session Expired!",
      content: "Your session has been expired, please login again.",
      onOk() {
        logout();
      },
      okText: "Login",
      cancelButtonProps: {
        style: {
          display: "none",
        },
      },
    });
  };

  const logout = () => {
    localStorage.clear();
    queryClient.clear();
    // window.location.href = '/dashboard/login';
    window.location.href = "/";
  };

  return (
    <>
      <Layout style={{ height: height }}>
        {/* <Topbar headerColor={headerColor} /> */}
        <Topbar/>
        <Layout className="flex-row overflow-x-hidden">
          {/* <Sidebar sideBarColor={sideBarColor} /> */}
          <Sidebar />
          <Layout
            className="overflow-hidden border-l border-gray-300 shrink-0 w-full md:w-[calc(100% - 80px)]"
            style={{
              height: appHeight,
            }}
          >
            <Content
              className="bg-content mt-[70px] shrink-0 relative overflow-auto"
              style={{ height: "calc(100vh - 140px)" }}
              id="list-root"
            >
              <Breadcrumbs />
              <Divider className="custom-divider" />
              <AuthRoutes />
            </Content>
            {/* <Footer className={`text-center text-md bg-white border-t border-gray-300 ${footerColor}`}> */}
            <Footer className="text-center text-md bg-white border-t border-gray-300">
              Hotel Management @ 2026 Developed by ORIENTAL VIGOUR
            </Footer>
          </Layout>
        </Layout>
      </Layout>

      {/* <GlobalIcon
        headerColor={headerColor}
        setHeaderColor={setHeaderColor}
        sideBarColor={sideBarColor}
        setSideBarColor={setSideBarColor}
        footerColor={footerColor}
        setFooterColor={setFooterColor}
      /> */}
    </>
  );
};
export default AuthLayout;
