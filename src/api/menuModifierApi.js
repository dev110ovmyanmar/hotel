
import { apiClient } from './apiClient';

export const fetchMenuModifier = async (params) => {
    const {data} = await apiClient.get(
        "/menu-modifiers",
        {params}
    );
    return data.response;
};

export const upsertMenuModifier = async (params) => {
    const {data} = await apiClient.post(
        "/menu-modifier/upsert",
        params
    );
    return data.response;
};

export const menuModifierDetails = async (params) =>{
    const {data} = await apiClient.get(
        "/menu-modifier",
        {params}
    );
    return data.response;
}    
