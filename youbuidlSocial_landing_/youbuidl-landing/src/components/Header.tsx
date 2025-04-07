import type React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 z-50 w-full bg-transparent px-4 py-6 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center">
          <div className="mr-2 flex h-8 w-8 items-center justify-center">
            <img
              src="/assets/youbuidlsocialsvg.svg"
              alt="YouBuidl Logo"
              className="h-13 w-13"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-syne-bold text-sm tracking-wide">youbuidl</span>
            <span className="text-xs text-gray-400">Created by GiveStation</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://github.com/givestation/youbuidlsocial" target="_blank" rel="noopener noreferrer">
            <img
              src="/assets/gilogo.svg"
              alt="YouBuidl Logo"
              className="h-8 w-auto transition-transform hover:scale-105"
            />
          </a>
          <a
            href="https://app.youbuidl.social"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#CDEB63] px-5 py-2 text-sm font-syne-bold text-black transition-transform hover:scale-105"
          >
            Launch App
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
