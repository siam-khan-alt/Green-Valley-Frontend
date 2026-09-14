"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { useToast } from "@/components/ui";
import { makeQueryClient } from "./query-client";

export function QueryProvider({ children }: { children: ReactNode }) {
  const toast = useToast();
  const [client] = useState(() =>
    makeQueryClient((message) =>
      toast({ title: "Request failed", description: message, variant: "error" })
    )
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}