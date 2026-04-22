import { apiClient } from "./apiClient";

export const deleteImageUpload = async (params) => {
    console.log(params, "Params")
    const { data } = await apiClient.delete(
        "/file/delete",
        { data: params }
    );
    return data.response;
}