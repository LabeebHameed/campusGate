import { useQuery } from "@tanstack/react-query";
import { useApiClient, userApi } from "../utils/api";

export const useCurrentUser = () => {
  const api = useApiClient();

  const {
    data: currentUser,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const response = await userApi.getCurrentUser(api);
        return response.data;
      } catch (error) {
        console.error('Error fetching current user:', error);
        throw error;
      }
    },
    select: (data) => data?.user || data,
    retry: 2,
    retryDelay: 1000,
  });

  return { currentUser, isLoading, error, refetch };
};
