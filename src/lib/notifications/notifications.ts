// notifications api example that can be used to send system-wide notifications
export const notifications = {
  success: (name: string) => {
    // eslint-disable-next-line no-console
    console.log("success =>", name);
  },
  info: (name: string) => {
    // eslint-disable-next-line no-console
    console.info("info =>", name);
  },
  warn: (name: string) => {
    console.warn("warn =>", name);
  },
  error: (name: string) => {
    console.error("error =>", name);
  },
};
