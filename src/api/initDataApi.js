import { apiClient } from "./apiClient";

export const fetchInitData = async () => {
  const { data } = await apiClient.get("/init-data");
  return data.response;
};