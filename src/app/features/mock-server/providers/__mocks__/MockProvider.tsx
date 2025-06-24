import type React from "react";

export interface MockProviderProps {
  readonly children: React.ReactNode;
}

export function MockProvider({ children }: MockProviderProps) {
  return <>{children}</>;
}
