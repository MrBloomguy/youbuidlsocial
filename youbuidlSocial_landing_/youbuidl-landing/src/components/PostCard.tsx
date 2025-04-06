import type React from 'react';

interface Post {
  id: number;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  content: {
    type: 'video' | 'audio' | 'gallery';
    title: string;
    description?: string;
    mediaUrl?: string;
    audioTitle?: string;
    audioAuthor?: string;
    images?: string[];
    videoPlaceholder?: boolean;
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
  nft?: {
    minted: number;
    price: number;
    currency: string;
    remaining: string;
  };
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="mb-6 overflow-hidden rounded-lg bg-zinc-900">
      {/* Header with avatar and author info */}
      <div className="flex items-center gap-3 p-4">
        <img
          src={post.author.avatar}
          alt={post.author.name}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <h3 className="font-medium">{post.author.name}</h3>
          <p className="text-xs text-gray-400">{post.date}</p>
        </div>
      </div>

      {/* Post content */}
      <div className="px-4">
        <h2 className="mb-2 text-lg font-medium">{post.content.title}</h2>
        {post.content.description && (
          <p className="mb-4 text-sm text-gray-300 whitespace-pre-line">{post.content.description}</p>
        )}
      </div>

      {/* Media content based on type */}
      {post.content.type === 'video' && post.content.mediaUrl && (
        <div className="relative mt-2 aspect-video w-full overflow-hidden">
          <img
            src={post.content.mediaUrl}
            alt={post.content.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
                <path d="M8 5v14l11-7z" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {post.content.type === 'video' && post.content.videoPlaceholder && (
        <div className="relative mt-2 aspect-video w-full bg-zinc-800 flex items-center justify-center">
          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
              <path d="M8 5v14l11-7z" fill="currentColor" />
            </svg>
          </button>
        </div>
      )}

      {post.content.type === 'audio' && (
        <div className="mt-2 overflow-hidden">
          <div className="relative flex items-center bg-zinc-800 p-3">
            <img
              src={post.content.mediaUrl}
              alt={post.content.audioTitle}
              className="h-16 w-16 rounded object-cover"
            />
            <div className="ml-3 flex-1">
              <p className="font-medium">{post.content.audioTitle}</p>
              <p className="text-sm text-gray-400">{post.content.audioAuthor}</p>
              <div className="mt-1 flex items-center">
                <span className="text-xs">00:00</span>
                <div className="mx-2 h-0.5 flex-1 bg-zinc-700" />
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                    <path d="M8 5v14l11-7z" fill="currentColor" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {post.content.type === 'gallery' && post.content.images && (
        <div className="mt-2 grid grid-cols-2 gap-1">
          {post.content.images.slice(0, 4).map((image, index) => (
            <div key={`image-${post.id}-${index}`} className={`aspect-square overflow-hidden ${index === 0 ? 'col-span-2 row-span-2' : ''}`}>
              <img
                src={image}
                alt={`Gallery image ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Interaction stats */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex gap-4">
          <button className="flex items-center gap-1 text-gray-400">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" />
            </svg>
            <span className="text-sm">{post.stats.likes}</span>
          </button>
          <button className="flex items-center gap-1 text-gray-400">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
              <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z" fill="currentColor" />
            </svg>
            <span className="text-sm">{post.stats.comments}</span>
          </button>
          <button className="flex items-center gap-1 text-gray-400">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" fill="currentColor" />
            </svg>
            <span className="text-sm">{post.stats.shares}</span>
          </button>
        </div>
      </div>

      {/* NFT section */}
      {post.nft && (
        <div className="border-t border-zinc-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {post.nft.minted > 1 ? `${post.nft.minted} friends minted` : `${post.nft.minted} friend minted`}
              </span>
              <span className="text-xs text-gray-400">{post.nft.remaining} left</span>
            </div>
          </div>
          <button className="mt-2 flex w-full items-center justify-center gap-1 rounded-md bg-orange-500 py-2 font-medium text-white">
            <span>Mint</span>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
              <path d="M13 3L16 6H20V10L23 13L20 16V20H16L13 23L10 20H6V16L3 13L6 10V6H10L13 3Z" fill="currentColor" />
            </svg>
            <span>{post.nft.price} {post.nft.currency}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PostCard;
