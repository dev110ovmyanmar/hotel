import { apiClient } from "./apiClient";

export const locationListFunctionApi = async (params) => {
    const {data} = await apiClient.get(
        "/locations",
        {params}
    );
    return data.response;
};

export const createLocationFun = async (params) => {
    const {data} = await apiClient.post(
        "/location/upsert",
        params
    );
    return data.response;
}

export const editLocationFun = async (params) => {
    const {data} = await apiClient.post(
        "/location/upsert",
        params
    );
    return data.response;
}

export const locationDetailsFun = async (params) => {
    const {data} = await apiClient.get(
        "/location",
        {params}
    );
    return data.response;
};