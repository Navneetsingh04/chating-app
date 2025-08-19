import { useQuery } from "@tanstack/react-query";
import { getAuthUsers } from "../lib/api";

const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUsers,
    retry: false,
  });
  return {isLoading: authUser.isLoading, authUser: authUser.data?.user};
};

export default useAuthUser;
