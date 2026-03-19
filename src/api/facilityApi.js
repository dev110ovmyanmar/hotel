import { apiClient } from "./apiClient";

export const getFacilitList = async (params) => {
    const  {data}  = await apiClient.get(
        "/facilities",
        {params}
    );
    return data.response;
};

export const upsertFacility = async (params) => {
    const { data } = await apiClient.post(
        "/facility/upsert",
        params
    );
    return data.response;
};

export const getFacilityDetails = async (params) => {
    const { data } = await apiClient.get(
        "/facility",
        {params}
    );
    return data.response;
};