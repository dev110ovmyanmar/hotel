
import { apiClient } from './apiClient';

// Payment
export const fetchPayment = async (params) => {
    const {data} = await apiClient.get(
        "/payments",
        {params}
    );
    return data.response;
};

export const upsertPayment = async (params) => {
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

export const paymentUpload = async(params) => {
  const { data } = await apiClient.post(
    "/payment/upload",
     params,
      {isMultipart: true}  
  );
  return data.response;
};
