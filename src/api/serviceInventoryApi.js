import { apiClient } from "./apiClient";

export const getServiceInventory = async (params) => {
  const { data } = await apiClient.get("/service-inventories", { params });
  return data.response;
};

export const getServiceInventoryDetail = async (params) => {
  const { data } = await apiClient.get("/service-inventory", { params });
  return data.response;
};

export const upsertInventory = async (params) => {
  const { data } = await apiClient.post("service-inventory/upsert",  params);
  return data.response;
};