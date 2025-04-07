'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';

// Fallback app ID for development/testing
const FALLBACK_PRIVY_APP_ID = 'cm8ki21cg00q7tcgdnn0emd1t';

export function PrivyClientProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Only render on client-side to avoid SSR issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get the Privy app ID from environment variables or use fallback
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || FALLBACK_PRIVY_APP_ID;

  // Get the WalletConnect project ID from environment variables or use fallback
  const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'c4f79cc821d1f3bc3e31e7b296956d38';

  // Don't render anything during SSR
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          showWalletLoginFirst: true,
        },
        walletConnectProjectId: walletConnectProjectId,
        embeddedWallets: {
          createOnLogin: 'all',
          noPromptOnSignature: false,
          requireUserPasswordOnCreate: false,
        }
      }}
    >
      {children}
    </PrivyProvider>
  );
}





