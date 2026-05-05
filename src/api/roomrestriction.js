import { apiClient } from "./apiClient";

// room meta
export const roomMeta = async (params) => {
  const { data } = await apiClient.get("room/meta", params);
  return data.response;
};

// rate plan meta
export const ratePlanMeta = async (params) => {
  const { data } = await apiClient.get("rate-plan/meta", params);
  return data.response;
};

// room restriction
export const fetchRoomRestriction = async (params) => {
  const { data } = await apiClient.get("/room-restrictions", { params });
  return data.response;
};

export const upsertRoomRestriction = async (params) => {
  const { data } = await apiClient.post("/room-restriction/upsert", params);
  return data.response;
};

export const roomRestrictionDetails = async (params) => {
  const { data } = await apiClient.get("/room-restriction", { params });
  return data.response;
};

export const roomRestrictionStopSell = async (params) => {
  const { data } = await apiClient.put("/room-restriction/stop-sell", params);
  return data.response;
}
