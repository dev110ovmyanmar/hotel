import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Layout, Modal } from "antd";
import Sidebar from "../Sidebar/Sidebar";
import AuthRoutes from "./AuthRoutes";

import { Footer } from "antd/es/layout/layout";
import Topbar from "../Topbar/Topbar";
import { appSelector, toggleAll } from "../../services/appSlice";
import useWindowSize from "../../hooks/useWindowSize";

const { confirm } = Modal;

const { Content } = Layout;

const AuthLayout = () => {

  const dispatch = useDispatch();

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

  const showConfirm = () => {
    confirm({
      title: 'Session Expired!',
      content: 'Your session has been expired, please login again.',
      onOk() {
        logout()
      },
      okText: "Login",
      cancelButtonProps: {
        style: {
          display: "none"
        }
      }
    });
  };

  const logout = () => {
    localStorage.clear();
    // window.location.href = '/dashboard/login';
    window.location.href = "/";
  }

  return (
    <>
      <Layout style={{ height: height }}>
        <Topbar />
        <Layout className="flex-row overflow-x-hidden">
          <Sidebar />
          <Layout
            className="overflow-hidden border-l shrink-0 w-full md:w-[calc(100% - 80px)]"
            style={{
              height: appHeight,
            }}
          >
            <Content className="bg-content mt-[70px] shrink-0 relative overflow-auto" style={{ height: "calc(100vh - 140px)" }} id="list-root">
              <AuthRoutes />
            </Content>
            <Footer className="text-center text-md bg-white border-t">Hotel Management @ 2026 Developed by ORIENTAL VIGOUR</Footer>
          </Layout>
        </Layout>
      </Layout>
    </>
  );
};
export default AuthLayout;
