import { apiClient } from "./apiClient";

export const createRoomAmendment = async (params) => {
    const { data } = await apiClient.post("/room-amendment", params);
    return data.response;
};

export const dateChangeCheck = async (params) => {
    const { data } = await apiClient.post("/date-change/check", params);
    return data.response;
};

