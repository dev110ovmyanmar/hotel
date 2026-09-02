
import { apiClient } from './apiClient';

export const activeAdmins = async (params) => {
    const { data } = await apiClient.get(
        "/night-audit/active-admins",
        { params }
    );
    return data.response;
};

export const systemLock = async (params) => {
    const { data } = await apiClient.put(
        "/night-audit/system-lock",
        params
    );
    return data.response;
};

export const systemUnlock = async(params) => {
    const { data } = await apiClient.put(
        "/night-audit/system-unlock",
        params
    );
    return data.response;
}

export const nightAuditCheckBookings = async(params) => {
    const { data } = await apiClient.get(
        "/night-audit/bookings",
        {params}
    );
    return data.response;
}

export const preAuditCheck = async(params) => {
    const { data } = await apiClient.get(
        "/night-audit/pre-audit-check",
        {params}
    );
    return data.response;
}