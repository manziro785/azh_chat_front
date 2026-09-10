import { useQuery } from "@tanstack/react-query";
import { searchUsers } from "../api/users";

export const useSearchUsers = (query) => {
  const trimmed = query.trim();

  return useQuery({
    queryKey: ["user-search", trimmed],
    queryFn: () => searchUsers(trimmed),
    enabled: trimmed.length > 0,
    staleTime: 30000,
  });
};
