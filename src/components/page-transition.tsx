'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { LoadingState } from '@/components/loading-state';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionComplete, setTransitionComplete] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const prevPathRef = useRef<string | null>(null);

  // Determine loading state type based on pathname
  const getLoadingType = () => {
    if (pathname?.startsWith('/profile')) return 'profile';
    if (pathname?.startsWith('/post/')) return 'post';
    if (pathname === '/feed' || pathname === '/notifications' || pathname === '/leaderboard') return 'feed';
    return 'default';
  };

  useEffect(() => {
    if (pathname) {
      // Don't show loading state for initial render
      if (prevPathRef.current !== null) {
        setIsTransitioning(true);
        setTransitionComplete(false);

        // Show loading state after a short delay (only if transition takes longer than 100ms)
        const loadingTimeout = setTimeout(() => {
          setShowLoading(true);
        }, 100);

        // Short delay to allow exit animation
        const transitionTimeout = setTimeout(() => {
          setDisplayChildren(children);
          setIsTransitioning(false);
          setShowLoading(false);

          // Allow time for entry animation
          setTimeout(() => {
            setTransitionComplete(true);
          }, 200);
        }, 300);

        return () => {
          clearTimeout(loadingTimeout);
          clearTimeout(transitionTimeout);
        };
      }

      prevPathRef.current = pathname;
    }
  }, [pathname, children]);

  return (
    <div
      className={cn(
        'transition-all duration-300 ease-in-out',
        isTransitioning ? 'opacity-0 transform translate-y-1' : 'opacity-100 transform translate-y-0',
        !transitionComplete && 'overflow-hidden'
      )}
    >
      {showLoading ? (
        <div className="animate-in fade-in duration-300">
          <LoadingState type={getLoadingType()} />
        </div>
      ) : (
        displayChildren
      )}
    </div>
  );
}
