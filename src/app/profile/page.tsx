'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { MainLayout } from '@/components/layout/main-layout';
import { PageHeader } from '@/components/layout/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAccount } from 'wagmi';
import { LoadingState } from '@/components/loading-state';

export default function ProfilePage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const { address } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // If user is authenticated and has an address, redirect to their profile page
    if (mounted && !isLoading && isAuthenticated && address) {
      router.push(`/profile/${address}`);
    }
  }, [isLoading, isAuthenticated, router, address, mounted]);

  // Show loading state while checking authentication
  if (isLoading || !mounted) {
    return (
      <MainLayout>
        <PageHeader title="Profile" />
        <LoadingState type="profile" />
      </MainLayout>
    );
  }

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <MainLayout>
        <PageHeader title="Profile" />
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold mb-2">Sign in to view your profile</h2>
          <p className="text-muted-foreground mb-6">Connect your wallet to access your profile and activity</p>
          <Button onClick={() => router.push('/')}>Connect Wallet</Button>
        </div>
      </MainLayout>
    );
  }

  // This should not be reached as authenticated users with an address are redirected
  return (
    <MainLayout>
      <PageHeader title="Profile" />
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p>Redirecting to your profile...</p>
      </div>
    </MainLayout>
  );
}
