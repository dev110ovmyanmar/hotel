import { apiClient } from "./apiClient";

export const fetchTax = async (params) => {
  const { data } = await apiClient.get("/taxes", { params });
  return data.response;
};

export const createTax = async (params) => {
  const { data } = await apiClient.post("/tax/upsert", params);
  return data.response;
};

export const editTax = async (params) => {
  const { data } = await apiClient.post("/tax/upsert", params);
  return data.response;
};

export const TaxDetails = async (params) => {
  const { data } = await apiClient.get("/tax", { params });
  return data.response;
};