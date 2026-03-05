import axios from "axios";
import { getConfig } from "@/app/features/config/config.service";
import { API_MOCK_PREFIX } from "./api.constants";
import {
  setupRequestInterceptor,
  setupResponseInterceptor
} from "./api.interceptors";

export function getEndpoint(service: string) {
  return getConfig(`endpoints.${service}`) ?? `${API_MOCK_PREFIX}/api`;
}

export const apiClient = axios.create();

// Set baseURL lazily via request interceptor so config is ready
apiClient.interceptors.request.use((requestConfig) => {
  if (!requestConfig.baseURL) {
    requestConfig.baseURL = getEndpoint("default");
  }
  return requestConfig;
});

setupRequestInterceptor(apiClient);
setupResponseInterceptor(apiClient);
