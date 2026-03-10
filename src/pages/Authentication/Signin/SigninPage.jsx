import React, { useState } from "react";
import { Form, Input, Button } from "antd";

import { saveState } from "../../../utils";
import { LOCAL_STORAGE_KEYS } from "../../../variables/constants";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { login } from "../../../api/authApi";
import signin from "../../../assets/images/signin.png";
import hotellogotext from "../../../assets/images/hotellogotext.png";

export default function SignIn() {
  const [ipAddress, setIpAddress] = useState("");

  const { mutate, isPending } = useApiMutation({
    mutationFn: login,
    options: {
      onSuccess: (data) => {
        console.log(data, "data");
        if (data) saveState(LOCAL_STORAGE_KEYS.sessionId, data.XSessionToken);
        saveState(LOCAL_STORAGE_KEYS.adminRole, data.role.name);
        window.location.href = "/dashboard";
      },
      onError: (error) => {
        const message =
          error.response?.data?.message ||
          "Login failed. Please check your credentials.";
        alert(message);
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
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-8xl flex items-center justify-between">
        <div className="w-full md:w-1/2">
          <img
            src={signin}
            alt="Sign in"
            className="w-2xl h-full object-cover"
          />
        </div>

        <div className="flex-1 flex items-start justify-center bg-white mt-[-40px]">
          <div className="w-full max-w-md px-5">
            <div className="text-center mb-8">
              <div className="flex justify-center">
                <img src={hotellogotext} alt="" />
              </div>

              <p className="text-gray-500 mt-[-20px] font-bold tracking-wide">
                Property Management System
              </p>
            </div>

            {/* Login Form */}
            <h2 className="text-center text-lg text-gray-600 font-semibold mb-6  mt-[-20px]">
              Login
            </h2>

            <Form layout="vertical" onFinish={handleLogin}>
              <Form.Item
                label={<span className="text-white">Email</span>}
                name="email"
                rules={[{ required: true, message: "Email is required" }]}
              >
                <Input size="large" placeholder="Enter your email" />
              </Form.Item>

              <Form.Item
                label={<span className="text-white">Password</span>}
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
              >
                Login
              </Button>
            </Form>
            <p className="text-center text-gray-400 text-sm mt-10">
              © Oriental Vigour 2026. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
