// Test script to verify environment variables
console.log('Testing environment variables');

// Check Privy app ID
console.log('NEXT_PUBLIC_PRIVY_APP_ID:', process.env.NEXT_PUBLIC_PRIVY_APP_ID);

// Check WalletConnect project ID
console.log('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID:', process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID);

// Check fallback mechanism
const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'cm8ki21cg00q7tcgdnn0emd1t';
console.log('Fallback Privy app ID:', privyAppId);

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'c4f79cc821d1f3bc3e31e7b296956d38';
console.log('Fallback WalletConnect project ID:', walletConnectProjectId);

console.log('Test complete');
