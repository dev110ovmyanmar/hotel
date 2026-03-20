import { apiClient } from "./apiClient";

export const fetchRatePlan = async (params) => {
  const { data } = await apiClient.get("/rate-plans", { params });
  return data.response;
};

export const createRatePlan = async (params) => {
  const { data } = await apiClient.post("/rate-plan/upsert", params);
  return data.response;
};

export const editRatePlan = async (params) => {
  const { data } = await apiClient.post("/rate-plan/upsert", params);
  return data.response;
};

export const ratePlanDetails = async (params) => {
  const { data } = await apiClient.get("/rate-plan", { params });
  return data.response;
};

//rate plan meta
// meta
export const ratePlanMeta = async (params) => {
  const { data } = await apiClient.get("rate-plan/meta", params);
  return data.response;
};
