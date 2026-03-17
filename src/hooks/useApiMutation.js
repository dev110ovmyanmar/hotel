import { useMutation, useQueryClient } from "@tanstack/react-query";


// Update
export const useApiMutation = ({
  mutationFn,
  invalidateKeys = [],
  shouldInvalidate = true, 
  options = {},
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    ...options,
    onSuccess: (data, variables, context) => {
      if (shouldInvalidate) {
        invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }

      options?.onSuccess?.(data, variables, context);
    },
  });
};
