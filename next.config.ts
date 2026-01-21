import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Note: CORS headers are handled by proxy.ts
  // This ensures proper cookie handling in production (Vercel)
};

export default nextConfig;
