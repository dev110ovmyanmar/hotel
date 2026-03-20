import { apiClient } from "./apiClient";


export const fetchPolicy = async (params) => {
  const { data } = await apiClient.get("/policies", {
    params,
  });
  return data.response;
};

export const upsertPolicy = async (params) => {
  const { data } = await apiClient.post("/policy/upsert", params);
  return data.response;
}

export const policyDetails = async (params) => {
  const { data } = await apiClient.get("/policy", {
    params,
  });
  return data.response;
}

export const createPolicyDuplicate = async (uuid) => {
  const { data } = await apiClient.post("/policy/duplicate", {
    uuid,
  });
  return data.response;
}