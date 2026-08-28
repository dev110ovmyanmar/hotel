import { apiClient } from "./apiClient";

// Folio-Payments-List
export const getfolioPaymentList = async (params) => {
  const { data } = await apiClient.get("folio-payments", { params });
  return data.response;
}