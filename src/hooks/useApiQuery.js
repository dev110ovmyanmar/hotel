import { useQuery } from "@tanstack/react-query";

export const useApiQuery = ({
  fetchQueryName,
  fetchQueryFunction,
  params = {},
  persist = false,
  options = {},
}) => {
  return useQuery({
    queryKey: [fetchQueryName, params],

    queryFn: () => fetchQueryFunction(params),

    meta: { persist },

    ...options,
  });
};

export default useApiQuery;