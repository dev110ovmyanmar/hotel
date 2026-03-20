import { apiClient } from "./apiClient";

export const fetchDepartment = async (params) => {
  const { data } = await apiClient.get("/departments", { params });
  return data.response;
};

export const createDepartment = async (params) => {
  const { data } = await apiClient.post("/department/upsert", params);
  return data.response;
};

export const editDepartment = async (params) => {
  const { data } = await apiClient.post("/department/upsert", params);
  return data.response;
};

export const departmentDetails = async (params) => {
  const { data } = await apiClient.get("/department", { params });
  return data.response;
};