import { apiClient } from "./apiClient";

export const fetchStaff = async (params) => {
  const { data } = await apiClient.get("/staffs", { params });
  return data.response;
};

export const createStaff = async (params) => {
  const { data } = await apiClient.post("/staff/upsert", params);
  return data.response;
};

export const editStaff = async (params) => {
  const { data } = await apiClient.post("/staff/upsert", params);
  return data.response;
};

export const staffDetails = async (params) => {
  const { data } = await apiClient.get("/staff", { params });
  return data.response;
};