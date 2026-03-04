import { apiClient } from "./apiClient";

export const resetFunction = async (uuid) => {
    const {data} = await apiClient.put(
        "/admin/reset-password",
        {},
        {params:{uuid}}
    );

    return data?.response;
}