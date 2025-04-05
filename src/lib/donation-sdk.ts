import { createPublicClient, http, createWalletClient, custom, parseEther, type WalletClient } from 'viem';
import { optimismSepolia } from 'viem/chains';
import { donationContractABI } from '@/contracts/DonationContract';

interface DonationSDKConfig {
  projectId: string;
  chainId: number;
}

interface DonationParams {
  recipient?: string;
  amount: string;
  streamId: string;  // Make streamId required
  metadata?: {
    postExcerpt?: string;
    authorName?: string;
  };
}

const EXPECTED_CONTRACT_ADDRESS = "0x94207105ab27a2b3eebeab7fa0c60ab674c77883";

export class DonationSDK {
  private contractAddress: `0x${string}`;
  private publicClient: any;
  private walletClient: WalletClient;

  constructor(config: DonationSDKConfig) {
    const configuredAddress = process.env.NEXT_PUBLIC_DONATION_CONTRACT_ADDRESS;

    if (!configuredAddress) {
      throw new Error('Donation contract address not configured');
    }

    if (configuredAddress.toLowerCase() !== EXPECTED_CONTRACT_ADDRESS.toLowerCase()) {
      throw new Error(`Invalid contract address. Expected ${EXPECTED_CONTRACT_ADDRESS}`);
    }

    this.contractAddress = configuredAddress as `0x${string}`;

    this.publicClient = createPublicClient({
      chain: optimismSepolia,
      transport: http()
    });

    // Initialize wallet client only if ethereum is available
    if (typeof window !== 'undefined' && window.ethereum) {
      this.walletClient = createWalletClient({
        chain: optimismSepolia,
        transport: custom(window.ethereum)
      });
    } else {
      // Create a placeholder wallet client that will be initialized later
      this.walletClient = {} as WalletClient;
    }
  }

  // Initialize or re-initialize the wallet client
  private ensureWalletClient() {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('No ethereum wallet found. Please connect your wallet first.');
    }

    // Re-initialize wallet client to ensure it's using the current window.ethereum
    this.walletClient = createWalletClient({
      chain: optimismSepolia,
      transport: custom(window.ethereum)
    });
  }

  // Add error handling and validation
  async donate(params: DonationParams) {
    // Ensure wallet client is initialized
    this.ensureWalletClient();

    // Validate minimum amount
    const minAmount = '0.001';
    if (parseFloat(params.amount) < parseFloat(minAmount)) {
      throw new Error(`Minimum donation amount is ${minAmount} ETH`);
    }

    // Validate streamId format
    if (!params.streamId || typeof params.streamId !== 'string') {
      throw new Error('Invalid streamId format');
    }

    try {
      const [account] = await this.walletClient.requestAddresses();

      // Add balance check before donation
      const balance = await this.publicClient.getBalance({
        address: account
      });

      const value = parseEther(params.amount);
      if (balance < value) {
        throw new Error('Insufficient balance for donation');
      }

      // Simulate the transaction first to get potential errors
      await this.publicClient.simulateContract({
        address: this.contractAddress,
        abi: donationContractABI,
        functionName: 'donateETH',
        args: [params.streamId],
        value: value,
        account
      });

      const hash = await this.walletClient.writeContract({
        address: this.contractAddress,
        abi: donationContractABI,
        functionName: 'donateETH',
        args: [params.streamId],
        value: value,
        account
      });

      const receipt = await this.publicClient.waitForTransactionReceipt({
        hash,
        confirmations: 1
      });

      if (receipt.status === 'reverted') {
        throw new Error('Transaction reverted on-chain');
      }

      return receipt;
    } catch (error: any) {
      console.error('Donation failed:', {
        error,
        params,
        contractAddress: this.contractAddress
      });
      throw new Error(error?.message || 'Transaction failed');
    }
  }

  async withdraw() {
    // Ensure wallet client is initialized
    this.ensureWalletClient();

    const [account] = await this.walletClient.requestAddresses();

    const hash = await this.walletClient.writeContract({
      address: this.contractAddress,
      abi: donationContractABI,
      functionName: 'withdrawDonations',
      account: account as `0x${string}`
    });

    return this.publicClient.waitForTransactionReceipt({ hash });
  }

  async getDonationRecipient(streamId: string): Promise<string> {
    try {
      const data = await this.publicClient.readContract({
        address: this.contractAddress,
        abi: donationContractABI,
        functionName: 'streamToAuthor',
        args: [streamId]
      });
      return data;
    } catch (error) {
      console.error('Failed to get donation recipient:', error);
      throw error;
    }
  }

  async getDonationHistory(streamId: string) {
    try {
      const events = await this.publicClient.getContractEvents({
        address: this.contractAddress,
        abi: donationContractABI,
        eventName: 'DonationReceived',
        args: {
          streamId: streamId
        },
        fromBlock: 'earliest'
      });
      return events;
    } catch (error) {
      console.error('Failed to get donation history:', error);
      throw error;
    }
  }
}











