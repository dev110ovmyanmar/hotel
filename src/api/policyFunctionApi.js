import { apiClient } from "./apiClient";


export const policyListFun = async (params) => {
  const {data} = await apiClient.get("/policies", {
    params,
  });
  return data.response;
};

export const createPolicyFun = async (params) => {
  const {data} = await apiClient.post("/policy/upsert", params);
  return data.response;
}

export const editPolicyFun = async (params) => {
  const {data} = await apiClient.post("/policy/upsert", params);
  return data.response;
}

export const policyDetailsFun = async (params) => {
  const {data} = await apiClient.get("/policy", {
    params,
  });
return data.response;
}