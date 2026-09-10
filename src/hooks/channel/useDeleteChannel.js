import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteChannel } from "../../api/channel";
import { useChannelContext } from "./useChannelContext";
import { toast } from "../../store/useToastStore";

export const useDeleteChannel = () => {
  const queryClient = useQueryClient();
  const { setActiveChannel } = useChannelContext();

  const mutation = useMutation({
    mutationFn: ({ channelId }) => deleteChannel(channelId),
    onSuccess: (_data, variables) => {
      setActiveChannel(null);
      queryClient.invalidateQueries({ queryKey: ["channels"] });
      toast.warn(
        "Channel deleted",
        variables.name ? `#${variables.name} is gone` : ""
      );
    },
  });

  return {
    deleteChannel: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};
