import { apiClient } from "./apiClient";

export const createExtraBedPersonBabyCot = async (params) => {
    const { data } = await apiClient.post("/reservation-room-extra/create", params);
    return data.response;
};