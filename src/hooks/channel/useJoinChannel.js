import { useMutation, useQueryClient } from "@tanstack/react-query";
import { joinChannel } from "../../api/channel";
import { toast } from "../../store/useToastStore";

// Errors are deliberately not toasted here: the join dialog shows them in its
// own banner, right above the code field the user has to fix.
export const useJoinChannel = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (adminCode) => joinChannel(adminCode),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
      const channel = data?.channel;
      toast.ok(
        channel ? `Joined #${channel.name}` : "Joined the channel",
        "Say hello in the channel"
      );
    },
  });

  return {
    joinChannel: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};
