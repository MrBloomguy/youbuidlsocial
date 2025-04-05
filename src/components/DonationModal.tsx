'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { useAccount, useConnect } from 'wagmi';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wallet, Star } from 'lucide-react';
import { DonationSDK } from '@/lib/donation-sdk';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  author: {
    name: string;
    address: string;
    avatar?: string;
  };
  streamId: string;
  postExcerpt?: string;
  projectConfig: {
    id: string;
    name: string;
    recipients: {
      address: string;
      chainId: number;
      share: number;
    }[];
    theme: {
      primaryColor: string;
      buttonStyle: string;
      size: string;
      darkMode: boolean;
    };
  };
}

export function DonationModal({
  isOpen,
  onClose,
  author,
  streamId,
  postExcerpt,
  projectConfig
}: DonationModalProps) {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [sdkInstance, setSdkInstance] = useState<DonationSDK | null>(null);
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { toast } = useToast();
  const MIN_DONATION = '0.0001';

  // Initialize SDK only after component mounts to avoid window.ethereum issues
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const sdk = new DonationSDK({
          projectId: projectConfig.id,
          chainId: projectConfig.recipients[0].chainId
        });
        setSdkInstance(sdk);
      } catch (error) {
        console.error('Failed to initialize DonationSDK:', error);
      }
    }
  }, [projectConfig.id, projectConfig.recipients]);

  const DONATION_POINTS = 15; // You can adjust this value or make it dynamic based on amount

  const handleDonate = async () => {
    if (!isConnected) {
      // Try to connect with the first available connector
      if (connectors.length > 0) {
        try {
          connect({ connector: connectors[0] });
        } catch (error) {
          console.error('Connection error:', error);
        }
      }

      toast({
        title: 'Connect Wallet',
        description: 'Please connect your wallet to donate.',
        variant: 'destructive'
      });
      return;
    }

    if (!sdkInstance) {
      toast({
        title: 'SDK Not Ready',
        description: 'Donation service is initializing. Please try again.',
        variant: 'destructive'
      });
      return;
    }

    if (!streamId) {
      toast({
        title: 'Invalid Stream',
        description: 'Stream ID is required for donation',
        variant: 'destructive'
      });
      return;
    }

    if (!amount || parseFloat(amount) < parseFloat(MIN_DONATION)) {
      toast({
        title: 'Invalid amount',
        description: `Minimum donation is ${MIN_DONATION} ETH`,
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsProcessing(true);
      console.log('Attempting donation with:', {
        amount,
        streamId,
        recipient: author.address
      });

      await sdkInstance.donate({
        recipient: author.address,
        amount,
        streamId: streamId.toString(),
        metadata: {
          postExcerpt,
          authorName: author.name
        }
      });

      toast({
        title: 'Donation successful!',
        description: `Thank you for supporting ${author.name}!`
      });
      onClose();
    } catch (error) {
      console.error('Donation error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process donation',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const displayAddress = author.address && author.address !== '0x'
    ? `${author.address.slice(0, 6)}...${author.address.slice(-4)}`
    : 'Address not available';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm p-6">
        <DialogHeader className="flex flex-col items-center space-y-3">
          <Avatar className="w-16 h-16 ring-2 ring-purple-500">
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback>{author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <DialogTitle className="text-xl font-semibold">
              Support {author.name}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Project: {projectConfig.name}
            </p>
            <div className="mt-2">
              <Badge
                variant="secondary"
                className="inline-flex items-center gap-1.5 px-3 py-1.5"
              >
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Earn 15 Points</span>
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <Separator className="my-4" />

        {postExcerpt && (
          <div className="bg-muted/50 p-4 rounded-lg text-sm mb-6">
            <p className="text-xs text-muted-foreground mb-2">From post:</p>
            <p className="line-clamp-3">{postExcerpt}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Amount (ETH)
            </label>
            <Input
              type="number"
              placeholder="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isProcessing}
              className="text-lg"
              min={MIN_DONATION}
              step={MIN_DONATION}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Minimum donation: {MIN_DONATION} ETH
            </p>
          </div>

          <div className="flex gap-2 justify-center">
            {['0.01', '0.05', '0.1'].map((preset) => (
              <Button
                key={preset}
                variant="outline"
                size="sm"
                onClick={() => setAmount(preset)}
                disabled={isProcessing}
              >
                {preset} ETH
              </Button>
            ))}
          </div>

          <Button
            className="w-full h-12 text-base"
            onClick={handleDonate}
            disabled={isProcessing || (!isConnected && !connectors.length) || !author.address || author.address === '0x' || !sdkInstance}
            style={{
              backgroundColor: projectConfig.theme.primaryColor,
              borderRadius: projectConfig.theme.buttonStyle === 'rounded' ? '9999px' : '0.5rem'
            }}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : !sdkInstance ? (
              'Initializing donation service...'
            ) : !author.address || author.address === '0x' ? (
              'Recipient address not available'
            ) : !isConnected ? (
              'Connect Wallet to Donate'
            ) : (
              <>
                <Wallet className="mr-2 h-5 w-5" />
                Donate {amount ? `${amount} ETH` : ''}
              </>
            )}
          </Button>

          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Recipient address: {displayAddress}
            </p>
            <p className="text-xs text-muted-foreground">
              Points will be credited after the transaction is confirmed
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}



