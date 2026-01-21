import axios, { AxiosError, AxiosRequestConfig, AxiosHeaders } from "axios";
import { storeToken, getToken, removeToken } from "./auth";
import toast from "react-hot-toast";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URI,
  withCredentials: true, // CRITICAL: This allows cookies to be sent/received
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Ensure cookies work in production
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

// ================== Request Interceptor ==================
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      console.log("➡️ [Request] URL:", config.url, "| Token:", token ? "Yes" : "No", "| Cookies:", document.cookie ? "Present" : "None");
    } else {
      console.log("➡️ [Request] URL:", config.url, "| Token:", token ? "Yes" : "No");
    }

    // Always send accessToken in Authorization header if available
    // The refreshToken cookie (httpOnly) will be sent automatically by the browser
    if (token) {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    // CRITICAL: Ensure credentials are always sent to include cookies
    // This is essential for cookies to work in production (Vercel)
    config.withCredentials = true;
    
    // Set proper headers for cookie handling
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }
    config.headers.set('Content-Type', 'application/json');
    config.headers.set('Accept', 'application/json');

    return config;
  },
  (error: AxiosError) => {
    console.error("❌ [Request Error]:", error);
    return Promise.reject(error);
  }
);

// ================== Response Interceptor ==================
apiClient.interceptors.response.use(
  (response) => {
    console.log("✅ [Response Success] URL:", response.config.url, "| Status:", response.status);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as (AxiosRequestConfig & { _retry?: boolean });

    // Don't handle canceled requests (expected when React Query cancels stale requests)
    if (error.code === 'ERR_CANCELED' || error.message === 'canceled' || error.name === 'CanceledError') {
      return Promise.reject(error);
    }

    // Don't log 404 errors for /me endpoint as they're expected when not authenticated
    const isMeEndpoint404 = error.response?.status === 404 && error.config?.url?.includes('/me');
    
    // Show toast for server errors (500+) and network errors
    if (!isMeEndpoint404) {
      const status = error.response?.status;
      const errorData = error.response?.data as { error?: string; message?: string } | undefined;
      const errorMessage = errorData?.error || errorData?.message || error.message || 'An error occurred';
      
      // Only show toast for critical errors (500+, network errors)
      // Other errors (400, 401, 403, 404) are handled by specific mutation handlers
      if (!status || status >= 500) {
        toast.error(errorMessage || 'Server error. Please try again later.');
      } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        toast.error('Network error. Please check your connection.');
      }
    }

    // === Token expired (401) হলে ===
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn("⚠️ [Auth] Access token expired. Trying refresh token...");

      try {
        // Check cookies before refresh (for debugging)
        if (typeof window !== 'undefined') {
          const cookiesBeforeRefresh = document.cookie;
          console.log("🔄 [Auth Interceptor] Cookies before refresh:", cookiesBeforeRefresh || "No cookies found");
        }

        // Use apiClient to ensure withCredentials is set
        const refreshResponse = await apiClient.post(
          '/api/v1/auth/refresh-token',
          {},
          { 
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            }
          }
        );

        console.log("🔄 [Refresh API Response]:", refreshResponse.data);

        // Check cookies after refresh
        if (typeof window !== 'undefined') {
          const cookiesAfterRefresh = document.cookie;
          console.log("🍪 [Auth Interceptor] Cookies after refresh:", cookiesAfterRefresh || "No cookies found");
        }

        const newAccessToken: string | undefined = refreshResponse.data?.data?.accessToken;
        if (!newAccessToken) {
          throw new Error("No new access token returned from refresh endpoint!");
        }

        storeToken(newAccessToken);
        console.log("✅ [Auth Interceptor] New access token stored");

        originalRequest.headers = originalRequest.headers || new AxiosHeaders();
        (originalRequest.headers as AxiosHeaders).set('Authorization', `Bearer ${newAccessToken}`);
        console.log("🔁 Retrying original request:", originalRequest.url);

        return apiClient(originalRequest);
      } catch (err: unknown) {
        const refreshError = err as AxiosError;
        const errorStatus = refreshError.response?.status;
        const errorData = refreshError.response?.data as { error?: string; message?: string } | undefined;
        const errorMessage = errorData?.error || errorData?.message || refreshError.message;
        
        console.error("❌ [Auth Interceptor] Refresh failed:", {
          status: errorStatus,
          message: errorMessage,
          cookies: typeof window !== 'undefined' ? document.cookie : 'N/A',
        });
        
        const refreshErrorMessage = errorStatus === 401 || errorStatus === 404 
          ? "Your session has expired. Please log in again." 
          : "Unable to refresh session. Please log in again.";
        
        toast.error(refreshErrorMessage);
        removeToken();
        
        // Clear all queries on refresh failure
        if (typeof window !== "undefined") {
          // Redirect to signin if refresh token is invalid/missing
          // This happens when cookies are empty or expired
          const currentPath = window.location.pathname;
          if (!currentPath.includes('/signin')) {
            window.location.href = `/signin?redirect=${encodeURIComponent(currentPath)}`;
          }
        }
        
        // Reject the error so the original request fails
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
