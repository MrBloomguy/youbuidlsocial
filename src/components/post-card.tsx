import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { usePointsContract } from "@/hooks/usePointsContract";
import { getProvider } from '@/lib/provider';
import pointsContractABI from '@/contracts/contracts/PointsContract.sol/PointsContract.json';
import { usePostInteractions } from "@/hooks/use-post-interactions";
import { orbis } from '@/lib/orbis';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { OptimismLink } from '@/components/optimism-link';
import { usePoints } from '@/providers/points-provider';
import { PointsDisplay } from '@/components/points-display';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DonationBadge } from '@/components/donation-badge';
import { ethers } from 'ethers';
import { useTheme } from "next-themes";
import {
  Heart, MessageCircle, Repeat2, Share, Twitter,
  Mail, Link as LinkIcon, Wallet, Check, Flag,
  Trash, MoreHorizontal, Loader2
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DonationModal } from '@/components/DonationModal';
import { Card, CardContent } from '@/components/ui/card';
import { cn, formatAddress } from '@/lib/utils';
import { Comment } from '@/types/comment';
import { ComposeBox } from '@/components/compose-box';
import { useAccount, useContractRead } from 'wagmi';
import { DonationWidget } from "@/components/donation-widget";
import { Gift } from "lucide-react";

const gatewayUrl = process.env.NEXT_PUBLIC_GATEWAY_URL;

interface PostCardProps {
  post: {
    id: string;
    content: string;
    author: {
      id: string;
      name: string;
      username: string;
      avatar: string;
      verified: boolean;
    };
    timestamp: number;
    stats: {
      likes: number;
      comments: number;
      reposts: number;
    };
    ceramicData?: {
      title: string;
      body: string;
      timestamp: number;
      creator: string;
      banner?: string;
    };
    attestation?: {
      uid: string;
      attester: string;
      recipient: string;
      revoked: boolean;
      timestamp: string;
      expirationTime: string;
    };
    comments?: Comment[];
  };
}

