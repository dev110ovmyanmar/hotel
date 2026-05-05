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

// Room-attribute
export const fetchRoomAttribute = async (params) => {
  const { data } = await apiClient.get("/room-attributes", { params });
  return data.response;
};

export const createRoomAttribute = async (params) => {
  const { data } = await apiClient.post("/room-attribute/upsert", params);
  return data.response;
};

export const editRoomAttribute = async (params) => {
  const { data } = await apiClient.post("/room-attribute/upsert", params);
  return data.response;
};

export const roomAttributeDetails = async (params) => {
  const { data } = await apiClient.get("/room-attribute", { params });
  return data.response;
};

//Room-attribute-value api
export const createRoomAttributeValue = async (params) => {
  const { data } = await apiClient.post("/room-attribute-value/upsert", params);
  return data.response;
};

export const editRoomAttributeValue = async (params) => {
  const { data } = await apiClient.post("/room-attribute-value/upsert", params);
  return data.response;
};

// Room-Type-amenity
export const createRoomTypeAmenity = async (params) => {
  const { data } = await apiClient.post("/room-type-amenity/upsert", params);
  return data.response;
};

export const editRoomTypeAmenity = async (params) => {
  const { data } = await apiClient.post("/room-type-amenity/upsert", params);
  return data.response;
};

// upload api
export const fetchRoomTypeUpload = async (params) => {
  const { data } = await apiClient.post(
    `/room-type/upload`,
    params,
    { isMultipart: true }
  );
  return data.response;
}

// rate plan meta
export const ratePlanMeta = async (params) => {
  const { data } = await apiClient.get("rate-plan/meta", params);
  return data.response;
};