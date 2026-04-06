import { apiClient } from "./apiClient";

// meta
export const roomMeta = async (params) => {
    const { data } = await apiClient.get("room/meta", params);
    return data.response;
};

// FETCH LIST (GET usually stays with params)
export const getHouseKeeping = async (params) => {
    const { data } = await apiClient.get("/hk-statuses", { params })
    return data.response;
};

// GET DETAIL
export const getHouseKeepingDetail = async (params) => {
    const { data } = await apiClient.get("/hk-status",
        { params });
    return data.response;
};

export const upsertHouseKeeping = async (params) => {
    const { data } = await apiClient.put
        ("/hk-status/update",
            params
        );
    return data.response;
};