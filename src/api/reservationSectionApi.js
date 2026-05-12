import { apiClient } from "./apiClient"

export const reservationMeta = async (params) => {
    const { data } = await apiClient.get(
        `/reservation/meta`,
        { params }
    );
    return data.response;
};

export const availabilitySearch = async (params) => {
    const { data } = await apiClient.get(
        `/availability/search`,
        { params }
    );
    return data.response;
};


export const rateQuote = async (params) => {
    const { data } = await apiClient.get(
        `/rate/quote`,
        { params }
    );
    return data.response;
};

export const createReservation = async (params) => {
    const {data} = await apiClient.post(
        `/reservation/create`,
        params
    );
    return data.response;
}

export const reservationList = async (params) => {
  const { data } = await apiClient.get("/reservations", { params });
  return data.response;
};

export const reservationDetails = async (params) => {
  const { data } = await apiClient.get("/reservation", { params });
  return data.response;
};


