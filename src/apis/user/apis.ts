import {apiClient} from '@/utils/apiClient';
import { USER } from './endpoints';

interface ApiError {
  response?: {
    status?: number;
    data?: {
      error?: string;
      message?: string;
    };
  };
  message?: string;
}


export const getLoggedInUser = async () => {
  try {
    const response = await apiClient.get(`${USER}/me`);
    return response.data;
  } catch (error) {
    const err = error as ApiError;
    // Don't log 404 as error if user is not authenticated
    if (err.response?.status !== 404) {
      console.error('Error fetching logged-in user:', err.response?.data?.error || err.message);
    }
    throw new Error(err.response?.data?.error || 'Failed to fetch user');
  }
};

export const getLoggedInRoleUser = async () => {
  try {
    const response = await apiClient.get(`${USER}/role`);
    return response.data;
  } catch (error) {
    const err = error as ApiError;
    console.error('Error fetching logged-in role:', err.response?.data?.error || err.message);
    throw new Error(err.response?.data?.error || 'Failed to fetch role');
  }
};

export const updatePasswordApi = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  try {
    const response = await apiClient.patch(`${USER}/${userId}/update-password`, {
      oldPassword,
      newPassword,
    });

    return response.data;
  } catch (error) {
    const err = error as ApiError;
    const message =
      err.response?.data?.message  ||
      err.response?.data?.error ||
      err.message ||
      'Failed to update password';

    throw new Error(message);
  }
};