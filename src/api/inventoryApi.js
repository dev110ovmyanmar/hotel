import { apiClient } from "./apiClient";

export const fetchInventoryData = async (params = {}) => {
  const { data } = await apiClient.get("/inventories", { params });
  return data;
};

// Fixed typo: "invetory" -> "inventory"
export const fetchInventoryDetail = async (params) => {
  if (!params?.uuid) return null;
  const { data } = await apiClient.get("/inventory", { params });
  return data;
};

export const upsertInventory = async (payload) => {
  // Your API definition uses params for the payload
  const { data } = await apiClient.post("inventory/upsert", null, { params: payload });
  return data;
};