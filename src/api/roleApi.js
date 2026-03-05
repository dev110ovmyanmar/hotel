import { apiClient } from "./apiClient";

export const fetchRoleData = async (params) => {
  const { data } = await apiClient.get("/roles", { params });
  return data.response;
};

export const createRoleFun = async (params) => {
  // JSON Body payload creation
  const payload = {
    name: params.name,
    code: params.code,
    description: params.description || "",
    //Structure as Backend
    "permission": {
       "ids": params.permissionIds // IDs array (e.g., [1, 2, 3])
    }
  };

  // apiClient.post(url, payload)
  const { data } = await apiClient.post(`/role/upsert`, payload);
  
  // Response
  return data; 
};

export const updateRoleFun = async (params) => {
  // JSON Body Payload Creation
  const payload = {
    uuid: params.uuid,
    name: params.name,
    code: params.code,
    description: params.description || "",
    //Structure as Backend
    "permission": {
       "ids": params.permissions
    }
  };

  // apiClient.post(url, data)
  const { data } = await apiClient.post(`/role/upsert`, payload);
  return data;
};

export const updateRolePermissionFun = async (params) => {
  const payload = {
    uuid: params.uuid,
    name: params.name,
    code: params.code,
    description: params.description || "",
    permission: {
      ids: params.permissions
    }
  };
  const { data } = await apiClient.post(`/role/upsert`, payload);
  return data;
};

export const fetchRoleDetail = async (params) => {
  const { data } = await apiClient.get("/role", { params });
  return data.response;
};
