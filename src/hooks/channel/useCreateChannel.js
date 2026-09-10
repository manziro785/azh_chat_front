import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChannel } from "../../api/channel";
import { toast } from "../../store/useToastStore";

export const useCreateChannel = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (params) => createChannel(params),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
      const channel = data?.channel;
      toast.ok(
        "Channel created",
        channel ? `#${channel.name} — invite code ${channel.admin_code}` : ""
      );
    },
  });

  return {
    createChannel: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};
