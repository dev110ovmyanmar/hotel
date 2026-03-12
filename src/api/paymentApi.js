
import { apiClient } from './apiClient';

export const fetchPayment = async (params) => {
    const {data} = await apiClient.get(
        "/payments",
        {params}
    );
    return data.response;
};

export const createPayment = async (params) => {
    const {data} = await apiClient.post(
        "/payment/upsert",
        params
    );
    return data.response;
};

export const editPayment = async (params)=>{
    const {data} = await apiClient.post(
        "/payment/upsert",
        params
    );
    return data.response;
};

export const paymentDetails = async (params) =>{
    const {data} = await apiClient.get(
        "/payment",
        {params}
    );
    return data.response;
}    
