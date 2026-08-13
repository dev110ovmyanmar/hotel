import { apiClient } from "./apiClient";

export const createFoodBeverageOrder = async (params) => {
    const { data } = await apiClient.post(
        "/fnb-order/create",
        params
    );
    return data.response;
}

export const updateFoodBeverageOrder = async (params) => {
    const { data } = await apiClient.put(
        "/fnb-order/update",
        params
    );
    return data.response;
};

export const foodBeverageOrderDetails = async (params) => {
    const { data } = await apiClient.get(
        "/fnb-order",
        {params}
    );
    return data.response;
};

export const fetchFoodBeverageOrderList = async (params) => {
    const { data } = await apiClient.get(
        "/fnb-orders",
        {params}
    );
    return data.response;
};

export const upsertFoodBeverageOrderItem = async (params) => {
    const { data } = await apiClient.post(
        "/fnb-order-item/upsert",
        params
    );
    return data.response;
};

export const deleteFoodBeverageOrderItem = async (params) => {
    const { data } = await apiClient.delete(
        "/fnb-order-item/delete",
        {data: params}
    );
    return data.response;
};