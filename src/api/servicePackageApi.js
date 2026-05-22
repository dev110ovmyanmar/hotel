import { apiClient } from "./apiClient";

export const getServicePackages = async (params) => {
    const { data } = await apiClient.get(
        "/service-packages",
        { params }
    );
    return data.response;
};

export const createServicePackage = async (params) => {
    const { data } = await apiClient.post(
        "/service-package/upsert",
        params
    );
    return data.response;
};

export const updateServicePackage = async (params) => {
    const { data } = await apiClient.post(
        "/service-package/upsert",
        params
    );
    return data.response;
};

export const getServicePackageDetails = async (params) => {
    const { data } = await apiClient.get(
        "/service-package",
        { params }
    );
    return data.response;
};

export const getServicePackageItemDetails = async (params) => {
    const { data } = await apiClient.get(
        "/service-package-item",
        { params }
    );
    return data.response;
}

export const upsertServicePackageItem = async (params) => {
    const { data } = await apiClient.post(
        "/service-package-item/upsert",
        params
    );
    return data.response;
}