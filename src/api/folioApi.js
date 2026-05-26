import { apiClient } from "./apiClient";

export const getFolioList = async (params) => {
    const { data } = await apiClient.get("/folios", { params });
    return data.response;
};

export const reservationMeta = async (params) => {
    const { data } = await apiClient.get(
        `/reservation/meta`,
        { params }
    );
    return data.response;
};

export const getFolioDetail = async (params) => {
    const { data } = await apiClient.get("/folio", { params });
    return data.response;
};

export const createFolio = async (params) => {
    const { data } = await apiClient.post("/folio/create", params);
    return data.response;
};

export const folioUpload = async (params) => {
    const { data } = await apiClient.post("/folio/upload", params, {
        isMultipart: true,
    });
    return data.response;
};
