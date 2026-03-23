import { apiClient } from "./apiClient";

export const fetchSeasonlRate = async (params) => {
  const { data } = await apiClient.get("/seasonal-rates", { params });
  return data.response;
};

export const createSeasonlRate = async (params) => {
  const { data } = await apiClient.post("/seasonal-rate/upsert", params);
  return data.response;
};

export const editSeasonlRate = async (params) => {
  const { data } = await apiClient.post("/seasonal-rate/upsert", params);
  return data.response;
};

export const seasonlRateDetails = async (params) => {
  const { data } = await apiClient.get("/seasonal-rate", { params });
  return data.response;
};

