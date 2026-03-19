import { apiClient } from "./apiClient";

// FETCH LIST (GET usually stays with params)
export const getCategories = async (params) => {
  const { data } = await apiClient.get("/categories", {params})
  return data.response;
};

// GET DETAIL
export const getCategoryDetail = async (params) => {
  const { data } = await apiClient.get("/category", 
  {params});
  return data.response;
};

export const upsertCategory = async (params) => {
  const { data } = await apiClient.post
  ("/category/upsert", 
    params
  );
  return data.response;
};




