
import { apiClient } from './apiClient';

export const activeAdmins = async (params) => {
    const { data } = await apiClient.get(
        "/night-audit/active-admins",
        { params }
    );
    return data.response;
};

export const systemLock = async (params) => {
    const { data } = await apiClient.post(
        "/night-audit/system-lock",
        params
    );
    return data.response;
};

export const systemUnlock = async(params) => {
    const { data } = await apiClient.post(
        "/night-audit/system-unlock",
        params
    );
    return data.response;
}
