// auth.ts


let accessToken: string | null = null;
const TOKEN_KEY = "accessToken";

// Initialize token from localStorage on module load (if in browser)
if (typeof window !== "undefined") {
  accessToken = localStorage.getItem(TOKEN_KEY);
}

export const storeToken = (token: string) => {
  accessToken = token;
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
};


export const getToken = (): string | null => {
  // If token is not in memory, try to restore from localStorage
  if (!accessToken && typeof window !== "undefined") {
    accessToken = localStorage.getItem(TOKEN_KEY);
  }
  return accessToken;
};

// Initialize/restore token - call this on app mount
export const initializeAuth = (): string | null => {
  if (typeof window !== "undefined") {
    accessToken = localStorage.getItem(TOKEN_KEY);
    if (accessToken) {
      console.log("✅ [Auth] Token restored from localStorage");
    }
    return accessToken;
  }
  return null;
};

export const removeToken = () => {
  accessToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// Clear all authentication data including tokens from localStorage and cookies
export const clearAllAuthData = () => {
  // Clear in-memory token
  accessToken = null;
  
  if (typeof window !== "undefined") {
    // Clear all token-related items from localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    
    // Clear all cookies by setting them to expire in the past
    // Note: httpOnly cookies can only be cleared server-side, but we'll try to clear any client-side cookies
    const cookies = document.cookie.split(";");
    const domain = window.location.hostname;
    const path = "/";
    
    // Common cookie names that might be used
    const cookieNames = [
      "refreshToken",
      "refresh_token",
      "accessToken",
      "access_token",
      "token",
      "authToken",
    ];
    
    // Clear each cookie by setting it to expire in the past
    cookieNames.forEach((cookieName) => {
      // Clear for current domain
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain};`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=.${domain};`;
      
      // Also try to clear with secure flag if on HTTPS
      if (window.location.protocol === "https:") {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; secure;`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}; secure;`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=.${domain}; secure;`;
      }
    });
    
    // Clear all cookies found in document.cookie (for any other token-related cookies)
    cookies.forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      
      // Clear if it looks like a token cookie
      if (name.toLowerCase().includes("token") || name.toLowerCase().includes("auth")) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain};`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=.${domain};`;
      }
    });
  }
};

export const requireAuth = () => {
  const token = getToken();
  if (!token) {
    if (typeof window !== "undefined") {
      window.location.href = "/signin"; 
    }
    return false;
  }
  return true;
};

// Simple boolean check
export const isAuthenticated = (): boolean => {
  return !!getToken();
};
