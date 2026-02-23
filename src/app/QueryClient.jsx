import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 24 * 60 * 60 * 1000, // 1 day (no refetch during this time)
      gcTime: 24 * 60 * 60 * 1000, // keep cache 1 day (React Query v5)
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});