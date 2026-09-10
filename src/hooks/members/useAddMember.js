import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMemberToChannel } from "../../api/members";
import { useChannelContext } from "../channel/useChannelContext";
import { toast } from "../../store/useToastStore";

export const useAddMember = () => {
  const queryClient = useQueryClient();
  const { activeChannel } = useChannelContext();

  const mutation = useMutation({
    mutationFn: ({ userId }) => addMemberToChannel(activeChannel.id, userId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["members", activeChannel.id],
      });
      toast.ok(
        "Member added",
        `${variables.nickname ?? "The user"} can now read and write here`
      );
    },
  });

  return {
    addMember: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};