export function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { addLike, addComment } = usePointsContract();
  const {
    like,
    repost,
    comment,
    isProcessing,
    isConnected
  } = usePostInteractions(post.id);

  const [isLiked, setIsLiked] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [likeCount, setLikeCount] = useState(post.stats?.likes || 0);
  const [isReposted, setIsReposted] = useState(false);
  const [repostCount, setRepostCount] = useState(post.stats.reposts);
  const [commentCount, setCommentCount] = useState(post.stats.comments);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showDonationWidget, setShowDonationWidget] = useState(false);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [isLoadingPoints, setIsLoadingPoints] = useState(true);
  const { theme } = useTheme();

  // Check if the current user has liked or reposted this post
  useEffect(() => {
    async function checkUserInteractions() {
      try {
        // For now, we'll just use the local state
        // In a real app, you would check if the user has liked or reposted the post
        // by querying the blockchain or a database

        // This is a placeholder for actual implementation
        // setIsLiked(false);
        // setIsReposted(false);
      } catch (error) {
        console.error('Error checking user interactions:', error);
      }
    }

    checkUserInteractions();
  }, [post.id]);

  // Fetch user points
  useEffect(() => {
    async function fetchUserPoints() {
      // Check if the author's ID is a valid Ethereum address
      const authorId = post.author.id;
      if (!authorId) return;

      // For testing purposes, let's try to use the actual wallet address that we know has points
      // In a real app, you would have a proper mapping between user IDs and wallet addresses
      const authorAddress = '0x741Bc71588D75b35660AE124F6ba6921b00fa958';

      try {
        setIsLoadingPoints(true);
        const provider = await getProvider();

        const contractAddress = process.env.NEXT_PUBLIC_POINTS_CONTRACT_ADDRESS;
        if (!contractAddress) return;

        const contract = new ethers.Contract(
          contractAddress,
          pointsContractABI.abi,
          provider
        );

        console.log('Fetching points for address:', authorAddress);
        const points = await contract.getUserPoints(authorAddress);
        console.log('Points fetched:', Number(points));
        setUserPoints(Number(points));
      } catch (error) {
        console.error('Error fetching user points:', error);
      } finally {
        setIsLoadingPoints(false);
      }
    }

    fetchUserPoints();
  }, [post.author.id]);

  const projectConfig = {
    id: post.id, // Use post ID as project ID
    name: post.author.name,
    recipients: [
      {
        address: post.author.address, // Author's wallet address
        chainId: 11155420, // Optimism Sepolia from your chain config
        share: 100 // Full share to the author
      }
    ],
    theme: {
      primaryColor: '#676FFF', // Matching your app's accent color
      buttonStyle: 'rounded',
      size: 'medium',
      darkMode: theme === 'dark'
    }
  };

  const handlePostClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
      return;
    }
    router.push(`/post/${post.id}`);
  };

  const handleLike = async () => {
    if (isProcessing) return;

    // Optimistic UI update - immediately update the UI
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikeCount(prev => wasLiked ? prev - 1 : prev + 1);

    try {
      // Make the API call in the background - pass the current like state
      const success = await like(wasLiked);

      // If the API call fails, revert the UI
      if (!success) {
        setIsLiked(wasLiked);
        setLikeCount(prev => wasLiked ? prev + 1 : prev - 1);
        throw new Error('Failed to like post');
      }
    } catch (error) {
      // Revert UI changes on error
      setIsLiked(wasLiked);
      setLikeCount(prev => wasLiked ? prev + 1 : prev - 1);

      console.error('Like error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to like post",
        variant: "destructive"
      });
    }
  };

  const handleRepost = async () => {
    if (isProcessing) return;

    // Optimistic UI update - immediately update the UI
    const wasReposted = isReposted;
    setIsReposted(!wasReposted);
    setRepostCount(prev => wasReposted ? prev - 1 : prev + 1);

    // Show a subtle toast for repost
    if (!wasReposted) {
      toast({
        title: "Post reposted",
        description: "Content shared to your feed"
      });
    }

    try {
      // Make the API call in the background - pass the current repost state
      const success = await repost(wasReposted);

      // If the API call fails, revert the UI
      if (!success) {
        setIsReposted(wasReposted);
        setRepostCount(prev => wasReposted ? prev + 1 : prev - 1);
        throw new Error('Failed to repost');
      }
    } catch (error) {
      // Revert UI changes on error
      setIsReposted(wasReposted);
      setRepostCount(prev => wasReposted ? prev + 1 : prev - 1);

      console.error('Repost error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not process repost action",
        variant: "destructive"
      });
    }
  };

  const handleDonate = () => {
    setShowDonateModal(true);
  };

  const handleShare = async (type: 'copy' | 'twitter' | 'email') => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    const text = post.ceramicData?.body || post.content;

    switch (type) {
      case 'copy':
        await navigator.clipboard.writeText(postUrl);
        toast({
          title: "Link copied",
          description: "Post link has been copied to your clipboard"
        });
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(postUrl)}`,
          '_blank'
        );
        break;
      case 'email':
        window.location.href = `mailto:?subject=Check out this post&body=${encodeURIComponent(text)}%0A%0A${encodeURIComponent(postUrl)}`;
        break;
    }
  };

  const formatPostDate = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  // Add this function to safely render content with iframes
  const renderContent = (content: string) => {
    // Split content into text and iframes
    const parts = content.split(/(<iframe.*?<\/iframe>)/g);

    return parts.map((part, index) => {
      if (part.startsWith('<iframe')) {
        // Create a wrapper for the iframe
        return (
          <div key={index} className="my-2 rounded-lg overflow-hidden">
            <div dangerouslySetInnerHTML={{ __html: part }} />
          </div>
        );
      }
      return <p key={index}>{part}</p>;
    });
  };

  const handleCommentClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCommentsOpen(!isCommentsOpen);

    if (!isCommentsOpen && comments.length === 0) {
      setIsLoadingComments(true);
      try {
        // Fetch comments logic
        const fetchedComments = [];
        setComments(fetchedComments);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load comments",
          variant: "destructive"
        });
      } finally {
        setIsLoadingComments(false);
      }
    }
  };

  const handleComment = async (content: string) => {
    if (!content.trim() || !isConnected) {
      if (!isConnected) {
        toast({
          title: "Connect Wallet",
          description: "Please connect your wallet to comment",
          variant: "destructive"
        });
        return;
      }
      return;
    }

    setIsSubmittingComment(true);
    try {
      const tx = await addComment(post.id);

      toast({
        title: "Transaction Sent",
        description: "Waiting for confirmation..."
      });

      // Wait for transaction confirmation
      const provider = await ethers.getDefaultProvider(process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.optimism.io');
      const receipt = await provider.waitForTransaction(tx);

      if (receipt.status === 1) {
        // Fetch updated comments logic
        const updatedComments = [];
        setComments(updatedComments);
        setCommentCount(prev => prev + 1);
        setNewComment('');

        toast({
          title: "Comment posted",
          description: "Transaction confirmed on Optimism"
        });
      }
    } catch (error) {
      console.error('Comment error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not post comment",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Memoize the image rendering function to prevent unnecessary re-renders
  const renderImage = useCallback((ipfsHash: string) => {
    if (!ipfsHash) return null;

    const imageUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    const fallbackUrl = `https://ipfs.io/ipfs/${ipfsHash}`;

    // Generate a low-quality placeholder image
    const blurDataURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEtAI8V7yQCgAAAABJRU5ErkJggg==";

    return (
      <div className="mt-2 relative group">
        <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden bg-muted/30">
          {/* Placeholder div that shows immediately */}
          <div
            className="absolute inset-0 bg-muted/20 animate-pulse rounded-lg"
            style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}
          />

          <Image
            src={imageUrl}
            alt="Post attachment"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded-lg object-cover transition-opacity duration-300"
            loading="lazy"
            priority={false}
            quality={60}
            placeholder="blur"
            blurDataURL={blurDataURL}
            onLoadingComplete={(img) => {
              // Add a fade-in effect when the image loads
              img.classList.remove('opacity-0');
            }}
            onError={(e) => {
              // Try the fallback URL if the primary one fails
              const imgElement = e.currentTarget as HTMLImageElement;
              if (imgElement && !imgElement.src.includes('ipfs.io')) {
                imgElement.src = fallbackUrl;
              }
            }}
            style={{ opacity: 0 }} // Start with opacity 0 for fade-in effect
          />
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-lg" />
      </div>
    );
  }, []);

  return (
    <>
      <Card className="bg-white dark:bg-zinc-900 shadow-sm rounded-xl overflow-hidden mb-4">
        {/* Post Header */}
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-blue-500">
                <AvatarImage
                  src={`https://api.dicebear.com/9.x/bottts/svg?seed=${post.author.username}`}
                  alt={post.author.name}
                />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {post.author.address ? formatAddress(post.author.address) : post.author.name}
                  </span>
                  {post.author.verified && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Check className="w-4 h-4 text-blue-500 ml-1" />
                        </TooltipTrigger>
                        <TooltipContent>Verified</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {/* Add the donation badge here */}
                  <div className="ml-2">
                    <DonationBadge totalDonations={0n} />
                  </div>
                </div>
                <div className="flex items-center text-sm text-zinc-500 space-x-2">
                  <span>{formatPostDate(post.timestamp)}</span>
                  <span>•</span>
                  <div className="flex items-center">
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 px-2 py-0 h-5 text-xs font-medium">
                      {isLoadingPoints ? (
                        <span className="flex items-center">
                          <span className="h-2 w-2 mr-1 rounded-full animate-pulse bg-blue-400"></span>
                          Loading...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                          </svg>
                          {userPoints} points
                        </span>
                      )}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleShare('copy')}>
                  <LinkIcon className="w-4 h-4 mr-2" />Copy link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('twitter')}>
                  <Twitter className="w-4 h-4 mr-2" />Share on Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDonateModal(true)}>
                  <Wallet className="w-4 h-4 mr-2" />Donate
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-500">
                  <Flag className="w-4 h-4 mr-2" />Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Post Content */}
        <div className="px-4" onClick={handlePostClick}>
          {renderContent(post.content)}
        </div>

        {/* Post Stats */}
        <div className="px-4 py-2 flex items-center space-x-4 text-sm text-zinc-500">
        </div>

        {/* Actions */}
        <div className="px-2 py-1 border-t border-zinc-100 dark:border-zinc-800">
          <div className="grid grid-cols-4 gap-1">
            <Button
              variant="ghost"
              className={cn(
                "flex items-center justify-center space-x-2 w-full",
                isLiked && "text-blue-500",
                isProcessing && "opacity-50 cursor-not-allowed"
              )}
              onClick={handleLike}
              disabled={isProcessing}
            >
              <Heart
                className={cn(
                  "w-5 h-5 transition-all duration-300 ease-in-out group-hover:scale-110",
                  isLiked && "fill-current animate-like"
                )}
              />
              <span className={cn(
                "transition-all",
                isLiked && "animate-quick-pulse"
              )}>{likeCount}</span>
            </Button>

            <Button
              variant="ghost"
              className={cn(
                "flex items-center justify-center space-x-2 w-full group",
                isCommentsOpen && "text-blue-500"
              )}
              onClick={handleCommentClick}
            >
              <MessageCircle className="w-5 h-5 transition-all duration-300 ease-in-out group-hover:scale-110" />
              <span>{commentCount}</span>
            </Button>

            <Button
              variant="ghost"
              className={cn(
                "flex items-center justify-center space-x-2 w-full group",
                isReposted && "text-green-500"
              )}
              onClick={handleRepost}
            >
              <Repeat2
                className={cn(
                  "w-5 h-5 transition-all duration-300 ease-in-out group-hover:scale-110",
                  isReposted && "animate-repost text-green-500"
                )}
              />
              <span className={cn(
                "transition-all",
                isReposted && "animate-quick-pulse text-green-500"
              )}>{repostCount}</span>
            </Button>

            {/* New Donate Button */}
            <Button
              variant="ghost"
              className="flex items-center justify-center space-x-2 w-full group hover:text-purple-500"
              onClick={() => setShowDonationWidget(true)}
            >
              <Gift className="w-5 h-5 transition-all duration-300 ease-in-out group-hover:scale-110" />
              <span>Donate</span>
            </Button>
          </div>
        </div>

        {/* Comments Section */}
        {isCommentsOpen && (
          <div className="border-t border-zinc-100 dark:border-zinc-800">
            {/* Comments List */}
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {isLoadingComments ? (
                <div className="flex items-center justify-center py-6">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
                </div>
              ) : comments.length > 0 ? (
                <div className="p-4 space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="group">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={comment.author.avatar} />
                            <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{comment.author.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm mt-1 break-words">{comment.content}</p>
                          <div className="flex items-center gap-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                              <Heart className="h-3.5 w-3.5" />
                              <span>{comment.likes || 0}</span>
                            </button>
                            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                              <MessageCircle className="h-3.5 w-3.5" />
                              <span>Reply</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  <MessageCircle className="h-5 w-5 mx-auto mb-2 opacity-50" />
                  <p>No comments yet</p>
                  <p className="text-xs">Be the first to join the conversation</p>
                </div>
              )}
            </div>

            {/* Comment Input */}
            <div className="border-t border-zinc-100 dark:border-zinc-800 p-3">
              <div className="flex items-start gap-3">
                <Avatar className="h-7 w-7 flex-shrink-0">
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="relative">
                    <Input
                      placeholder={isConnected ? "Write a comment..." : "Connect wallet to comment"}
                      className="bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-offset-0 text-sm pr-[70px]"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleComment(newComment);
                        }
                      }}
                      disabled={isSubmittingComment || !isConnected}
                    />
                    {isSubmittingComment && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
      <DonationModal
        isOpen={showDonateModal}
        onClose={() => setShowDonateModal(false)}
        author={{
          name: post.author.name,
          avatar: post.author.avatar,
          address: post.author.address || post.author.id // Use address if available, fallback to ID
        }}
        streamId={post.id}
        postExcerpt={post.content}
        projectConfig={{
          id: post.id,
          name: post.author.name,
          recipients: [
            {
              address: post.author.address || post.author.id, // Use address if available, fallback to ID
              chainId: 11155420,
              share: 100
            }
          ],
          theme: {
            primaryColor: '#676FFF',
            buttonStyle: 'rounded',
            size: 'medium',
            darkMode: theme === 'dark'
          }
        }}
      />
      <DonationWidget
        isOpen={showDonationWidget}
        onClose={() => setShowDonationWidget(false)}
        projectConfig={{
          id: post.id,
          name: "Project Name" // Replace with actual project name
        }}
        author={{
          name: post.author.name,
          avatar: post.author.avatar,
          address: post.author.address || post.author.id // Use address if available, fallback to ID
        }}
        postExcerpt={post.content}
      />
    </>
  );
}

