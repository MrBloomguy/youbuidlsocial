'use client';

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { NotificationProvider } from "@/components/notification-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { PointsProvider } from "@/providers/points-provider";
import { Toaster } from "@/components/ui/toaster";
import { MobileNav } from "@/components/mobile-nav";
import { Inter } from 'next/font/google';
import { PrivyClientProvider } from '@/providers/privy-provider';
import { WalletProvider } from '@/providers/rainbow-kit-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { registerServiceWorker } from '@/utils/register-sw';
import Head from 'next/head';
import { PageTransition } from '@/components/page-transition';
import { initializeOrbis } from '@/lib/orbis';

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
      cacheTime: 1000 * 60 * 30, // Cache for 30 minutes
      retry: 1, // Only retry once
      suspense: false, // Don't use suspense
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Register service worker and initialize Orbis
  useEffect(() => {
    registerServiceWorker();

    // Initialize Orbis connection
    initializeOrbis().catch(error => {
      console.error('Failed to initialize Orbis:', error);
    });
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
      </body>
    </html>
  );
}

export function LoginButton() {
  const { login, logout, authenticated, user, ready } = usePrivy();

  if (!ready) {
    return null;
  }

  if (!authenticated) {
    return (
      <Button
        onClick={login}
        variant="outline"
        className="rounded-full"
      >
        Login
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full">
          {user?.email?.address || user?.wallet?.address?.slice(0, 6) + '...' + user?.wallet?.address?.slice(-4)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={logout}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
















