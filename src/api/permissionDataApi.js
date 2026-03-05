import { apiClient } from "./apiClient";

// FETCH LIST (GET usually stays with params)
export const fetchPermissionData = async (params = {}) => {
  const { data } = await apiClient.get("/permissions", {
    params: {
      ...(params.keyword && { keyword: params.keyword }),
      ...(params.page && { "pagination[page]": params.page }),
      ...(params.perPage && { "pagination[perPage]": params.perPage }),
    },
  });
  return data;
};

// GET DETAIL
export const fetchPermissionDetail = async (uuid) => {
  const { data } = await apiClient.get("/permission", {
    params: { uuid },
  });
  return data;
};

export const createPermission = async (payload) => {
  const { data } = await apiClient.post("/permission/upsert", {
    name: payload.name,
    code: payload.code,
    module: payload.module || "",
    description: payload.description || "",
  });
  return data;
};

export const updatePermission = async (uuid, payload) => {
  const { data } = await apiClient.post("/permission/upsert", {
    uuid: uuid, // This matches the key your backend expects in the JSON body
    name: payload.name,
    code: payload.code,
    module: payload.module || "",
    description: payload.description || "",
  });
  return data;
};