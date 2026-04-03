import { apiClient } from "./apiClient";

export const getFnbMenuInventoryMappings = async (params) => {
    const  {data}  = await apiClient.get(
        "/menu-inventories",
        {params}
    );
    return data.response;
};

export const upsertFnbMenuInventoryMapping = async (params) => {
    const { data } = await apiClient.post(
        "/menu-inventory/upsert",
        params
    );
    return data.response;
};

export const getFnbMenuInventoryMappingDetails = async (params) => {
    const { data } = await apiClient.get(
        "/menu-inventory",
        {params}
    );
    return data.response;
};