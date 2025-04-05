import { usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import { getProvider, getSigner } from '@/lib/provider';
import pointsContractABI from '@/contracts/contracts/PointsContract.sol/PointsContract.json';
import { MetaTransactionHandler } from '@/lib/meta-transaction';
import { useState, useEffect, useCallback } from 'react';

export function usePointsContract() {
  const { user, ready } = usePrivy();
  const [points, setPoints] = useState<number>(0);
  const [pointsLoading, setPointsLoading] = useState<boolean>(true);

  const contractAddress = process.env.NEXT_PUBLIC_POINTS_CONTRACT_ADDRESS;
  const forwarderAddress = process.env.NEXT_PUBLIC_FORWARDER_ADDRESS;
  const relayerUrl = process.env.NEXT_PUBLIC_RELAYER_URL || 'http://localhost:3001';
  const useGasless = process.env.NEXT_PUBLIC_USE_GASLESS === 'true';

  if (!contractAddress) {
    console.error('Points contract address not configured in environment variables');
  }

  if (useGasless && !forwarderAddress) {
    console.error('Forwarder address not configured in environment variables');
  }

  const validateContractAddress = useCallback(() => {
    if (!contractAddress) {
      throw new Error('Points contract address not configured');
    }
    if (!ethers.isAddress(contractAddress)) {
      throw new Error('Invalid points contract address');
    }
    return contractAddress;
  }, [contractAddress]);

  // Fetch user points
  const fetchUserPoints = useCallback(async (address: string) => {
    try {
      setPointsLoading(true);

      // Validate the user address
      if (!address || !ethers.isAddress(address)) {
        console.warn('Invalid user address for points lookup:', address);
        setPoints(0);
        return;
      }

      const validatedAddress = validateContractAddress();
      const provider = await getProvider();

      const contract = new ethers.Contract(
        validatedAddress,
        pointsContractABI.abi,
        provider
      );

      try {
        const userPoints = await contract.getUserPoints(address);
        setPoints(Number(userPoints));
      } catch (contractError) {
        console.error('Contract error fetching user points:', contractError);
        // Set points to 0 if there's a contract error
        setPoints(0);
      }
    } catch (error) {
      console.error('Error fetching user points:', error);
      // Set points to 0 on error
      setPoints(0);
    } finally {
      setPointsLoading(false);
    }
  }, [validateContractAddress]);

  // Fetch user points when connected
  useEffect(() => {
    if (ready) {
      if (user?.wallet?.address) {
        fetchUserPoints(user.wallet.address);

        // Set up a refresh interval to keep points updated
        const intervalId = setInterval(() => {
          fetchUserPoints(user.wallet.address);
        }, 30000); // Refresh every 30 seconds

        return () => clearInterval(intervalId);
      } else {
        // If user is not connected, set points to 0 and stop loading
        setPoints(0);
        setPointsLoading(false);
      }
    }
  }, [ready, user?.wallet?.address, fetchUserPoints]);

  // Create a meta-transaction handler
  const createMetaTxHandler = useCallback(async () => {
    const provider = await getProvider();
    const network = await provider.getNetwork();
    const chainId = network.chainId;

    if (!forwarderAddress) {
      throw new Error('Forwarder address not configured');
    }

    return new MetaTransactionHandler(
      forwarderAddress,
      provider,
      Number(chainId)
    );
  }, [forwarderAddress]);

  // Execute a function via meta-transaction
  const executeMetaTransaction = useCallback(async (functionName: string, args: unknown[]) => {
    if (!ready || !user?.wallet?.address) {
      throw new Error('Wallet not connected');
    }

    const validatedAddress = validateContractAddress();
    const signer = await getSigner();
    const userAddress = await signer.getAddress();

    // Create contract interface to encode function data
    const contract = new ethers.Contract(
      validatedAddress,
      pointsContractABI.abi,
      signer
    );

    // Encode the function call
    const data = contract.interface.encodeFunctionData(functionName, args);

    // Create meta-transaction handler
    const metaTxHandler = await createMetaTxHandler();
    metaTxHandler.setSigner(signer);

    // Create the request
    const request = await metaTxHandler.createRequest(
      userAddress,
      validatedAddress,
      data
    );

    // Sign the request
    const signature = await metaTxHandler.signRequest(request);

    // Send the meta-transaction to the relayer
    return await metaTxHandler.sendMetaTransaction(request, signature, relayerUrl);
  }, [ready, user?.wallet?.address, validateContractAddress, createMetaTxHandler, relayerUrl]);

  const addLike = useCallback(async (streamId: string) => {
    if (!ready || !user?.wallet) {
      throw new Error('Wallet not connected');
    }

    try {
      const validatedAddress = validateContractAddress();

      // Use gasless transaction if enabled
      if (useGasless) {
        return await executeMetaTransaction('addLike', [streamId]);
      } else {
        // Regular transaction
        const signer = await getSigner();

        const contract = new ethers.Contract(
          validatedAddress,
          pointsContractABI.abi,
          signer
        );

        const tx = await contract.addLike(streamId);
        await tx.wait();

        return tx.hash;
      }
    } catch (error) {
      console.error('Error adding like:', error);
      throw error;
    }
  }, [ready, user?.wallet, validateContractAddress, useGasless, executeMetaTransaction]);

  const createPost = useCallback(async (streamId: string) => {
    if (!ready || !user?.wallet) {
      throw new Error('Wallet not connected');
    }

    try {
      const validatedAddress = validateContractAddress();

      // Use gasless transaction if enabled
      if (useGasless) {
        return await executeMetaTransaction('createPost', [streamId]);
      } else {
        // Regular transaction
        const signer = await getSigner();

        const contract = new ethers.Contract(
          validatedAddress,
          pointsContractABI.abi,
          signer
        );

        const tx = await contract.createPost(streamId);
        await tx.wait();

        return tx.hash;
      }
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }, [ready, user?.wallet, validateContractAddress, useGasless, executeMetaTransaction]);

  const addComment = useCallback(async (streamId: string) => {
    if (!ready || !user?.wallet) {
      throw new Error('Wallet not connected');
    }

    try {
      const validatedAddress = validateContractAddress();

      // Use gasless transaction if enabled
      if (useGasless) {
        return await executeMetaTransaction('addComment', [streamId]);
      } else {
        // Regular transaction
        const signer = await getSigner();

        const contract = new ethers.Contract(
          validatedAddress,
          pointsContractABI.abi,
          signer
        );

        const tx = await contract.addComment(streamId);
        await tx.wait();

        return tx.hash;
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }, [ready, user?.wallet, validateContractAddress, useGasless, executeMetaTransaction]);

  const addRepost = useCallback(async (streamId: string) => {
    if (!ready || !user?.wallet) {
      throw new Error('Wallet not connected');
    }

    try {
      const validatedAddress = validateContractAddress();

      // Use gasless transaction if enabled
      if (useGasless) {
        return await executeMetaTransaction('addRepost', [streamId]);
      } else {
        // Regular transaction
        const signer = await getSigner();

        const contract = new ethers.Contract(
          validatedAddress,
          pointsContractABI.abi,
          signer
        );

        const tx = await contract.addRepost(streamId);
        await tx.wait();

        return tx.hash;
      }
    } catch (error) {
      console.error('Error adding repost:', error);
      throw error;
    }
  }, [ready, user?.wallet, validateContractAddress, useGasless, executeMetaTransaction]);

  return {
    points,
    pointsLoading,
    createPost,
    addLike,
    addComment,
    addRepost,
    isConnected: ready && !!user?.wallet,
    address: user?.wallet?.address,
    isGasless: useGasless
  };
}
