import { apiClient } from "./apiClient";

export const fetchLocation = async (params) => {
    const {data} = await apiClient.get(
        "/locations",
        {params}
    );
    return data.response;
};

export const upsertLocation = async (params) => {
    const {data} = await apiClient.post(
        "/location/upsert",
        params
    );
    return data.response;
}

export const locationDetails = async (params) => {
    const {data} = await apiClient.get(
        "/location",
        {params}
    );
    return data.response;
};