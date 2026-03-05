import { apiClient } from "./apiClient";

// meta
export const roomMeta = async (params) => {
  const { data } = await apiClient.get("room/meta", params);
  return data.response;
};

// Room List API
export const fetchRoom = async (params) => {
  const { data } = await apiClient.get("rooms", params);
  return data.response;
};

export const upsertRoom = async (params) => {
  const { data } = await apiClient.post("room/upsert", params);
  return data.response;
};

// Room Type API
export const fetchRoomType = async ({ keyword, page, perPage }) => {
  const { data } = await apiClient.get("room-types", {
    keyword,
    pagination: { page, perPage },
  });
  return data.response;
};

export const upsertRoomType = async ({
  uuid,
  name,
  code,
  description,
  maxAdults,
  maxChildren,
  maxOccupancy,
  basePrice,
  areaSize,
  totalRooms,
}) => {
  const { data } = await apiClient.post("room-type/upsert", {
    uuid,
    name,
    code,
    description,
    maxAdults,
    maxChildren,
    maxOccupancy,
    basePrice,
    areaSize,
    totalRooms,
  });
  return data.response;
};

export const RoomTypeDetail = async ({ uuid }) => {
  const { data } = await apiClient.get("room-type", { params: { uuid } });
  return data.response;
};
