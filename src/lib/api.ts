export function getEndpoint() {
  return import.meta.env.VITE_APP_ENDPOINT || "/api/";
}
