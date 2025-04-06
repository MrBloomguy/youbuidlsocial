import type React from 'react';

const FloatingButton: React.FC = () => {
  return (
    <button
      className="fixed bottom-20 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-white shadow-lg"
      aria-label="Create new post"
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor" />
      </svg>
    </button>
  );
};

export default FloatingButton;
