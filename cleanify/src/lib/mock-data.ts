import { Track, Album, Playlist, Artist, DashboardState, NavigationItem } from '@/types/music';

export const mockTracks: Track[] = [
  {
    id: '1',
    name: 'Anti-Hero',
    artist: 'Taylor Swift',
    album: 'Midnights',
    imageUrl: '/placeholder-album.jpg',
    duration: 200,
    currentTime: 45,
    isPlaying: false,
    isLiked: true,
    explicit: false,
  },
  {
    id: '2',
    name: 'As It Was',
    artist: 'Harry Styles',
    album: "Harry's House",
    imageUrl: '/placeholder-album.jpg',
    duration: 167,
    isLiked: false,
    explicit: false,
  },
  {
    id: '3',
    name: 'Heat Waves',
    artist: 'Glass Animals',
    album: 'Dreamland',
    imageUrl: '/placeholder-album.jpg',
    duration: 238,
    isLiked: true,
    explicit: false,
  },
  {
    id: '4',
    name: 'Good 4 U',
    artist: 'Olivia Rodrigo',
    album: 'SOUR',
    imageUrl: '/placeholder-album.jpg',
    duration: 178,
    isLiked: false,
    explicit: false,
  },
  {
    id: '5',
    name: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    imageUrl: '/placeholder-album.jpg',
    duration: 200,
    isLiked: true,
    explicit: false,
  },
  {
    id: '6',
    name: 'Watermelon Sugar',
    artist: 'Harry Styles',
    album: 'Fine Line',
    imageUrl: '/placeholder-album.jpg',
    duration: 174,
    isLiked: false,
    explicit: false,
  },
];

export const mockPlaylists: Playlist[] = [
  {
    id: '1',
    name: 'Liked Songs',
    description: 'Your favorite tracks',
    imageUrl: '/placeholder-liked.jpg',
    trackCount: 342,
    isOwned: true,
    isPublic: false,
    tracks: mockTracks.filter(track => track.isLiked),
  },
  {
    id: '2',
    name: 'Today\'s Top Hits',
    description: 'The biggest songs right now',
    imageUrl: '/placeholder-tophits.jpg',
    trackCount: 50,
    isOwned: false,
    isPublic: true,
  },
  {
    id: '3',
    name: 'Chill Vibes',
    description: 'Relax and unwind with these chill tracks',
    imageUrl: '/placeholder-chill.jpg',
    trackCount: 87,
    isOwned: true,
    isPublic: true,
  },
  {
    id: '4',
    name: 'Workout Mix',
    description: 'High energy tracks for your workout',
    imageUrl: '/placeholder-workout.jpg',
    trackCount: 23,
    isOwned: true,
    isPublic: false,
  },
  {
    id: '5',
    name: 'Indie Rock Favorites',
    description: 'Best indie rock tracks',
    imageUrl: '/placeholder-indie.jpg',
    trackCount: 156,
    isOwned: true,
    isPublic: true,
  },
];

export const mockArtists: Artist[] = [
  {
    id: '1',
    name: 'Taylor Swift',
    imageUrl: '/placeholder-artist.jpg',
    followers: 74000000,
    isFollowing: true,
  },
  {
    id: '2',
    name: 'Harry Styles',
    imageUrl: '/placeholder-artist.jpg',
    followers: 45000000,
    isFollowing: true,
  },
  {
    id: '3',
    name: 'The Weeknd',
    imageUrl: '/placeholder-artist.jpg',
    followers: 68000000,
    isFollowing: false,
  },
];

export const mockAlbums: Album[] = [
  {
    id: '1',
    name: 'Midnights',
    artist: 'Taylor Swift',
    imageUrl: '/placeholder-album.jpg',
    year: 2022,
    trackCount: 13,
  },
  {
    id: '2',
    name: "Harry's House",
    artist: 'Harry Styles',
    imageUrl: '/placeholder-album.jpg',
    year: 2022,
    trackCount: 13,
  },
  {
    id: '3',
    name: 'After Hours',
    artist: 'The Weeknd',
    imageUrl: '/placeholder-album.jpg',
    year: 2020,
    trackCount: 14,
  },
];

export const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: 'Home',
    href: '/',
    isActive: true,
  },
  {
    id: 'search',
    label: 'Search',
    icon: 'Search',
    href: '/search',
    isActive: false,
  },
  {
    id: 'library',
    label: 'Your Library',
    icon: 'Library',
    href: '/library',
    isActive: false,
  },
];

export const mockDashboardState: DashboardState = {
  playerState: {
    currentTrack: mockTracks[0],
    isPlaying: false,
    volume: 75,
    shuffle: false,
    repeat: 'off',
    queue: mockTracks,
  },
  recentlyPlayed: mockTracks.slice(0, 4),
  topPlaylists: mockPlaylists.slice(0, 3),
  recommendedTracks: mockTracks.slice(2, 6),
  likedSongs: mockTracks.filter(track => track.isLiked),
  user: {
    id: 'user1',
    name: 'Music Lover',
    imageUrl: '/placeholder-user.jpg',
    isPremium: true,
  },
};

// Utility functions for mock data
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatFollowers = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}; 