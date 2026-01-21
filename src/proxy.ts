import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Proxy to ensure proper cookie handling
 * This proxy ensures cookies are properly forwarded in production (Vercel)
 * 
 * Note: CORS is handled by the backend. This proxy just ensures
 * Next.js doesn't interfere with cookie handling.
 */
export function proxy(request: NextRequest) {
  // Simply forward the request with cookies intact
  // The actual CORS and cookie handling is done by:
  // 1. Backend (sets cookies with proper SameSite/Secure flags)
  // 2. Axios client (sends withCredentials: true)
  // 3. Browser (automatically includes cookies in requests)
  
  const response = NextResponse.next();
  
  // Ensure cookies are preserved (they should be by default, but being explicit)
  // The browser handles cookie transmission automatically when withCredentials: true
  
  return response;
}

// Configure which routes this middleware runs on
// We run on all routes to ensure cookies work everywhere
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - handled by Next.js)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
  ],
};
