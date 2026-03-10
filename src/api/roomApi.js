import { apiClient } from "./apiClient";

// meta
export const roomMeta = async (params) => {
  const { data } = await apiClient.get("room/meta", params);
  return data.response;
};

// Room List API
export const fetchRoom = async (params) => {
  const { data } = await apiClient.get("rooms", { params });
  return data.response;
};

// export const upsertRoom = async (params) => {
//   const { data } = await apiClient.post("room/upsert", params);
//   return data.response;
// };

export const createRoom = async (params) => {
  const { data } = await apiClient.post("/room/upsert", params);
  return data.response;
};

export const editRoom = async (params) => {
  const { data } = await apiClient.post("/room/upsert", params);
  return data.response;
};

export const roomDetails = async (params) => {
  const { data } = await apiClient.get("/room", { params });
  return data.response;
};

//Room Type Api
export const fetchRoomType = async (params) => {
  const { data } = await apiClient.get("/room-types", { params });
  return data.response;
};

export const createRoomType = async (params) => {
  const { data } = await apiClient.post("/room-type/upsert", params);
  return data.response;
};

export const editRoomType = async (params) => {
  const { data } = await apiClient.post("/room-type/upsert", params);
  return data.response;
};

export const roomTypeDetails = async (params) => {
  const { data } = await apiClient.get("/room-type", { params });
  return data.response;
};