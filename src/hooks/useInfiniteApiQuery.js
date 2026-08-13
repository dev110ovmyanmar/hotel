import { useInfiniteQuery } from "@tanstack/react-query";

export const useInfiniteApiQuery = ({
  fetchQueryName,
  fetchQueryFunction,
  params = {},
  options = {},
  enabled = true,
}) => {
  return useInfiniteQuery({
    queryKey: [fetchQueryName, params],

    queryFn: ({ pageParam = 1 }) => {
      return fetchQueryFunction({
        ...params,
        pagination: {
          page: pageParam,
          perPage: params.perPage || 10,
        },
      });
    },

    getNextPageParam: (lastPage, allPages) => {
      // Check if pagination exists and has more pages
      const pagination = lastPage?.pagination;
      if (pagination && pagination.currentPage < pagination.totalPages) {
        return pagination.currentPage + 1;
      }

      // If no pagination info, check if we got any data
      const lastPageData = lastPage?.data || [];
      if (lastPageData.length === 0) {
        return undefined;
      }

      // If we got less than perPage items, no more pages
      if (lastPageData.length < (params.perPage || 10)) {
        console.log('[useInfiniteApiQuery] No more pages (less than perPage)');
        return undefined;
      }
      return allPages.length + 1;
    },

    enabled,
    ...options,
  });
};

export default useInfiniteApiQuery;
