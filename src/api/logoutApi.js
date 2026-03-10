import { apiClient } from "./apiClient";

export const adminLogout = async (params) => {
  const { data } = await apiClient.post("/admin/logout", params);
  return data.response;
};
