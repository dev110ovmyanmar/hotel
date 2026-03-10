import { apiClient } from "./apiClient";

export const fetchPrivacyPolicyData = async (params = {}) => {
  const { data } = await apiClient.get("/privacy-policy", {
    params: {
      ...(params.keyword && { keyword: params.keyword }),
    },
  });
  return data;
};

export const createPrivacyPolicy = async (payload) => {
  const { data } = await apiClient.post("/privacy-policy/upsert", payload);
  return data;
};

export const updatePrivacyPolicy = async (uuid, payload) => {
  const { data } = await apiClient.post("/privacy-policy/upsert", payload);
  return data;
};


