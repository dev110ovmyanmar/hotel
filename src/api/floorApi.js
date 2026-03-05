import { apiClient } from "./apiClient";

// export const fetchFloor = async ({ keyword, page, perPage }) => {
//   const { data } = await apiClient.get("floors", {
//     keyword,
//     pagination: { page, perPage },
//   });
//   return data.response;
// };
export const fetchFloor = async ({ keyword, page, perPage }) => {
  const { data } = await apiClient.get("floors", {
    params: {
      keyword,
      page,
      perPage,
    },
  });

  return data.response;
};

export const upsertFloor  = async ({ uuid, name, floorNo, description }) => {
  const { data } = await apiClient.post("floor/upsert", {
    uuid,
    name,
    floorNo,
    description,
  });
  return data.response;
};

export const floorDetail = async ({ uuid }) => {
  const { data } = await apiClient.get("floor", {
     params: { uuid },
  });
  return data.response;
};
