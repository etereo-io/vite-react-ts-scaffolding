import { useConfig } from "@/app/features/config/providers/ConfigProvider";

import { MockAuthProvider } from "./MockAuthProvider";
import { SimpleAuthProvider } from "./SimpleAuthProvider";

interface Props {
  readonly children: React.ReactNode;
}

export function AuthProvider({ children }: Props) {
  const { config } = useConfig();

  const useMockAuth = config?.oauth?.disabled === true || import.meta.env.DEV;

  if (useMockAuth) {
    return <MockAuthProvider>{children}</MockAuthProvider>;
  }

  return <SimpleAuthProvider>{children}</SimpleAuthProvider>;
}
