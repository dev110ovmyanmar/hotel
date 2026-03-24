
import { apiClient } from './apiClient';

export const fetchRoomRate = async (params) => {
    const {data} = await apiClient.get(
        "/room-rates",
        {params}
    );
    return data.response;
};

export const upsertRoomRate = async (params) => {
    const {data} = await apiClient.post(
        "/room-rate/upsert",
        params
    );
    return data.response;
};

export const roomRateDetails = async (params) =>{
    const {data} = await apiClient.get(
        "/room-rate",
        {params}
    );
    return data.response;
}    
