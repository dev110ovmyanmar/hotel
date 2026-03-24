import { apiClient } from "./apiClient";

export const fetchMenuCategory = async (params) => {
  const { data } = await apiClient.get("/menu-categories", { params });
  return data.response;
};

export const upsertMenuCategory = async (params) => {
  const { data } = await apiClient.post("/menu-category/upsert", params);
  return data.response;
};

export const menuCategoryDetails = async (params) => {
  const { data } = await apiClient.get("/menu-category", { params });
  return data.response;
};
