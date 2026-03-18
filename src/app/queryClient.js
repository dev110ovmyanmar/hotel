import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // default → override per query
      gcTime: 24 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});