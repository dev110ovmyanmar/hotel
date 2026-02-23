import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// 1️⃣ Create React Query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 24 * 60 * 60 * 1000, // 1 day
      cacheTime: 24 * 60 * 60 * 1000, // keep cache 1 day
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// 2️⃣ Setup persistence using localStorage
persistQueryClient({
  queryClient,
  persister: {
    persistClient: async (client) => {
      localStorage.setItem("React_Query_Cache", JSON.stringify(client));
    },
    restoreClient: async () => {
      const cache = localStorage.getItem("React_Query_Cache");
      if (!cache) return undefined;
      return JSON.parse(cache);
    },
    removeClient: async () => {
      localStorage.removeItem("React_Query_Cache");
    },
  },
  maxAge: 24 * 60 * 60 * 1000, // 1 day
});

export default function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}