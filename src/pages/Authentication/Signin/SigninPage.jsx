import React, { useEffect, useState } from "react";
import { Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { saveState } from "../../../utils";
import { LOCAL_STORAGE_KEYS } from "../../../variables/constants";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { login } from "../../../api/authApi";
import signIn from "../../../assets/images/signIn.jpg";
import whiteLogo from "../../../assets/images/whiteLogo.png";

import { queryClient } from "../../../app/queryClient";
import { fetchInitData } from "../../../api/initDataApi";
import { setUserData } from "../../../services/authSlice";
import { useDispatch } from "react-redux";
import Toast from "../../../component/Toast/Toast";
import NetworkErrorPage from "../../../component/NetworkErrorPage/NetworkErrorPage";

export default function SignIn() {
  const [ipAddress, setIpAddress] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mutate, isPending } = useApiMutation({
    mutationFn: login,
    options: {
      onSuccess: async (data) => {
        try {
          saveState(LOCAL_STORAGE_KEYS.sessionId, data.XSessionToken);
          saveState(LOCAL_STORAGE_KEYS.adminRole, data.role.name);
          saveState(LOCAL_STORAGE_KEYS.loginAdminDetails, data);

          // Fetch the AUTHENTICATED version of initData
          const initData = await queryClient.fetchQuery({
            queryKey: ["initData", "authenticated"],
            queryFn: fetchInitData,
            staleTime: 24 * 60 * 60 * 1000,
            gcTime: 24 * 60 * 60 * 1000,
            meta: { persist: true },
          });

          if (initData) {
            const permissions = saveState(
              LOCAL_STORAGE_KEYS.initPermissions,
              initData.permissions,
            );
            dispatch(setUserData({ permissions }));

            // Clean up any 'public' data leftover in the cache
            queryClient.removeQueries({ queryKey: ["initData", "public"] });
            navigate("/dashboard", { replace: true });
          }
        } catch (error) {
          console.error("InitData failed after login:", error);
        }
      },
    },
  });

  useEffect(() => {
    const fetchIPAddress = async () => {
      try {
        // don't allow cross-origin requests
        // const response = await fetch("https://ipapi.co/json/");

        //allow cross-origin requests.
        const response = await fetch("https://api.ipify.org/?format=json");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json(); // Parse JSON from the response
        setIpAddress(data.ip); // Update state with the IP address
      } catch (error) {
        console.error("Error fetching IP address:", error);
      }
    };

    fetchIPAddress(); // Call the function
  }, []);

  const handleLogin = (values) => {
    mutate({
      ...values,
      ipAddress,
    });
  };

  return (
    <>
      <NetworkErrorPage />
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${signIn})` }}
      >
        <div
          className="w-full max-w-md mx-auto backdrop-blur-xl rounded-xl shadow-2xl px-8 py-10 border"
          style={{ borderColor: "#fff" }}
        >
          <div className="text-center mb-6">
            <div className="flex justify-center">
              <img src={whiteLogo} alt="logo" className="max-w-[200px]" />
            </div>
            <p className="text-amber-50/100 font-medium tracking-widest text-base mt-6">
              Property Management System
            </p>
          </div>
          <h2 className="text-center text-amber-50/90 text-xl tracking-wide font-medium mb-6">
            Login
          </h2>

          <Form layout="vertical" onFinish={handleLogin}>
            <Form.Item
              label={<span style={{ color: "#ffffff" }}>Email</span>}
              name="email"
              rules={[{ required: true, message: "Email is required" }]}
              className="text-amber-50"
            >
              <Input
                size="large"
                placeholder="example123@gmail.com"
                className="!bg-white/10 !text-amber-50 !rounded-md placeholder:!text-gray-400"
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ color: "#ffffff" }}>Password</span>}
              name="password"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password
                size="large"
                placeholder="password"
                className="!bg-white/10 !text-amber-50 !rounded-md [&_input]:placeholder:!text-gray-400"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isPending}
              size="large"
              className="!rounded-md mt-5"
            >
              Login
            </Button>
          </Form>
          <p className="text-center text-gray-300 text-sm mt-8">
            © Oriental Vigour 2026. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}
