import { apiClient } from "./apiClient";

// meta
export const menuMeta = async (params) => {
  const { data } = await apiClient.get("fnb/meta", params);
  return data.response;
};

// menu item api
export const fetchMenu = async (params) => {
  const { data } = await apiClient.get("/menus", { params });
  return data.response;
};

export const upsertMenu = async (params) => {
  const { data } = await apiClient.post("/menu/upsert", params);
  return data.response;
};

export const menuDetails = async (params) => {
  const { data } = await apiClient.get("/menu", { params });
  return data.response;
};
