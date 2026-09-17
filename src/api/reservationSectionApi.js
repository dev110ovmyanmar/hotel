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
  const { data } = await apiClient.post(
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

export const reservationEdit = async (params) => {
    const {data} = await apiClient.put(
        `/reservation/edit`,
        params
    );
    return data.response;}

export const updateReservationStatus = async (params) => {
  const { data } = await apiClient.patch(`/reservation/status`, params);
  return data.response;
}


// Reservation-room API
export const reservationRoomList = async (params) => {
  const { data } = await apiClient.get("/reservation-rooms", { params });
  return data.response;
};

export const reservationRoomDetails = async (params) => {
  const { data } = await apiClient.get("/reservation-room", { params });
  return data.response;
};

export const reservationRoomAssign = async (params) => {
  const { data } = await apiClient.patch(`/reservation-room/assign`, params);
  return data.response;
}

export const reservationRoomMeta = async (params) => {
  const { data } = await apiClient.get("reservation-room/meta", { params });
  return data.response;
};

export const reservationRoomSearch = async (params) => {
  const { data } = await apiClient.get("reservation-room/search", { params });
  return data.response;
};

export const createReservationRoom = async (params) => {
  const { data } = await apiClient.post(`/reservation-room/create`, params);
  return data.response;
};

// Reservation-note api
export const reservationNoteList = async (params) => {
  const { data } = await apiClient.get("reservation-notes", { params });
  return data.response;
};

export const reservationNoteCreate = async (params) => {
  const { data } = await apiClient.post(`/reservation-note/upsert`, params);
  return data.response;
};

export const reservationNoteDelete = async (params) => {
  const { data } = await apiClient.delete(`/reservation-note/delete`, { data: params });
  return data.response;
}

// Reservation-guest api
export const reservationGuestList = async (params) => {
  const { data } = await apiClient.get("reservation/guests", { params });
  return data.response;
};

export const reservationGuestUpsert = async (params) => {
  const { data } = await apiClient.post(`/reservation/guest/upsert`, params);
  return data.response;
};

export const reservationGuestDetails = async (params) => {
  const { data } = await apiClient.get("reservation/guest", { params });
  return data.response;
};

// service-order
export const serviceOrderList = async (params) => {
  const { data } = await apiClient.get("service-orders", { params });
  return data.response;
};

export const serviceOrderDetails = async (params) => {
  const { data } = await apiClient.get("service-order", { params });
  return data.response;
};

export const serviceOrderCreate = async (params) => {
  const { data } = await apiClient.post(`service-order/create`, params);
  return data.response;
};

export const updateServiceOrder = async (params) => {
  const { data } = await apiClient.put("/service-order/update", params);
  return data.response;
};

// reservation service add on
export const serviceAddonList = async (params) => {
  const { data } = await apiClient.get("reservations-addons", { params });
  return data.response;
};

export const serviceAddonDetails = async (params) => {
  const { data } = await apiClient.get("reservations-addon", { params });
  return data.response;
};

export const serviceAddonCreate = async (params) => {
  const { data } = await apiClient.post(`reservations-addon/create`, params);
  return data.response;
};

export const updateServiceAddon = async (params) => {
  const { data } = await apiClient.put("/reservations-addon/update", params);
  return data.response;
};

// Folio-Payment/Deposit
export const createFolioPaymentDeposit = async (params) => {
  const { data } = await apiClient.post("folio-payment/deposit", params);
  return data.response;
}

// Folio-Payment/Refund
export const createFolioPaymentRefund = async (params) => {
  const { data } = await apiClient.post("folio-payment/refund", params);
  return data.response;
}

// Folio-Payment/AddPayment
export const createFolioAddPayment = async (params) => {
  const { data } = await apiClient.post("folio-payment/payment", params);
  return data.response;
}

// Folio-Payments-List
// export const folioPaymentList = async (params) => {
//   const { data } = await apiClient.get("folio-payments", { params });
//   return data.response;
// }

// Folio-Payment-Detail
export const folioPaymentDetails = async (params) => {
  const { data } = await apiClient.get("folio-payment", { params });
  return data.response;
}

// Complimentary Update
export const complimentaryUpdate = async (params) => {
  const { data } = await apiClient.put("complimentary/update", params);
  return data.response;
}

// Room Post Upate
export const roomPost = async (params) => {
  const { data } = await apiClient.post("/daily-charge/room-posted", params);
  return data.response; 
}
