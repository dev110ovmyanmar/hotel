import axios from "axios";
import { API_URL, APP_VERSION, BASE_PATH } from "../variables/constants";
import { setupRequestInterceptor, setupResponseInterceptor } from "../app/axiosInterceptors";

export const apiClient = axios.create({
  baseURL: `${API_URL}${BASE_PATH}${APP_VERSION}`,
});

// attach interceptors to this instance
setupRequestInterceptor(apiClient);
setupResponseInterceptor(apiClient);