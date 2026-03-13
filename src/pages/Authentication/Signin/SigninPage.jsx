import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { saveState } from "../../../utils";
import { LOCAL_STORAGE_KEYS } from "../../../variables/constants";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { login } from "../../../api/authApi";
import signin from "../../../assets/images/signin.png";
import hotellogotext from "../../../assets/images/hotellogotext.png";

import { queryClient } from "../../../app/queryClient";
import { fetchInitData } from "../../../api/initDataApi";
import { setUserData } from "../../../services/authSlice";
import { useDispatch } from "react-redux";

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

          // Prefetch initData (now header will include token)
          //prefetchQuery => only cache
          //fetchQuery => cache + return data
          const initData = await queryClient.fetchQuery({
            queryKey: ["initData"],
            queryFn: fetchInitData,
            staleTime: 24 * 60 * 60 * 1000,
            gcTime: 24 * 60 * 60 * 1000,
            meta: { persist: true },
          });

          const permissions = saveState(
            LOCAL_STORAGE_KEYS.initPermissions,
            initData.permissions,
          );
          saveState(LOCAL_STORAGE_KEYS.adminRole, data.role.name);

          // Store in Redux
          dispatch(setUserData({ permissions }));

          // Navigate without reload
          navigate("/dashboard", { replace: true });
        } catch (error) {
          console.error("InitData failed:", error);
        }
      },
    },
  });

  const handleLogin = (values) => {
    mutate({
      ...values,
      ipAddress,
    });
  };

  return (
    // <div className="min-h-screen flex items-center justify-center">
    //   <div className="w-full max-w-8xl flex items-center justify-between">
    //     <div className="w-full md:w-1/2">
    //       <img
    //         src={signin}
    //         alt="Sign in"
    //         className="w-2xl h-151 object-cover"
    //       />
    //     </div>

    //     <div className="flex-1 flex items-start justify-center bg-white mt-[-40px]">
    //       <div className="w-full max-w-md px-5">
    //         <div className="text-center mb-8">
    //           <div className="flex justify-center">
    //             <img src={hotellogotext} alt="" />
    //           </div>

    //           <p className="text-gray-500 mt-[-20px] font-bold tracking-wide">
    //             Property Management System
    //           </p>
    //         </div>

    //         {/* Login Form */}
    //         <h2 className="text-center text-lg text-gray-600 font-semibold mb-6  mt-[-20px]">
    //           Login
    //         </h2>

    //         <Form layout="vertical" onFinish={handleLogin}>
    //           <Form.Item
    //             label={<span className="text-white">Email</span>}
    //             name="email"
    //             rules={[{ required: true, message: "Email is required" }]}
    //           >
    //             <Input size="large" placeholder="Enter your email" />
    //           </Form.Item>

    //           <Form.Item
    //             label={<span className="text-white">Password</span>}
    //             name="password"
    //             rules={[{ required: true, message: "Password is required" }]}
    //           >
    //             <Input.Password size="large" placeholder="Enter password" />
    //           </Form.Item>

    //           <Button
    //             type="primary"
    //             htmlType="submit"
    //             block
    //             loading={isPending}
    //           >
    //             Login
    //           </Button>
    //         </Form>
    //         <p className="text-center text-gray-400 text-sm mt-10">
    //           © Oriental Vigour 2026. All rights reserved.
    //         </p>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between">
        {/* Image Section */}
        <div className="w-full md:w-1/2 flex justify-center mb-10 md:mb-0">
          <img
            src={signin}
            alt="Sign in"
            className="w-full max-w-md md:max-w-2xl lg:max-w-4xl h-160 object-cover"
          />
        </div>

        {/* Login Section */}
        <div className="w-full md:w-1/2 flex justify-center bg-white">
          <div className="w-full max-w-md px-6 py-6">
            {/* Logo */}
            <div className="text-center mb-6">
              <div className="flex justify-center">
                <img src={hotellogotext} alt="logo" className="max-w-[200px]" />
              </div>

              <p className="text-gray-500 font-bold tracking-wide text-sm mt-2">
                Property Management System
              </p>
            </div>

            {/* Login Title */}
            <h2 className="text-center text-lg text-gray-600 font-semibold mb-6">
              Login
            </h2>

            {/* Form */}
            <Form layout="vertical" onFinish={handleLogin}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Email is required" }]}
              >
                <Input size="large" placeholder="Enter your email" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Password is required" }]}
              >
                <Input.Password size="large" placeholder="Enter password" />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isPending}
                size="large"
              >
                Login
              </Button>
            </Form>

            <p className="text-center text-gray-400 text-sm mt-8">
              © Oriental Vigour 2026. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
