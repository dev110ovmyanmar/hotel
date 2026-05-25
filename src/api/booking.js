import { apiClient } from "./apiClient"

export const fetchFacilityBooking = async (params) => {
    const {data} = await apiClient.get(
        `/facility-bookings`,
        {params}
    );
    return data.response;
};

export const createFacilityBooking = async (params) => {
    const {data} = await apiClient.post(
        `/facility-booking/create`,
        params
    );
    return data.response;
}

export const editFacilityBooking = async (params) => {
    const {data} = await apiClient.put(
        `/facility-booking/edit`,
        params
    );
    return data.response;
}

export const facilityBookingDetails = async (params) => {
    const {data} = await apiClient.get(
        `/facility-booking`,
        {params}
    );

    return data.response;
}