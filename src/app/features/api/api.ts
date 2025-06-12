import { getConfig } from "@/app/features/config/config.service";

export function getEndpoint(service: string) {
  return getConfig(`endpoints.${service}`) ?? "/api";
}
