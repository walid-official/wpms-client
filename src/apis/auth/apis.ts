import axios from 'axios';
import {apiClient} from '@/utils/apiClient';
import { SIGNIN } from './endpoints';
import { storeToken, removeToken, clearAllAuthData } from '@/utils/auth';

interface ApiError {
  response?: {
    status?: number;
    data?: {
      error?: string;
    };
  };
  message?: string;
}

interface SigninValues {
  email: string;
  password: string;
}

//  SIGNIN
export const signin = async (values: SigninValues) => {
  try {
    const response = await apiClient.post(SIGNIN, values, {
      withCredentials: true, // CRITICAL: ensures refreshToken cookie is stored
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Check if cookies were set (for debugging)
    if (typeof window !== 'undefined') {
      const cookiesAfterLogin = document.cookie;
      console.log("🍪 [Login] Cookies after login:", cookiesAfterLogin || "No cookies found");
      
      // Log response headers to check Set-Cookie headers
      const setCookieHeader = response.headers?.['set-cookie'];
      if (setCookieHeader) {
        console.log("🍪 [Login] Set-Cookie headers received:", setCookieHeader);
      } else {
        console.warn("⚠️ [Login] No Set-Cookie headers in response. Backend may not be setting cookies properly.");
      }
    }

    // Note: your login response has the token inside response.data.data
    const accessToken = response.data?.data?.accessToken;

    if (accessToken) {
      storeToken(accessToken); // store accessToken in memory
      console.log("✅ [Login] Access token stored in localStorage");
    } else {
      console.warn("⚠️ [Login] No accessToken found in login response");
    }

    console.log("✅ [Login] Login successful. User:", response.data?.data?.user);

    return response.data?.data; // return { accessToken, refreshToken, user }
  } catch (error) {
    const err = error as ApiError;
    console.error("❌ [Login] Login failed:", {
      status: err.response?.status,
      error: err.response?.data?.error || err.message,
    });
    // Error will be handled by mutation's onError handler which shows toast
    throw new Error(err.response?.data?.error || err.message || "Login failed");
  }
};



// REFRESH TOKEN
// This uses the refreshToken cookie (httpOnly) that was set by the backend
// The cookie is sent automatically with withCredentials: true
export const refreshAccessToken = async () => {
  try {
    // Check cookies before refresh (for debugging)
    if (typeof window !== 'undefined') {
      const cookiesBeforeRefresh = document.cookie;
      console.log("🔄 [Refresh] Cookies before refresh:", cookiesBeforeRefresh || "No cookies found");
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URI}/api/v1/auth/refresh-token`,
      {},
      { 
        withCredentials: true, // CRITICAL: Sends refreshToken cookie automatically
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    );

    // Check if new cookies were set
    if (typeof window !== 'undefined') {
      const cookiesAfterRefresh = document.cookie;
      console.log("🍪 [Refresh] Cookies after refresh:", cookiesAfterRefresh || "No cookies found");
      
      const setCookieHeader = response.headers?.['set-cookie'];
      if (setCookieHeader) {
        console.log("🍪 [Refresh] Set-Cookie headers received:", setCookieHeader);
      }
    }

    // Backend should return new accessToken in response body
    // Backend also sets new accessToken and refreshToken cookies
    const newAccessToken: string | undefined = response.data?.data?.accessToken;
    if (newAccessToken) {
      storeToken(newAccessToken); // Store in localStorage for Authorization header
      console.log("✅ [Refresh] New access token stored");
      return newAccessToken;
    }
    throw new Error('No access token returned from refresh');
  } catch (error) {
    const err = error as ApiError;
    const status = err.response?.status;
    console.error('❌ [Refresh] Refresh token failed:', {
      status,
      message: err.response?.data?.error || err.message,
      cookies: typeof window !== 'undefined' ? document.cookie : 'N/A',
      note: status === 401 || status === 404 
        ? 'Refresh token cookie is missing or expired. Backend may not be setting cookies with proper SameSite/Secure flags for production.' 
        : 'Unknown error'
    });
    removeToken();
    throw error;
  }
};

//  LOGOUT
export const logoutUser = async () => {
  try {
    // Call logout API to clear server-side cookies (httpOnly cookies)
    await apiClient.post(
      '/api/v1/auth/logout',
      {},
      { withCredentials: true } // clears cookies server-side
    );
  } catch (error) {
    console.error('Logout API call failed:', error);
    // Continue with cleanup even if API call fails
  } finally {
    // Always clear all client-side auth data (localStorage and cookies)
    clearAllAuthData();
    
    // Redirect to signin page
    if (typeof window !== 'undefined') {
      window.location.href = '/signin';
    }
  }
};
