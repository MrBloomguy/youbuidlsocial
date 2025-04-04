'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  type?: 'feed' | 'profile' | 'post' | 'default';
  count?: number;
  className?: string;
}

export function LoadingState({ 
  type = 'default', 
  count = 3,
  className
}: LoadingStateProps) {
  switch (type) {
    case 'feed':
      return (
        <div className={cn("space-y-4 p-4", className)}>
          {Array.from({ length: count }).map((_, index) => (
            <div key={`feed-skeleton-${index}`} className="bg-card rounded-lg p-4 animate-pulse">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-10 w-10 rounded-full bg-muted"></div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded"></div>
                  <div className="h-3 w-16 bg-muted rounded"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded"></div>
                <div className="h-4 w-5/6 bg-muted rounded"></div>
                <div className="h-4 w-4/6 bg-muted rounded"></div>
              </div>
              <div className="mt-4 flex justify-between">
                <div className="h-8 w-16 bg-muted rounded"></div>
                <div className="h-8 w-16 bg-muted rounded"></div>
                <div className="h-8 w-16 bg-muted rounded"></div>
                <div className="h-8 w-16 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      );
      
    case 'profile':
      return (
        <div className={cn("max-w-2xl mx-auto p-4", className)}>
          <Skeleton className="h-32 w-full rounded-t-xl" />
          
          <div className="relative px-4">
            <div className="absolute -top-16">
              <Skeleton className="h-32 w-32 rounded-full" />
            </div>

            <div className="pt-20">
              <div className="flex justify-between items-start">
                <div>
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32 mt-2" />
                  <Skeleton className="h-4 w-40 mt-2" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>

              <Skeleton className="h-20 w-full mt-4" />

              <div className="flex gap-4 mt-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
              </div>

              <div className="flex gap-6 mt-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </div>
        </div>
      );
      
    case 'post':
      return (
        <div className={cn("max-w-2xl mx-auto p-4", className)}>
          <div className="bg-card rounded-lg p-4 animate-pulse">
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-10 w-10 rounded-full bg-muted"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded"></div>
                <div className="h-3 w-16 bg-muted rounded"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-4 w-3/4 bg-muted rounded"></div>
            </div>
            <div className="mt-4 h-[200px] w-full bg-muted rounded"></div>
            <div className="mt-4 flex justify-between">
              <div className="h-8 w-16 bg-muted rounded"></div>
              <div className="h-8 w-16 bg-muted rounded"></div>
              <div className="h-8 w-16 bg-muted rounded"></div>
              <div className="h-8 w-16 bg-muted rounded"></div>
            </div>
          </div>
          
          <div className="mt-4 space-y-4">
            <div className="bg-card rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="h-8 w-8 rounded-full bg-muted"></div>
                <div className="h-4 w-32 bg-muted rounded"></div>
              </div>
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-4 w-5/6 bg-muted rounded mt-1"></div>
            </div>
          </div>
        </div>
      );
      
    default:
      return (
        <div className={cn("space-y-4 p-4", className)}>
          {Array.from({ length: count }).map((_, index) => (
            <div key={`default-skeleton-${index}`} className="bg-card rounded-lg p-4 animate-pulse">
              <div className="h-4 w-3/4 bg-muted rounded mb-2"></div>
              <div className="h-4 w-full bg-muted rounded mb-2"></div>
              <div className="h-4 w-1/2 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      );
  }
}
