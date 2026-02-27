import { apiClient } from "./apiClient";

export const fetchFloor = async ({ keyword, page, perPage }) => {
  const { data } = await apiClient.get("floors", {
    keyword,
    pagination: { page },
    pagination: { perPage },
  });
  return data.response;
};

export const createFloor = async ({ uuid, name, floorNo, description }) => {
  const { data } = await apiClient.post("floor/upsert", {
    uuid,
    name,
    floorNo,
    description,
  });
  return data;
};

export const floorDetail = async ({ uuid }) => {
  const { data } = await apiClient.get("floor", {
     params: { uuid },
  });
  return data.response;
};
