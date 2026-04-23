import { apiClient } from "./apiClient";

// FETCH LIST (GET usually stays with params)
export const getMaintenanceTaskAssignments = async (params) => {
    const { data } = await apiClient.get("/maintenance-task-assignments", { params })
    return data.response;
};

// GET DETAIL
export const getMaintenanceTaskAssignmentDetail = async (params) => {
    const { data } = await apiClient.get("/maintenance-task-assignment",
        { params });
    return data.response;
};

export const createMaintenanceTaskAssignment = async (params) => {
    const { data } = await apiClient.post
        ("/maintenance-task-assignment/create",
            params
        );
    return data.response;
};

export const updateMaintenanceTaskAssignment = async (params) => {
    const { data } = await apiClient.put
        ("/maintenance-task-assignment/update",
            params
        );
    return data.response;
};

export const deleteMaintenanceTaskAssignment = async (params) => {
    const { data } = await apiClient.delete(
        "/maintenance-task-assignment/delete",
        params
    );
    return data.response;
};
