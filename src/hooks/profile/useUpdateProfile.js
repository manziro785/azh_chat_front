import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editProfileInfo } from "../../api/profile";
import { toast } from "../../store/useToastStore";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => editProfileInfo(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.ok("Profile saved", `You are now ${data?.user?.nickname ?? ""}`);
    },
  });

  return {
    updateProfile: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};
