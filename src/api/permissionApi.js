import { apiClient } from "./apiClient";

// FETCH LIST (GET usually stays with params)
export const getPermissions = async (params) => {
  const { data } = await apiClient.get("/permissions", {params})
  return data.response;
};

// GET DETAIL
export const getPermissionDetail = async (params) => {
  const { data } = await apiClient.get("/permission", 
  {params});
  return data.response;
};

export const upsertPermission = async (params) => {
  const { data } = await apiClient.post
  ("/permission/upsert", 
    params
  );
  return data.response;
};




