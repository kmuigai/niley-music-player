export interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  imageUrl: string;
  duration: number; // in seconds
  currentTime?: number; // current playback position in seconds
  isPlaying?: boolean;
  isLiked?: boolean;
  explicit?: boolean;
  uri?: string; // Spotify URI
}

export interface Album {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  year: number;
  trackCount: number;
  tracks?: Track[];
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  trackCount: number;
  tracks?: Track[];
  isOwned?: boolean;
  isPublic?: boolean;
  uri?: string; // Spotify URI
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  followers?: number;
  isFollowing?: boolean;
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number; // 0-100
  shuffle: boolean;
  repeat: 'off' | 'track' | 'playlist';
  queue: Track[];
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  isActive?: boolean;
}

export interface SearchResult {
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
  playlists: Playlist[];
}

export interface DashboardState {
  playerState: PlayerState;
  recentlyPlayed: Track[];
  topPlaylists: Playlist[];
  recommendedTracks: Track[];
  likedSongs: Track[];
  user: {
    id: string;
    name: string;
    imageUrl: string;
    isPremium: boolean;
  };
}

export type ViewType = 'home' | 'search' | 'library' | 'playlist' | 'album' | 'artist';

export interface PlaybackControls {
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
} 