export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: SpotifyImage[];
  followers: {
    total: number;
  };
  country: string;
  product: string; // "premium" or "free"
}

export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  duration_ms: number;
  explicit: boolean;
  uri: string;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyArtist {
  id: string;
  name: string;
  uri: string;
  external_urls: {
    spotify: string;
  };
  images?: SpotifyImage[];
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  images: SpotifyImage[];
  release_date: string;
  total_tracks: number;
  uri: string;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string | null;
  images: SpotifyImage[];
  tracks: {
    total: number;
  };
  owner: {
    id: string;
    display_name: string;
  };
  public: boolean;
  collaborative: boolean;
  uri: string;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyPlaybackState {
  device: {
    id: string;
    is_active: boolean;
    is_private_session: boolean;
    is_restricted: boolean;
    name: string;
    type: string;
    volume_percent: number;
  };
  repeat_state: 'off' | 'track' | 'context';
  shuffle_state: boolean;
  timestamp: number;
  progress_ms: number;
  is_playing: boolean;
  item: SpotifyTrack | null;
}

export interface SpotifySearchResult {
  tracks: {
    items: SpotifyTrack[];
    total: number;
    limit: number;
    offset: number;
  };
}

export interface SpotifyRecentlyPlayed {
  items: {
    track: SpotifyTrack;
    played_at: string;
  }[];
  total: number;
  limit: number;
  offset: number;
}

export interface SpotifyUserPlaylists {
  items: SpotifyPlaylist[];
  total: number;
  limit: number;
  offset: number;
}

export interface SpotifySavedTracks {
  items: {
    added_at: string;
    track: SpotifyTrack;
  }[];
  total: number;
  limit: number;
  offset: number;
} 