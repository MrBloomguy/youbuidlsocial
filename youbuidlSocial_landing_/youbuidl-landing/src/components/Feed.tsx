import type React from 'react';
import PostCard from './PostCard';

// Mock data for our feed
const mockPosts = [
  {
    id: 1,
    author: {
      name: 'galverse',
      avatar: 'https://ext.same-assets.com/840946650/2857415803.webp'
    },
    date: 'Aug 03 2023',
    content: {
      type: 'video' as const, // Strictly typed as 'video'
      title: 'Tove Lo - I like u (Official Music Video)',
      description: 'Stream I like u Out Now: https://tovelo.ffm.to/ilikeu\n\nMusic: Tove Lo\n\nSpecial Thanks: Galverse Community ...',
      mediaUrl: 'https://ext.same-assets.com/840946650/677793770.webp',
    },
    stats: {
      likes: 457,
      comments: 35,
      shares: 111
    }
  },
  {
    id: 2,
    author: {
      name: 'internetfase',
      avatar: 'https://ext.same-assets.com/840946650/3642536894.webp'
    },
    date: 'Oct 04 2023',
    content: {
      type: 'audio' as const, // Strictly typed as 'audio'
      title: 'beat of the week 2023, week 40 of 52',
      description: '"metamorphosis"\n\nall cover art by @stellarhobbes\n\n#BOTW #impressyourself',
      mediaUrl: 'https://ext.same-assets.com/840946650/3232657145.webp',
      audioTitle: '#BOTW 40 - metamorphosis',
      audioAuthor: 'internetfase',
    },
    stats: {
      likes: 369,
      comments: 48,
      shares: 169
    },
    nft: {
      minted: 1,
      price: 8,
      currency: 'WMATIC',
      remaining: '80/100'
    }
  },
  {
    id: 3,
    author: {
      name: 'jovana_kvrzic',
      avatar: 'https://ext.same-assets.com/840946650/2054210888.webp'
    },
    date: 'Oct 21 2023',
    content: {
      type: 'gallery' as const, // Strictly typed as 'gallery'
      title: 'Alger, Algeria',
      description: 'The more I travel, the more I long to travel\n\nWhat\'s the name of that syndrome, and does anyone else suffer from it?\n\nWhenever I visit a destination I didn\'t know much about before, I always think anew, "God, our world is so vast, and time is so limited."...',
      images: [
        'https://ext.same-assets.com/840946650/639370031.webp',
        'https://ext.same-assets.com/840946650/3962404453.webp',
        'https://ext.same-assets.com/840946650/2754716419.webp',
        'https://ext.same-assets.com/840946650/1888923102.webp',
        'https://ext.same-assets.com/840946650/2422727893.webp',
      ]
    },
    stats: {
      likes: 387,
      comments: 63,
      shares: 86
    },
    nft: {
      minted: 38,
      price: 1,
      currency: 'WMATIC',
      remaining: '1800/2000'
    }
  },
  {
    id: 4,
    author: {
      name: 'mstrbstrd',
      avatar: 'https://ext.same-assets.com/840946650/596831843.png'
    },
    date: 'Jan 18 2024',
    content: {
      type: 'video' as const, // Strictly typed as 'video'
      title: 'The Dream. 1 of 1 on here. What do you think?',
      videoPlaceholder: true,
    },
    stats: {
      likes: 33,
      comments: 2,
      shares: 0
    },
    nft: {
      minted: 9,
      price: 20,
      currency: 'WMATIC',
      remaining: '203/500'
    }
  }
];

const Feed: React.FC = () => {
  return (
    <div className="mx-auto max-w-lg px-4 py-6 md:px-0">
      {mockPosts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Feed;
