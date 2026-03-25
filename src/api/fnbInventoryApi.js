import { apiClient } from "./apiClient";

export const fnbMeta = async (params) => {
  const { data } = await apiClient.get("fnb/meta", params);
  return data.response;
};

export const getFAndBInventoryList = async (params) => {
    const  {data}  = await apiClient.get(
        "/fnb-inventories",
        {params}
    );
    return data.response;
};

export const upsertFAndBInventory = async (params) => {
    const { data } = await apiClient.post(
        "/fnb-inventory/upsert",
        params
    );
    return data.response;
};

export const getFAndBInventoryDetails = async (params) => {
    const { data } = await apiClient.get(
        "/fnb-inventory",
        {params}
    );
    return data.response;
};