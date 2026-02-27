import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { NavLink } from "react-router-dom";
import { saveState } from "../../../utils";
import { LOCAL_STORAGE_KEYS } from "../../../variables/constants";
import { useApiMutation } from "../../../hooks/useApiMutation";
import { login } from "../../../api/authApi";

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
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center px-6">
      <div className="w-full max-w-6xl flex items-center justify-between">
        <div className="hidden md:block text-white max-w-lg">
          <h1 className="text-5xl font-light text-white leading-tight">
            Whatever happens <br />
            here, <span className="font-bold">stays</span> here
          </h1>
          <p className="mt-6 text-lg text-white opacity-80">
            Please fill the form on the right side.
          </p>
        </div>

        <div className="w-full md:w-[420px]">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-10 shadow-2xl">
            <h2 className="text-2xl font-semibold mb-6 text-white text-center">
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

              <div className="text-right mb-4">
                <NavLink
                  to="/forgotPassword"
                  className="text-white/80 hover:text-white text-sm"
                >
                  Forgot Password?
                </NavLink>
              </div>

              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isPending}
              >
                Sign In
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
