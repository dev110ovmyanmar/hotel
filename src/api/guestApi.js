import { apiClient } from "./apiClient";

// FETCH LIST (GET usually stays with params)
export const getGuests = async (params) => {
  const { data } = await apiClient.get("/guests", { params });
  return data.response;
};

// GET DETAIL
export const getGuestDetail = async (params) => {
  const { data } = await apiClient.get("/guest", { params });
  return data.response;
};

export const upsertGuest = async (params) => {
  const { data } = await apiClient.post("/guest/upsert", params);
  return data.response;
};

export const guestUpload = async (params) => {
  const { data } = await apiClient.post("/guest/upload", params, {
    isMultipart: true,
  });
  return data.response;
};
