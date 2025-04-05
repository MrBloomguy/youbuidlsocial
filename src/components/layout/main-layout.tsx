'use client';

import React, { memo, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { TooltipProvider } from "@/components/ui/tooltip";

// Dynamically import components to improve initial load time
const Header = dynamic(() => import("./header").then(mod => ({ default: mod.Header })), { ssr: true });
const Sidebar = dynamic(() => import("./sidebar").then(mod => ({ default: mod.Sidebar })), { ssr: false });

// Import RightSidebar directly to avoid chunk loading issues
import { RightSidebar } from './right-sidebar';

interface MainLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showHeader = true
}) => {
  const [mounted, setMounted] = useState(false);

  // Only render client-side components after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Main Header */}
        {showHeader && (
          <>
            {/* Desktop Header */}
            <div className="hidden md:block fixed top-0 left-0 right-0 h-16 z-50 bg-background border-b border-border">
              <Header />
            </div>
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-14 z-50 bg-background border-b border-border">
              <Header />
            </div>
          </>
        )}

        <div className={`flex ${showHeader ? 'pt-14 md:pt-16' : 'pt-0'}`}>
          {/* Sidebar */}
          <div className="hidden md:block w-64 xl:w-72 shrink-0">
            <div className={`fixed ${showHeader ? 'top-16' : 'top-0'} bottom-0 w-64 xl:w-72 overflow-y-auto border-r border-border py-8 px-4`}>
              {mounted && <Sidebar />}
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 min-h-screen w-full">
            {children}
          </main>

          {/* Right Sidebar */}
          <div className="hidden lg:block w-[320px] xl:w-[380px] shrink-0">
            <div className={`fixed ${showHeader ? 'top-16' : 'top-0'} bottom-0 w-[320px] xl:w-[380px] overflow-y-auto hide-scrollbar border-l border-border bg-background`}>
              <div className="pb-16">
                {mounted && <RightSidebar />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default MainLayout;









