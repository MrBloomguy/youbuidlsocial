'use client';

import { createConfig, WagmiConfig } from 'wagmi';
import { optimismSepolia } from 'wagmi/chains';
import { http } from 'viem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';

// Ensure we have a projectId for WalletConnect
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'c4f79cc821d1f3bc3e31e7b296956d38';

// Configure the wagmi client
const config = createConfig({
  chains: [optimismSepolia],
  transports: {
    [optimismSepolia.id]: http()
  }
});

// Create a client for react-query
const queryClient = new QueryClient();

/**
 * WagmiProvider component that provides wagmi context to the application
 * This uses WagmiConfig which is compatible with wagmi v1.x
 */
export function WagmiCompatProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Only render on client-side to avoid SSR issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render the full provider during SSR
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiConfig>
  );
}
