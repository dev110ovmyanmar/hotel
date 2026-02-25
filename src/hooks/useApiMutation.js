import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useApiMutation = ({
  mutationFn,
  invalidateKeys = [],
  options = {},
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,

    onSuccess: () => {
      invalidateKeys.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key })
      );
    },

    ...options,
  });
};