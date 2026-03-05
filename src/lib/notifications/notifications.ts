import { toast } from "sonner";

export const notifications = {
  success: (message: string) => {
    toast.success(message);
  },
  info: (message: string) => {
    toast.info(message);
  },
  warn: (message: string) => {
    toast.warning(message);
  },
  error: (message: string) => {
    toast.error(message);
  }
};
