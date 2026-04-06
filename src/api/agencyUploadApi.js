import { apiClient } from "./apiClient"

export const fetchAgencyUpload = async (params) => {
    const {data} = await apiClient.post(
        `/agency/upload`,
        params,
        {isMultipart: true}
    );
    return data.response;
}