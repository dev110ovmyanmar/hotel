import { apiClient } from "./apiClient";

export const createExtraBedPersonBabyCot = async (params) => {
    const { data } = await apiClient.post("/reservation-room-extra/create", params);
    return data.response;
};

export const updateExtraBedPersonBabyCot = async (params) => {
    const { data } = await apiClient.put("/reservation-room-extra/update", params);
    return data.response;
};

export const deleteExtraBedPersonBabyCot = async (params) => {
    const { data } = await apiClient.delete("/reservation-room-extra/delete", { params });
    return data.response;
};