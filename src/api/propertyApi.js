import { apiClient } from "./apiClient";

export const getProperties = async (params) => {
  const { data } = await apiClient.get("/properties", { params });
  return data.response;
};

export const getPropertyDetails = async (params) => {
  const { data } = await apiClient.get("/property", { params });
  return data.response;
};

export const upsertProperty = async(params) => {
  const { data } = await apiClient.post(
    "/property/upsert",
    params
  );
  return data.response;
};

export const propertyUpload = async(params) => {
  const { data } = await apiClient.post(
    "/property/upload",
    params,
    {isMultipart: true}
  );
  return data.response;
};







