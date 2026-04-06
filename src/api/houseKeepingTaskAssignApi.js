import { apiClient } from "./apiClient";

// meta
export const roomMeta = async (params) => {
    const { data } = await apiClient.get("room/meta", params);
    return data.response;
};

// FETCH LIST (GET usually stays with params)
export const getHouseKeepingTaskAssigns = async (params) => {
    const { data } = await apiClient.get("/hk-task-assignments", { params })
    return data.response;
};

// GET DETAIL
export const getHouseKeepingTaskAssignDetail = async (params) => {
    const { data } = await apiClient.get("/hk-task-assignment",
        { params });
    return data.response;
};

export const createHouseKeepingTaskAssign = async (params) => {
    const { data } = await apiClient.post
        ("/hk-task-assignment/create",
            params
        );
    return data.response;
};

export const updateHouseKeepingTaskAssign = async (params) => {
    const { data } = await apiClient.put
        ("/hk-task-assignment/update",
            params
        );
    return data.response;
};