export function PointsLeaderboard() {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Use useContractRead from wagmi instead of useContract
  const { data: topUsers, isLoading } = useContractRead({
    address: process.env.NEXT_PUBLIC_POINTS_CONTRACT_ADDRESS as `0x${string}`,
    abi: pointsContractABI.abi,
    functionName: 'getTopUsers',
    args: [10], // Get top 10 users
    enabled: mounted, // Only enable the query when component is mounted
  });

  // Set mounted state when component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update loading state when data changes
  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading]);

  if (loading) return <div>Loading leaderboard...</div>;

  // Format the data from the contract
  const leaderboard = topUsers ? Array.isArray(topUsers) ? topUsers : [] : [];

  return (
    <div className="rounded-lg border p-4">
      <h2 className="text-xl font-bold mb-4">Top Contributors</h2>
      <div className="space-y-2">
        {leaderboard.length > 0 ? (
          leaderboard.map((user, index) => (
            <div key={user.user || index} className="flex justify-between items-center">
              <span>#{index + 1} {typeof user.user === 'string' ? `${user.user.slice(0, 6)}...${user.user.slice(-4)}` : 'Unknown'}</span>
              <span>{user.points ? Number(user.points) : 0} points</span>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No data available
          </div>
        )}
      </div>
    </div>
  );
}



