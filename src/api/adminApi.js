import { apiClient } from "./apiClient";

export const fetchAdmin = async (params) => {
  const { data } = await apiClient.get("/admins", { params });
  return data.response;
};

export const upsertAdmin = async (params) => {
  const { data } = await apiClient.post("/admin/upsert", params);
  return data.response;
};

export const adminDetails = async (params) => {
  const { data } = await apiClient.get("/admin", { params });
  return data.response;
};

export const adminPermission = async (params) =>{
  const {data} = await apiClient.post("/admin-permission",params);
  return data.response;
}