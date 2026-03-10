import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useApiMutation = ({
  mutationFn,
  invalidateKeys = [],
  options = {},
  page
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,

    onSuccess: () => {
      if (page === 1) {
        invalidateKeys.forEach((key) =>
          queryClient.invalidateQueries({ queryKey: key })
        );
      }
    },

    ...options,
  });
};

