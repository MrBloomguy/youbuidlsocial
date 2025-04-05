'use client';

import { useAccount } from 'wagmi';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, memo, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Trophy, MessageSquare, Home as HomeIcon, Bell as BellIcon, User as UserIcon, PlusSquare as PlusSquareIcon } from 'lucide-react';

// Memoize the MobileNav component to prevent unnecessary re-renders
const MobileNavComponent = memo(function MobileNav() {
  const { address } = useAccount();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('');
  const touchStartRef = useRef<number>(0);
  const touchEndRef = useRef<number>(0);
  const lastNavigationTimeRef = useRef<number>(0);

  // Prefetch all routes on mount
  useEffect(() => {
    setMounted(true);

    // Prefetch all main routes immediately
    const routesToPrefetch = [
      '/feed',
      '/notifications',
      '/leaderboard',
      '/messages',
      '/compose'
    ];

    // Prefetch all routes in parallel
    Promise.all(routesToPrefetch.map(route => router.prefetch(route)));

    // If user is logged in, prefetch their profile page
    if (address) {
      router.prefetch(`/profile/${address}`);
    }

    // Set active tab based on current pathname
    setActiveTab(pathname || '');
  }, [router, address, pathname]);

  // Handle touch events for swipe navigation
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = e.targetTouches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    touchEndRef.current = e.changedTouches[0].clientX;
    handleSwipe();
  }, []);

  const handleSwipe = useCallback(() => {
    // Prevent rapid navigation (throttle to 300ms)
    const now = Date.now();
    if (now - lastNavigationTimeRef.current < 300) return;

    const SWIPE_THRESHOLD = 100; // Minimum distance for a swipe
    const diff = touchStartRef.current - touchEndRef.current;

    // Only navigate if the swipe is significant
    if (Math.abs(diff) < SWIPE_THRESHOLD) return;

    // Determine navigation direction
    const routes = ['/feed', '/messages', '/leaderboard', '/notifications', '/profile'];
    const currentIndex = routes.findIndex(route =>
      pathname === route || (route === '/profile' && pathname?.startsWith('/profile'))
    );

    if (currentIndex === -1) return;

    let nextIndex;
    if (diff > 0) {
      // Swipe left - go to next tab
      nextIndex = Math.min(currentIndex + 1, routes.length - 1);
    } else {
      // Swipe right - go to previous tab
      nextIndex = Math.max(currentIndex - 1, 0);
    }

    // Navigate to the new route
    const nextRoute = routes[nextIndex];
    if (nextRoute === '/profile' && address) {
      router.push(`/profile/${address}`);
    } else {
      router.push(nextRoute);
    }

    lastNavigationTimeRef.current = now;
  }, [pathname, router, address]);

  const profilePath = mounted && address ? `/profile/${address}` : '#';

  return (
    <>
      {/* Floating Compose Button with improved touch response */}
      <Link
        href="/compose"
        className="fixed right-4 bottom-20 z-50 md:hidden transform transition-transform active:scale-95 touch-manipulation"
      >
        <Button
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
          size="icon"
        >
          <PlusSquareIcon className="h-6 w-6" />
        </Button>
      </Link>

      {/* Navigation with swipe gesture support */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background md:hidden touch-manipulation"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center justify-around">
          {/* Optimized navigation links with better performance */}
          <NavLink
            href="/feed"
            isActive={pathname === '/feed'}
            icon={<HomeIcon className="w-5 h-5" />}
            label="Feed"
          />

          <NavLink
            href="/messages"
            isActive={pathname === '/messages'}
            icon={<MessageSquare className="w-5 h-5" />}
            label="Messages"
          />

          <NavLink
            href="/leaderboard"
            isActive={pathname === '/leaderboard'}
            icon={<Trophy className="w-5 h-5" />}
            label="Rank"
          />

          <NavLink
            href="/notifications"
            isActive={pathname === '/notifications'}
            icon={<BellIcon className="w-5 h-5" />}
            label="Alerts"
          />

          <NavLink
            href={profilePath}
            isActive={pathname?.startsWith('/profile')}
            icon={<UserIcon className="w-5 h-5" />}
            label="Profile"
            onClick={(e) => {
              if (!mounted || !address) {
                e.preventDefault();
                // Optionally show a toast or modal prompting to connect wallet
              }
            }}
          />
        </div>
      </nav>
    </>
  );
});

// Optimized NavLink component for mobile navigation
const NavLink = memo(({ href, isActive, icon, label, onClick }: {
  href: string;
  isActive: boolean;
  icon: React.ReactNode;
  label: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center flex-1 h-full py-3 px-2 text-xs transition-colors duration-150 touch-manipulation",
        isActive ? 'text-primary' : 'text-muted-foreground'
      )}
      onClick={onClick}
      prefetch={true}
    >
      <div className={cn(
        "relative flex items-center justify-center w-10 h-10 mb-1 rounded-full",
        isActive ? 'bg-primary/10' : 'bg-transparent'
      )}>
        {icon}
        {isActive && (
          <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary"></span>
        )}
      </div>
      <span className={cn(
        "font-medium transition-opacity",
        isActive ? 'opacity-100' : 'opacity-70'
      )}>{label}</span>
    </Link>
  );
});

NavLink.displayName = 'NavLink';
MobileNavComponent.displayName = 'MobileNav';

// Export the optimized component
export const MobileNav = MobileNavComponent;
