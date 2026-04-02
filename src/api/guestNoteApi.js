import { apiClient } from "./apiClient";

export const getGuestMeta = async (params) => {
  const { data } = await apiClient.get("guest/meta", params);
  return data.response;
};

// FETCH LIST (GET usually stays with params)
export const getGuestNotes = async (params) => {
  const { data } = await apiClient.get("/guest-notes", { params })
  return data.response;
};

// GET DETAIL
export const getGuestNoteDetail = async (params) => {
  const { data } = await apiClient.get("/guest-note",
    { params });
  return data.response;
};

export const upsertGuestNote = async (params) => {
  const { data } = await apiClient.post
    ("/guest-note/upsert",
      params
    );
  return data.response;
};




