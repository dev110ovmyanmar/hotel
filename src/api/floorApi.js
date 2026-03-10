import { apiClient } from "./apiClient";

export const fetchFloor = async (params) => {
  const { data } = await apiClient.get("/floors", { params });
  return data.response;
};

export const createFloor = async (params) => {
  const { data } = await apiClient.post("/floor/upsert", params);
  return data.response;
};

export const editFloor = async (params) => {
  const { data } = await apiClient.post("/floor/upsert", params);
  return data.response;
};

export const floorDetail = async (params) => {
  const { data } = await apiClient.get("/floor", { params });
  return data.response;
};
