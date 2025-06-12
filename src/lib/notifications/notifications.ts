// notifications api example that can be used to send system-wide notifications
export const notifications = {
  success: (name: string) => {
    // biome-ignore lint/suspicious/noConsole:
    console.log("success =>", name);
  },
  info: (name: string) => {
    // biome-ignore lint/suspicious/noConsole:
    console.info("info =>", name);
  },
  warn: (name: string) => {
    console.warn("warn =>", name);
  },
  error: (name: string) => {
    console.error("error =>", name);
  }
};
