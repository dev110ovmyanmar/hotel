import { apiClient } from "./apiClient"

export const reservationMeta = async (params) => {
    const { data } = await apiClient.get(
        `/reservation/meta`,
        { params }
    );
    return data.response;
};

export const availabilitySearch = async (params) => {
    const { data } = await apiClient.get(
        `/availability/search`,
        { params }
    );
    return data.response;
};
