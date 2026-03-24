import { apiClient } from "./apiClient";

// FETCH LIST (GET usually stays with params)
export const getSuppliers = async (params) => {
    const { data } = await apiClient.get("/suppliers", { params })
    return data.response;
};

// GET DETAIL
export const getSupplierDetail = async (params) => {
    const { data } = await apiClient.get("/supplier",
        { params });
    return data.response;
};

export const upsertSupplier = async (params) => {
    const { data } = await apiClient.post
        ("/supplier/upsert",
            params
        );
    return data.response;
};




