import { apiClient } from "./apiClient";

// meta
export const facilityMeta = async (params) => {
  const { data } = await apiClient.get("facility/meta", params);
  return data.response;
};

export const getFacilitPackageList = async (params) => {
    const  {data}  = await apiClient.get(
        "/facility/packages",
        {params}
    );
    return data.response;
};

export const upsertFacilityPackage = async (params) => {
    const { data } = await apiClient.post(
        "/facility/package/upsert",
        params
    );
    return data.response;
};

export const getFacilityPackageDetails = async (params) => {
    const { data } = await apiClient.get(
        "/facility/package",
        {params}
    );
    return data.response;
};