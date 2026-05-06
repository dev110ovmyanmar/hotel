import { apiClient } from "./apiClient";

export const getCalendarData = async (params) => {
  const { data } = await apiClient.get("/rates-inventory", { params });
  return data.response;
};
