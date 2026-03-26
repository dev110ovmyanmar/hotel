
import { apiClient } from './apiClient';


export const fetchPartnerContract = async (params) => {
    const {data} = await apiClient.get(
        "/partner-contracts",
        {params}
    );
    return data.response;
};

export const upsertPartnerContract = async (params) => {
    const {data} = await apiClient.post(
        "/partner-contract/upsert",
        params
    );
    return data.response;
};

export const partnerContractDetails = async (params) =>{
    const {data} = await apiClient.get(
        "/partner-contract",
        {params}
    );
    
    return data.response;
}    
