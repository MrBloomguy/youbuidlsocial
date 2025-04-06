// Test script to verify WalletConnect projectId
console.log('Testing WalletConnect projectId');

// Check environment variables
console.log('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID:', process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID);

// Check fallback mechanism
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'c4f79cc821d1f3bc3e31e7b296956d38';
console.log('Fallback projectId:', projectId);

console.log('Test complete');
