import { apiClient } from "./apiClient";

export const getAvailabilityCalendar = async (params) => {
    const  {data}  = await apiClient.get(
        "/availability-calendars",
        {params}
    );
    return data.response;
};
    
export const updateAvailabilityCalendar = async (params) => {
    const { data } = await apiClient.put(
        "/availability-calendar/update",
        params
    );
    return data.response;
};

export const getAvailabilityCalendarDetails = async (params) => {
    const { data } = await apiClient.get(
        "/availability-calendar",
        {params}
    );
    return data.response;
};