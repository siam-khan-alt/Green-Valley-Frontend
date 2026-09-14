import { QueryClient } from "@tanstack/react-query";
import { extractMessage } from "./http";

export function makeQueryClient(onMutationError: (message: string) => void) {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 30_000,
      },
      mutations: {
        retry: 0,
        onError: (error) => onMutationError(extractMessage(error)),
      },
    },
  });
}