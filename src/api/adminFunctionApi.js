import { apiClient } from "./apiClient";

export const adminFunctionApi = async (params) => {
  const { data } = await apiClient.get("/admins", { params });
  return data.response;
};

export const createAdminFun = async (params) => {
  const { data } = await apiClient.post("/admin/upsert", params);
  return data.response;
};

export const editAdminFun = async (params) => {
  const { data } = await apiClient.post("/admin/upsert", params);
  return data.response;
};

export const adminDetailsFunApi = async (params) => {
  const { data } = await apiClient.get("/admin", { params });
  return data.response;
};
