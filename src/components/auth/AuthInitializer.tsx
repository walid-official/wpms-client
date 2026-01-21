'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { initializeAuth, storeToken } from '@/utils/auth';
import { apiClient } from '@/utils/apiClient';

/**
 * Component that initializes authentication on app mount
 * - Restores token from localStorage immediately
 * - If token exists, validates it by attempting to fetch user data
 * - If token is expired, the API interceptor will automatically refresh it using the refreshToken cookie
 * - Token refresh will be handled automatically by the API interceptor when needed
 */
export function AuthInitializer() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const initAuth = async () => {
      // Restore token from localStorage on mount
      const token = initializeAuth();
      
      if (token) {
        console.log('🔄 [Auth Init] Token restored from localStorage');
        
        // Invalidate user queries to trigger refetch with restored token
        // If token is expired, the interceptor will handle refresh automatically
        queryClient.invalidateQueries({ queryKey: ['loggedInUser'] });
        queryClient.invalidateQueries({ queryKey: ['loggedInRoleUser'] });
      } else {
        console.log('🔄 [Auth Init] No token found in localStorage');
        // If no token, check if refreshToken cookie exists by attempting refresh
        // This handles the case where cookies persist but localStorage was cleared
        try {
          const response = await apiClient.post('/api/v1/auth/refresh-token', {}, { withCredentials: true });
          const newAccessToken = response.data?.data?.accessToken;
          if (newAccessToken) {
            storeToken(newAccessToken);
            console.log('🔄 [Auth Init] Token restored from refreshToken cookie');
            queryClient.invalidateQueries({ queryKey: ['loggedInUser'] });
            queryClient.invalidateQueries({ queryKey: ['loggedInRoleUser'] });
          }
        } catch (error) {
          // No refresh token cookie, user needs to login
          console.log('🔄 [Auth Init] No refresh token cookie found');
        }
      }
    };

    initAuth();
  }, [queryClient]);

  return null; // This component doesn't render anything
}

