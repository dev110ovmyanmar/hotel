import { useMutation, useQueryClient } from "@tanstack/react-query";


// Update
export const useApiMutation = ({
  mutationFn,
  invalidateKeys = [],
  options = {},
  shouldInvalidate = true
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,

    onSuccess: () => {
      if (shouldInvalidate) {
        invalidateKeys.forEach((key) =>
          queryClient.invalidateQueries({ queryKey: key })
        );
      }
    },

    ...options,
  });
};

