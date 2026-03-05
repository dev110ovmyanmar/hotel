import { apiClient } from "./apiClient"

export const amenitiesListFun = async (params) => {
    const {data} = await apiClient.get(
        `/amenities`,
        {params}
    );
    return data.response;
};

export const createAmenitiesFun = async (params) => {
    const {data} = await apiClient.post(
        `/amenity/upsert`,
        params
    );
    return data.response;
}

export const editAmenitiesFun = async (params) => {
    const {data} = await apiClient.post(
        `/amenity/upsert`,
        params
    );
    return data.response;
}

export const amenitiesDetailsFun = async (params) => {
    const {data} = await apiClient.get(
        `/amenity`,
        {params}
    );

    console.log(data.response,"amenitiesDetailsFun")
    return data.response;
}