import { apiClient } from "./apiClient";

// room meta
export const roomMeta = async (params) => {
  const { data } = await apiClient.get("room/meta", params);
  return data.response;
};

// rate plan meta
export const ratePlanMeta = async (params) => {
  const { data } = await apiClient.get("rate-plan/meta", params);
  return data.response;
};

// extra bed rate
export const fetchExtraBedRate = async (params) => {
  const { data } = await apiClient.get("/extra-bed-rates", { params });
  return data.response;
};

export const upsertExtraBedRate = async (params) => {
  const { data } = await apiClient.post("/extra-bed-rate/upsert", params);
  return data.response;
};

export const extraBedRateDetails = async (params) => {
  const { data } = await apiClient.get("/extra-bed-rate", { params });
  return data.response;
};
