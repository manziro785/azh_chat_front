import { useQuery } from "@tanstack/react-query";
import { getMeInfo } from "../../api/profile";

// Key used to be ["members"], which collided with the channel member list and
// the user search — updating a profile invalidated all three.
export const useGetProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getMeInfo,
  });
};
