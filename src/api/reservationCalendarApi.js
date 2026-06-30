import { apiClient } from "./apiClient";

export const getReservationCalendar = async (params) => {
    const { data } = await apiClient.get(
        "/reservation-calendar",
        { params }
    );
    return data.response;
};