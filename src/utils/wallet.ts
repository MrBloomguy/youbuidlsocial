/**
 * Safely checks if window.ethereum is available
 * This handles cases where the browser might block access to window.ethereum
 */
export function isEthereumAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.ethereum;
  } catch (error) {
    console.warn('Error checking for ethereum availability:', error);
    return false;
  }
}

/**
 * Safely gets the ethereum provider
 * Returns null if not available or access is restricted
 */
export const getEthereumProvider = () => {
  try {
    if (typeof window === 'undefined') return null;

    // Check for injected ethereum provider
    if (window.ethereum) {
      // Handle multiple wallets
      const providers = (window as any).ethereum.providers;
      if (providers) {
        // Prioritize MetaMask if available
        const metaMaskProvider = providers.find((p: any) => p.isMetaMask);
        if (metaMaskProvider) return metaMaskProvider;
        // Fallback to first available provider
        return providers[0];
      }
      return window.ethereum;
    }
    return null;
  } catch (error) {
    console.warn('Error accessing ethereum provider:', error);
    return null;
  }
};

/**
 * Safely checks if a wallet is connected
 * Returns false if ethereum is not available or if there are no connected accounts
 */
export const isWalletConnected = async () => {
  try {
    const provider = getEthereumProvider();
    if (!provider) return false;

    try {
      const accounts = await provider.request({ method: 'eth_accounts' });
      return Array.isArray(accounts) && accounts.length > 0;
    } catch (requestError) {
      console.warn('Error requesting accounts:', requestError);
      return false;
    }
  } catch (error) {
    console.error('Error checking wallet connection:', error);
    return false;
  }
};

/**
 * Safely requests ethereum accounts
 * Returns empty array if access is denied or ethereum is not available
 */
export async function requestEthereumAccounts(): Promise<string[]> {
  try {
    if (!isEthereumAvailable()) {
      return [];
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      return Array.isArray(accounts) ? accounts : [];
    } catch (requestError) {
      console.warn('Error requesting ethereum accounts:', requestError);
      return [];
    }
  } catch (error) {
    console.warn('Error in requestEthereumAccounts:', error);
    return [];
  }
}
