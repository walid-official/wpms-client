import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signin, logoutUser } from './apis';
import toast from 'react-hot-toast';

interface SigninValues {
  email: string;
  password: string;
}

interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
  message: string;
}

// Signin Mutation
export const useSigninMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: SigninValues) => await signin(data),
    onSuccess: () => {
      // Invalidate and refetch user queries after successful login
      queryClient.invalidateQueries({ queryKey: ['loggedInUser'] });
      queryClient.invalidateQueries({ queryKey: ['loggedInRoleUser'] });
    },
    onError: (error: unknown) => {
      const err = error as ApiError;
      const errorMessage = err.response?.data?.error || err.message || 'Login failed';
      toast.error(errorMessage);
    },
  });
};

// Logout Mutation
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => await logoutUser(),
    onSuccess: () => {
      // Clear all user-related queries on logout
      queryClient.removeQueries({ queryKey: ['loggedInUser'] });
      queryClient.removeQueries({ queryKey: ['loggedInRoleUser'] });
    },
    onError: (error: unknown) => {
      const err = error as ApiError;
      const errorMessage = err.response?.data?.error || err.message || 'Logout failed';
      toast.error(errorMessage);
      // Still clear queries even on error
      queryClient.removeQueries({ queryKey: ['loggedInUser'] });
      queryClient.removeQueries({ queryKey: ['loggedInRoleUser'] });
    },
  });
};