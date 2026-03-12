import { apiClient } from "./apiClient";

export const getServices = async (params) => {
    const  {data}  = await apiClient.get(
        "/services",
        {params}
    );
    return data.response;
};

export const upsertService = async (params) => {
    const { data } = await apiClient.post(
        "/service/upsert",
        params
    );
    return data.response;
};

// export const updateService = async (params) => {
//     const { data } = await apiClient.post(
//         "/service/upsert",
//         params
//     );
//     return data.response;
// };

export const getServiceDetails = async (params) => {
    const { data } = await apiClient.get(
        "/service",
        {params}
    );
    return data.response;
};