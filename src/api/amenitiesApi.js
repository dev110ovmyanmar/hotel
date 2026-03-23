import { apiClient } from "./apiClient"

export const fetchAmenities = async (params) => {
    const {data} = await apiClient.get(
        `/amenities`,
        {params}
    );
    return data.response;
};

export const upsertAmenity = async (params) => {
    const {data} = await apiClient.post(
        `/amenity/upsert`,
        params
    );
    return data.response;
}

export const amenitiesDetails = async (params) => {
    const {data} = await apiClient.get(
        `/amenity`,
        {params}
    );

    return data.response;
}