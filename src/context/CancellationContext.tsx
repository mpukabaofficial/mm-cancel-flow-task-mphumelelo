"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CancellationContextType {
  cancellationId: string | null;
  setCancellationId: (id: string | null) => void;
}

const CancellationContext = createContext<CancellationContextType | undefined>(
  undefined
);

export function CancellationProvider({ children }: { children: ReactNode }) {
  const [cancellationId, setCancellationId] = useState<string | null>(null);

  return (
    <CancellationContext.Provider value={{ cancellationId, setCancellationId }}>
      {children}
    </CancellationContext.Provider>
  );
}

export function useCancellation() {
  const context = useContext(CancellationContext);
  if (!context) {
    throw new Error(
      "useCancellation must be used within a CancellationProvider"
    );
  }
  return context;
}
