import { apiClient } from "./apiClient";

export const fetchUnitData = async (params = {}) => {
  const { data } = await apiClient.get("/units", { params });
  return data;
};

export const fetchUnitDetail = async ({ uuid }) => {
  if (!uuid) return null;
  const { data } = await apiClient.get("/unit", { params: { uuid } });
  return data;
};

// Simplified: Using one upsert function since the logic is identical
export const upsertUnit = async (payload) => {
  const { data } = await apiClient.post("unit/upsert", null, {params: payload});
  return data;
};