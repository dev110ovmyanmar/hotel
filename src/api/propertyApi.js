import { apiClient } from "./apiClient";

export const fetchPropertiesData = async (params = {}) => {
  const { data } = await apiClient.get("/properties", {
    params: {
      ...(params.keyword && { keyword: params.keyword }),
    },
  });
  return data;
};

export const fetchPropertyDetail = async (uuid) => {
  if (!uuid) return null;
  // Query Parameter (?uuid=...)
  const { data } = await apiClient.get("/property", {
    params: { uuid: uuid } 
  });
  return data;
};

export const createProperty = async (payload) => {
  const { data } = await apiClient.post("/property/upsert", payload);
  return data;
};

export const updateProperty = async (uuid, payload) => {
  const { data } = await apiClient.post("/property/upsert", payload);
  return data;
};


