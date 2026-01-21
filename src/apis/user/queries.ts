import { useMutation, useQuery } from '@tanstack/react-query';
import { getLoggedInRoleUser, getLoggedInUser, updatePasswordApi } from './apis';
import { isAuthenticated } from '@/utils/auth';
import { AxiosError } from 'axios';


export const useLoggedInUser = () => {
  const isAuth = isAuthenticated();
  
  return useQuery({
    queryKey: ['loggedInUser'],
    queryFn: async () => await getLoggedInUser(),
    enabled: isAuth, // Only run query when user is authenticated
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error: unknown) => {
      // Don't retry on 404 errors
      const axiosError = error as AxiosError;
      if (axiosError?.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });
};


export const useLoggedInRoleUser = () => {
  const isAuth = isAuthenticated();
  
  return useQuery({
    queryKey: ['loggedInRoleUser'],
    queryFn: async () => await getLoggedInRoleUser(),
    enabled: isAuth, // Only run query when user is authenticated
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error: unknown) => {
      // Don't retry on 404 errors
      const axiosError = error as AxiosError;
      if (axiosError?.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async (payload: {
      userId: string;
      oldPassword: string;
      newPassword: string;
    }) => {
      return await updatePasswordApi(
        payload.userId,
        payload.oldPassword,
        payload.newPassword
      );
    },
  });
};