import { apiClient } from "./apiClient";

// meta
export const roomMeta = async (params) => {
    const { data } = await apiClient.get("room/meta", params);
    return data.response;
};

// FETCH LIST (GET usually stays with params)
export const getHouseKeepingTasks = async (params) => {
    const { data } = await apiClient.get("/hk-tasks", { params })
    return data.response;
};

// GET DETAIL
export const getHouseKeepingTaskDetail = async (params) => {
    const { data } = await apiClient.get("/hk-task",
        { params });
    return data.response;
};

export const upsertHouseKeepingTask = async (params) => {
    const { data } = await apiClient.post
        ("/hk-task/create",
            params
        );
    return data.response;
};

export const updateHouseKeepingTask = async (params) => {
    const { data } = await apiClient.put
        ("/hk-task/update",
            params
        );
    return data.response;
};

export const adminMeta = async (params) => {
    const { data } = await apiClient.get("/admin/meta", { params });
    return data.response;
}