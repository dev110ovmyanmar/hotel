// // import { useQuery } from "@tanstack/react-query";

// // export const useApiQuery = ({
// //   queryKey,
// //   queryFn,
// //   enabled = true,
// //   options = {},
// // }) => {
// //   return useQuery({
// //     queryKey,
// //     queryFn,
// //     enabled,
// //     ...options,
// //   });
// // };

// // import { useQuery } from "@tanstack/react-query";

// // export const useApiQuery = ({ queryKey, apiFn, payload, options = {} }) => {
// //   return useQuery({
// //     queryKey,
// //     queryFn: () => apiFn(payload),
// //     ...options,
// //   });
// // };

// import { useQuery } from "@tanstack/react-query";

// /**
//  * useApiQuery - generic hook for all API calls
//  *
//  * @param {string} fetchQueryName - unique query key name
//  * @param {function} fetchQueryFunction - API function to call
//  * @param {object} params - dynamic parameters (keyword, status, page, etc.)
//  * @param {object} options - optional React Query options (enabled, staleTime, etc.)
//  */
// export const useApiQuery = ({
//   fetchQueryName,
//   fetchQueryFunction,
//   params = {},
//   options = {},
// }) => {
//   // Build a "userRequest" object (optional: depends on your API)
//   const userRequest = {
//     ...params,
//     pagination: params.page ? { page: params.page } : undefined,
//   };

//   return useQuery({
//     queryKey: [fetchQueryName, { userRequest }],
//     queryFn: ({ queryKey }) => {
//       const [, requestParams] = queryKey;
//       return fetchQueryFunction(requestParams);
//     },
//     keepPreviousData: true, // useful for pagination
//     ...options, // pass extra options (like enabled, staleTime, etc.)
//   });
// };

// export default useApiQuery;


import { useQuery } from "@tanstack/react-query";

/**
 * Generic API hook with optional params and caching
 */
export const useApiQuery = ({
  fetchQueryName,
  fetchQueryFunction,
  params = {},
  options = {},
}) => {
  return useQuery({
    queryKey: params && Object.keys(params).length > 0
      ? [fetchQueryName, params]
      : [fetchQueryName],
    queryFn: () => fetchQueryFunction(params),
    keepPreviousData: true,
    staleTime: 24 * 60 * 60 * 1000, // 1 day
    cacheTime: 24 * 60 * 60 * 1000,  // keep cache for 1 day
    refetchOnWindowFocus: false,     // optional
    ...options,
  });
};

export default useApiQuery;