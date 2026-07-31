import { apiClient } from "./apiClient";

export const deleteImageUpload = async (params) => {
    const { data } = await apiClient.delete(
        "/file/delete",
        { data: params }
    );
    return data.response;
}