"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { formatAddress } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { orbis } from "@/lib/orbis";
import { Post } from "@/hooks/use-posts";

type PointsEarner = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  points: number;
  level: number;
};

function TopPost({ post }: { post: Post }) {
  return (
    <Link
      href={`/post/${post.id}`}
      className="px-4 py-3 hover:bg-secondary/80 transition-colors block"
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={post.author.avatar} alt={post.author.name} />
          <AvatarFallback>{formatAddress(post.author.id)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium mb-1 truncate">
            {post.author.name || formatAddress(post.author.id)}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {post.content}
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span>❤️ {post.stats.likes}</span>
            <span>💬 {post.stats.comments}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function RightSidebar() {
  const [mounted, setMounted] = useState(false);
  const [topEarners, setTopEarners] = useState<PointsEarner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Simplified version without external dependencies
  const mockTopEarners = [
    {
      id: '0x1234567890abcdef',
      name: '0x1234...cdef',
      username: '0x1234...cdef',
      avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=user1',
      points: 1250,
      level: 4
    },
    {
      id: '0xabcdef1234567890',
      name: '0xabcd...7890',
      username: '0xabcd...7890',
      avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=user2',
      points: 980,
      level: 3
    },
    {
      id: '0x9876543210abcdef',
      name: '0x9876...cdef',
      username: '0x9876...cdef',
      avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=user3',
      points: 750,
      level: 3
    }
  ];

  // Fetch real posts from Orbis
  const fetchRecentPosts = async () => {
    try {
      setLoading(true);

      if (!orbis) {
        throw new Error('Orbis client not initialized');
      }

      // Ensure Orbis is connected before making requests
      const { status: isConnected } = await orbis.isConnected();
      if (!isConnected) {
        await orbis.connect();
      }

      const { data, error: orbisError } = await orbis.getPosts({
        context: 'youbuidl:post'
      });

      if (orbisError) {
        throw new Error(`Orbis error: ${orbisError}`);
      }

      if (!Array.isArray(data)) {
        console.error('Unexpected Orbis response:', data);
        throw new Error('Invalid response format from Orbis');
      }

      const transformedPosts = data.map(post => {
        if (!post || typeof post !== 'object') {
          console.warn('Invalid post data:', post);
          return null;
        }

        return {
          id: post.stream_id || '',
          content: post.content?.body || '',
          author: {
            id: post.creator || '',
            name: post.creator_details?.profile?.username ||
                 (post.creator ? `${post.creator.slice(0, 6)}...${post.creator.slice(-4)}` : ''),
            username: post.creator_details?.profile?.username || post.creator || '',
            avatar: post.creator_details?.profile?.pfp ||
                   `https://api.dicebear.com/9.x/bottts/svg?seed=${post.creator || 'default'}`,
            verified: false
          },
          timestamp: post.timestamp ? new Date(post.timestamp * 1000).toISOString() : new Date().toISOString(),
          stats: {
            likes: Number(post.count_likes) || 0,
            comments: Number(post.count_replies) || 0,
            reposts: Number(post.count_haha) || 0
          }
        };
      }).filter((post): post is Post => post !== null);

      const sortedPosts = transformedPosts.sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      // Take only the 5 most recent posts
      setRecentPosts(sortedPosts.slice(0, 5));
    } catch (err) {
      console.error('Error fetching posts for sidebar:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    if (mounted) {
      setTopEarners(mockTopEarners);
      fetchRecentPosts();

      // Refresh posts every 60 seconds
      const intervalId = setInterval(() => {
        fetchRecentPosts();
      }, 60000);

      return () => clearInterval(intervalId);
    }
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="w-0 lg:w-[320px] xl:w-[380px] h-full hidden lg:block bg-background">
      <div className="h-full flex flex-col">
        {/* Recent Posts section */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="mb-4">
            <Card className="overflow-hidden rounded-none border-x-0 bg-background">
              <div className="p-4 font-semibold text-sm border-b border-border flex items-center gap-2">
                📝 Recent Posts
              </div>
              <div>
                {loading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : recentPosts.length > 0 ? (
                  recentPosts.map((post) => (
                    <TopPost key={post.id} post={post} />
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-muted-foreground">
                    No recent posts
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Top Earners section */}
          <div className="mb-4">
            <Card className="overflow-hidden rounded-none border-x-0 bg-background">
              <div className="p-4 font-semibold text-sm border-b border-border flex items-center gap-2">
                🏆 Top Earners
              </div>
              <div>
                {isLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : topEarners.length > 0 ? (
                  <div className="divide-y divide-border">
                    {topEarners.map((earner) => (
                      <div key={earner.id} className="p-3 flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={earner.avatar} alt={earner.name} />
                          <AvatarFallback>{earner.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{earner.name}</div>
                          <div className="text-xs text-muted-foreground">{earner.points} points</div>
                        </div>
                        <div className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                          Level {earner.level}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-3 text-sm text-muted-foreground">
                    No data available
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Footer area with hidden scrollbar */}
        <div className="mt-auto pb-16 hide-scrollbar">
          <div className="p-4 text-xs text-muted-foreground">
            <p>© 2023 YouBuidl Social</p>
            <p className="mt-1">Built on Optimism</p>
          </div>
        </div>
      </div>
    </div>
  );
}
