
import { apiClient } from './apiClient';


export const fetchPartner = async (params) => {
    const {data} = await apiClient.get(
        "/partners",
        {params}
    );
    return data.response;
};

export const upsertPartner = async (params) => {
    const {data} = await apiClient.post(
        "/partner/upsert",
        params
    );
    return data.response;
};

export const partnerDetails = async (params) =>{
    const {data} = await apiClient.get(
        "/partner",
        {params}
    );
    
    return data.response;
}    

export const fetchAgencyUpload = async (params) => {
    const {data} = await apiClient.post(
        `/agency/upload`,
        params,
        {isMultipart: true}
    );
    return data.response;
}

export const fetchCompanyUpload = async (params) => {
    const {data} = await apiClient.post(
        `/company/upload`,
        params,
        {isMultipart: true}
    );
    return data.response;
}

export const fetchReferralFormUpload = async (params) => {
    const {data} = await apiClient.post(
        `/referral-agent/upload`,
        params,
        {isMultipart: true}
    );
    return data.response;
}
