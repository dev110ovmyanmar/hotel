import { apiClient } from "./apiClient";

export const getFolioList = async (params) => {
    const { data } = await apiClient.get("/folios", { params });
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

export const transferFolioLines = async (params) => {
    const { data } = await apiClient.patch("/folio/transfer-lines", params);
    return data.response;
};

export const folioAdjust = async (params) => {
    const { data } = await apiClient.post("/folio-line/adjust", params);
    return data.response;
}



