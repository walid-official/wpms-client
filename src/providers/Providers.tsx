'use client';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
// import { SessionProvider } from "next-auth/react";
import { Toaster } from 'react-hot-toast';
import { ReduxProvider } from '@/store/ReduxProvider';
import { AuthInitializer } from '@/components/auth/AuthInitializer';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider>
        <AuthInitializer />
        <ReactQueryDevtools initialIsOpen={false} />
        {children}  
      <Toaster position="top-right" reverseOrder={false} />
      </ ReduxProvider>
    </QueryClientProvider>
  );
}