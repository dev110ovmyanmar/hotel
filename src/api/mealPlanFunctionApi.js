import { apiClient } from "./apiClient";

export const fetchMealPlan = async (params) => {
  const { data } = await apiClient.get("/meal-plans", { params });
  return data.response;
};

export const createMealPlan = async (params) => {
  const { data } = await apiClient.post("/meal-plan/upsert", params);
  return data.response;
};

export const editMealPlan = async (params) => {
  const { data } = await apiClient.post("/meal-plan/upsert", params);
  return data.response;
};

export const mealPlanDetails = async (params) => {
  const { data } = await apiClient.get("/meal-plan", { params });
  return data.response;
};
