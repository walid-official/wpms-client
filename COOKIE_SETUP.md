# Cookie Configuration Guide for Vercel Deployment

## Problem
Cookies are not being set/received after login when deployed on Vercel. This is typically due to cookie SameSite, Secure, and Domain settings.

## Frontend Fixes Applied ✅

The following fixes have been applied to the frontend:

1. **Next.js Config** (`next.config.ts`): Added CORS headers for cookie support
2. **API Client** (`src/utils/apiClient.ts`): Enhanced with proper cookie handling and debugging
3. **Middleware** (`src/proxy.ts`): Added Next.js middleware to handle CORS and cookies
4. **Auth APIs** (`src/apis/auth/apis.ts`): Added cookie debugging and proper headers
5. **Vercel Config** (`vercel.json`): Added CORS headers configuration

## Backend Requirements ⚠️

**CRITICAL**: Your backend MUST be configured correctly for cookies to work in production. Here's what needs to be set:

### 1. Cookie Settings (Backend)

When setting cookies in your backend (after login/refresh), use these settings:

```javascript
// Example for Express.js
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,           // Prevents JavaScript access (security)
  secure: true,             // REQUIRED: Only send over HTTPS (Vercel uses HTTPS)
  sameSite: 'none',         // REQUIRED: Allow cross-site cookies (frontend/backend on different domains)
  domain: undefined,        // Don't set domain - let browser handle it
  path: '/',                // Available for all paths
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  // OR use expires instead of maxAge
});

// Example for NestJS
@Res({ passthrough: false })
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
```

### 2. CORS Configuration (Backend)

Your backend CORS must allow credentials:

```javascript
// Express.js example
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-vercel-app.vercel.app',
  credentials: true,  // CRITICAL: Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// NestJS example
app.enableCors({
  origin: process.env.FRONTEND_URL || 'https://your-vercel-app.vercel.app',
  credentials: true,  // CRITICAL: Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
});
```

### 3. Environment Variables

Make sure your backend has the correct frontend URL:

```env
# Backend .env
FRONTEND_URL=https://your-vercel-app.vercel.app
# OR for multiple environments
FRONTEND_URL=https://your-vercel-app.vercel.app,http://localhost:3000
```

### 4. Cookie Names

Ensure your backend uses consistent cookie names:
- `refreshToken` (recommended)
- Or `refresh_token` (if you prefer snake_case)

The frontend will automatically send whatever cookie the backend sets.

## Testing Checklist

1. ✅ Frontend sends `withCredentials: true` in all requests
2. ✅ Backend sets cookies with `sameSite: 'none'` and `secure: true`
3. ✅ Backend CORS allows `credentials: true`
4. ✅ Backend origin matches your Vercel frontend URL
5. ✅ Both frontend and backend are on HTTPS (Vercel provides this)

## Debugging

The frontend now includes extensive cookie debugging. Check your browser console for:

- `🍪 [Login] Cookies after login:` - Shows if cookies were received
- `🍪 [Login] Set-Cookie headers received:` - Shows if backend sent Set-Cookie headers
- `🔄 [Refresh] Cookies before/after refresh:` - Shows cookie state during refresh

## Common Issues

### Issue: Cookies not appearing in browser
**Solution**: Backend must set `sameSite: 'none'` and `secure: true` for cross-domain cookies

### Issue: CORS errors
**Solution**: Backend CORS must have `credentials: true` and correct `origin`

### Issue: Cookies work locally but not on Vercel
**Solution**: 
- Ensure backend uses `sameSite: 'none'` (not 'lax' or 'strict')
- Ensure backend uses `secure: true` (required for HTTPS)
- Check that backend CORS origin includes your Vercel URL

### Issue: Refresh token not working
**Solution**: 
- Verify cookie is being set with correct name
- Check that cookie has `httpOnly: true` (security)
- Ensure cookie is sent with every request (check Network tab)

## Verification Steps

1. **After Login**:
   - Open browser DevTools → Application → Cookies
   - Check if `refreshToken` cookie exists
   - Verify cookie has `Secure` and `SameSite=None` flags

2. **Network Tab**:
   - Check login request → Response Headers → Should see `Set-Cookie: refreshToken=...`
   - Check subsequent requests → Request Headers → Should see `Cookie: refreshToken=...`

3. **Console Logs**:
   - Look for `🍪 [Login] Cookies after login:` message
   - Should show the cookie value if set correctly

## Need Help?

If cookies still don't work after these fixes:

1. Check browser console for cookie-related errors
2. Check Network tab to see if `Set-Cookie` headers are present
3. Verify backend cookie settings match the requirements above
4. Test with a simple curl request to verify backend is setting cookies correctly:

```bash
curl -X POST https://your-backend.com/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' \
  -v \
  -c cookies.txt

# Check if Set-Cookie header is present in response
```
