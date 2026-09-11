import { apiClient } from "./apiClient";

export const fetchDashboard = async (params) => {
    const  {data}  = await apiClient.get(
        "/dashboard",
        {params}
    );
    return data.response;
};