import { apiClient } from "./apiClient";

// FETCH LIST (GET usually stays with params)
export const getMaintenanceRequests = async (params) => {
    const { data } = await apiClient.get("/maintenance-requests", { params })
    return data.response;
};

// GET DETAIL
export const getMaintenanceRequestDetail = async (params) => {
    const { data } = await apiClient.get("/maintenance-request",
        { params });
    return data.response;
};

export const createMaintenanceRequest = async (params) => {
    const { data } = await apiClient.post
        ("/maintenance-request/create",
            params
        );
    return data.response;
};

export const updateMaintenanceRequest = async (params) => {
    const { data } = await apiClient.put
        ("/maintenance-request/update",
            params
        );
    return data.response;
};


export const adminMeta = async (params) => {
    const { data } = await apiClient.get("/admin/meta", { params });
    return data.response;
}