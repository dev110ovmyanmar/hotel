import { apiClient } from "./apiClient";

// FETCH LIST (GET usually stays with params)
// export const getDailyOccupactions = async (params) => {
//     const { data } = await apiClient.get("/", { params })
//     return data.response;
// };

export const getDailyOccupactions = async (params) => {
    const { data } = await apiClient.get("/reservation-room/daily-occupancy",
        { params });
    return data.response;
};

export const upsertDailyOccupaction = async (params) => {
    const { data } = await apiClient.patch
        ("/reservation-room/daily-occupancy/update",
            params
        );
    return data.response;
};

export const updateChildrenFOC = async (params) => {
    const { data } = await apiClient.put(
        "reservation-daily-child/complimentary/update",
        params
    );
    return data.response
}

export const updateExtraFOC = async (params) => {
    const {data} = await apiClient.put(
        "/reservation-room-extra/complimentary/update",
        params
    );
    return data.response
}

export const updateMealPlanFOC = async (params) => {
    const { data } = await apiClient.put(
        "/reservation-daily-occupancy/complimentary/update",
        params
    )
}




