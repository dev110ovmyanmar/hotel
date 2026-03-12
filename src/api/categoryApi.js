import { apiClient } from "./apiClient";

export const fetchCategoryData = async (params = {}) => {
  const { data } = await apiClient.get("/categories", { params });
  return data;
};

export const fetchCategoryDetail = async ({ uuid }) => {
  if (!uuid) return null;
  const { data } = await apiClient.get("/category", { params: { uuid } });
  return data;
};

// Simplified: Using one upsert function since the logic is identical
export const upsertCategory = async (payload) => {
  const { data } = await apiClient.post("category/upsert", null, {params: payload});
  return data;
};