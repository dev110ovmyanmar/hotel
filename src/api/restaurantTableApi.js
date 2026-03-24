import { apiClient } from "./apiClient";

// FETCH LIST (GET usually stays with params)
export const getRestaurantTables = async (params) => {
    const { data } = await apiClient.get("/tables", { params })
    return data.response;
};

// GET DETAIL
export const getRestaurantTableDetail = async (params) => {
    const { data } = await apiClient.get("/table",
        { params });
    return data.response;
};

export const upsertRestaurantTable = async (params) => {
    const { data } = await apiClient.post
        ("/table/upsert",
            params
        );
    return data.response;
};




