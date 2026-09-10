import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateChannel } from "../../api/channel";
import { toast } from "../../store/useToastStore";

export const useUpdateChannel = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ idChannel, channelData }) =>
      updateChannel(idChannel, channelData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
      toast.ok("Channel updated");
    },
  });

  return {
    updateChannel: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};
