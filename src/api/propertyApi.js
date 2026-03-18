// import { apiClient } from "./apiClient";

// export const fetchPropertiesData = async (params = {}) => {
//   const { data } = await apiClient.get("/properties", {
//     params: {
//       ...(params.keyword && { keyword: params.keyword }),
//     },
//   });
//   return data;
// };

// export const fetchPropertyDetail = async (uuid) => {
//   if (!uuid) return null;
//   // Query Parameter (?uuid=...)
//   const { data } = await apiClient.get("/property", {
//     params: { uuid: uuid } 
//   });
//   return data;
// };

// export const createProperty = async (payload) => {
//   const { data } = await apiClient.post("/property/upsert", payload);
//   return data;
// };

// export const updateProperty = async (uuid, payload) => {
//   const { data } = await apiClient.post("/property/upsert", payload);
//   return data;
// };

// export const updatePropertySetting = async(uuid, payload) => {
//   const {data} = await apiClient.post("/property/upsert", payload);
// }


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







