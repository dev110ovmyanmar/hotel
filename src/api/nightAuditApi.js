
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
        "/night-audit/pre-check",
        {params}
    );
    return data.response;
};

export const recheckPreAudit = async (params) => {
  const { data } = await apiClient.post("/night-audit/pre-check/recheck", params);
  return data.response;
};

export const dailyChargePosing = async(params) => {
    const { data } = await apiClient.get(
        "/night-audit/daily-charges",
        {params}
    );
    return data.response;
}

export const reloadDailyPostCharges = async (params) => {
  const { data } = await apiClient.post("/night-audit/daily-charges/post", params);
  return data.response;
};


export const folioReview = async(params) => {
    const { data } = await apiClient.get(
        "/night-audit/folio-review",
        {params}
    );
    return data.response;
}

export const folioReviewPayment = async(params) => {
    const { data } = await apiClient.get(
        "night-audit/folio-review/payments",
        {params}
    );
    return data.response;
}