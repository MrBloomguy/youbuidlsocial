import type React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 z-50 w-full bg-transparent px-4 py-6 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center">
          <div className="mr-2 flex h-8 w-8 items-center justify-center">
          <img
  src="/youbuidlSocial_landing_/output/assets/youbuidlsocialsvg.svg"
  alt="YouBuidl Logo"
  className="h-6 w-6"
/>
          </div>
          <div className="flex flex-col">
            <span className="font-syne-bold text-sm tracking-wide">youbuidl</span>
            <span className="text-xs text-gray-400">Created by GiveStation</span>
          </div>
        </div>
        <div>
        <a href="https://app.youbuidl.social" target="_blank" rel="noopener noreferrer">
  <button
    className="rounded-full bg-[#CDEB63] px-5 py-2 text-sm font-syne-bold text-black transition-transform hover:scale-105"
  >
    Launch App
  </button>
</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
