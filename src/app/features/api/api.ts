import { getConfig } from "@/app/features/config/config.service";
import { API_MOCK_PREFIX } from "./api.contants";

export function getEndpoint(service: string) {
  return getConfig(`endpoints.${service}`) ?? `${API_MOCK_PREFIX}/api`;
}
