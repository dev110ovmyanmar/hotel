import { apiClient } from "./apiClient";

export const getUnits = async (params) => {
  const { data } = await apiClient.get("/units", { params });
  return data.response;
};

export const getUnitDetail = async (params) => {
  const { data } = await apiClient.get("/unit", 
  {params});
  return data.response;
};

// Simplified: Using one upsert function since the logic is identical
export const upsertUnit = async (params) => {
  const { data } = await apiClient.post("unit/upsert", params);
  return data.response;
};