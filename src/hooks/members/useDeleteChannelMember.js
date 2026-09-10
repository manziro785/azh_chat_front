import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteChannelMember } from "../../api/members";
import { useChannelContext } from "../channel/useChannelContext";
import { toast } from "../../store/useToastStore";

export const useDeleteChannelMember = () => {
  const queryClient = useQueryClient();
  const { activeChannel } = useChannelContext();

  const mutation = useMutation({
    mutationFn: ({ memberId }) =>
      deleteChannelMember(activeChannel.id, memberId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["members", activeChannel.id],
      });
      toast.warn(
        "Member removed",
        `${variables.nickname ?? "They"} no longer has access`
      );
    },
  });

  return {
    deleteMember: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};
