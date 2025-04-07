'use client';

import "./globals.css";
import { ThemeProvider } from "next-themes";
import { NotificationProvider } from "@/components/notification-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { PointsProvider } from "@/providers/points-provider";
import { Toaster } from "@/components/ui/toaster";
import { MobileNav } from "@/components/mobile-nav";
// Import Inter font
import { Inter } from 'next/font/google';
import { PrivyClientProvider } from '@/providers/privy-provider';
import { WalletProvider } from '@/providers/rainbow-kit-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClientOnly } from '@/components/client-only';
import { useEffect } from 'react';
import { registerServiceWorker } from '@/utils/register-sw';
import Head from 'next/head';
import { PageTransition } from '@/components/page-transition';
import { initializeOrbis } from '@/lib/orbis';

// Initialize the Inter font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

// Configure the QueryClient with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't refetch on window focus
      staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
      gcTime: 1000 * 60 * 30, // Cache for 30 minutes (formerly cacheTime)
      retry: 1, // Only retry once
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Register service worker and initialize Orbis only on client side
  useEffect(() => {
    // Register service worker
    try {
      registerServiceWorker();
    } catch (error) {
      console.error('Failed to register service worker:', error);
    }

    // Initialize Orbis connection
    try {
      initializeOrbis().catch(error => {
        console.error('Failed to initialize Orbis:', error);
      });
    } catch (error) {
      console.error('Error initializing Orbis:', error);
    }
  }, []);

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <title>YouBuidl</title> {/* Add this line for the app name */}
        <meta name="description" content="The Builder's Community" /> {/* Add this line for the tagline */}
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </Head>
      <body>
        <ClientOnly>
          <QueryClientProvider client={queryClient}>
            <WalletProvider>
              <PrivyClientProvider>
                <ThemeProvider
                  defaultTheme="system"
                  enableSystem
                  attribute="class"
                >
                  <NotificationProvider>
                    <AuthProvider>
                      <PointsProvider>
                        <PageTransition>
                          {children}
                        </PageTransition>
                        <Toaster />
                        <MobileNav />
                      </PointsProvider>
                    </AuthProvider>
                  </NotificationProvider>
                </ThemeProvider>
              </PrivyClientProvider>
            </WalletProvider>
          </QueryClientProvider>
        </ClientOnly>
      </body>
    </html>
  );
}

// LoginButton component moved to src/components/login-button.tsx
