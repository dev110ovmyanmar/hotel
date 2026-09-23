import { apiClient } from "./apiClient";

export const getServiceInventoryMappings = async (params) => {
    const  {data}  = await apiClient.get(
        "/service-inventory-mappings",
        {params}
    );
    return data.response;
};

export const upsertServiceInventoryMapping = async (params) => {
    const { data } = await apiClient.post(
        "/service-inventory-mapping/upsert",
        params
    );
    return data.response;
};

export const getServiceInventoryMappingDetails = async (params) => {
    const { data } = await apiClient.get(
        "/service-inventory-mapping",
        {params}
    );
    return data.response;
};

export const deleteServiceInventoryMapping = async (params) => {
    const { data } = await apiClient.delete("/service-inventory-mapping/delete", { params });
    return data.response;
};