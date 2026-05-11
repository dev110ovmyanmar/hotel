import { apiClient } from "./apiClient";

export const reservationList = async (params) => {
  const { data } = await apiClient.get("/reservations", { params });
  return data.response;
};

export const reservationDetails = async (params) => {
  const { data } = await apiClient.get("/reservation", { params });
  return data.response;
};