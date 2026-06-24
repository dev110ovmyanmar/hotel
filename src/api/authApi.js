import { apiClient } from "./apiClient";
import { DEFAULT_IP_ADDRESS } from "../variables/constants";
import { getPasswordMD5 } from "../utils";

export const login = async ({ email, password, ipAddress }) => {
  const response = await apiClient.post("admin/login", {
    email,
    password: getPasswordMD5(password),
    ipAddress: ipAddress || DEFAULT_IP_ADDRESS,
  });

  return {
    ...response.data.response
    , headers: response.headers
  };
};


export const changePassword = async ({
  currentPassword,
  newPassword,
  confirmPassword,
}) => {
  const { data } = await apiClient.put("admin/change-password", {
    currentPassword: getPasswordMD5(currentPassword),
    newPassword: getPasswordMD5(newPassword),
    confirmPassword: getPasswordMD5(confirmPassword),
  });

  return data.response;
};

