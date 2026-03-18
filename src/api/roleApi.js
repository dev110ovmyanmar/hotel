import { apiClient } from "./apiClient";

export const getRoles = async (params) => {
  const { data } = await apiClient.get("/roles", { params });
  return data.response;
};

export const getRoleDetails = async (params) => {
  const { data } = await apiClient.get("/role", { params });
  return data.response;
};

export const upsertRole = async(params) => {
  const { data } = await apiClient.post(
    "/role/upsert",
    params
  );
  return data.response;
};




