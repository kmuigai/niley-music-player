interface SpotifyApi {
  accessToken: string;
}

export class SpotifyWebApi {
  private accessToken: string;
  private baseUrl = 'https://api.spotify.com/v1';

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Get current user profile
  async getMe() {
    return this.request('/me');
  }

  // Get user's playlists
  async getUserPlaylists(limit = 20, offset = 0) {
    return this.request(`/me/playlists?limit=${limit}&offset=${offset}`);
  }

  // Get user's recently played tracks
  async getRecentlyPlayed(limit = 20) {
    return this.request(`/me/player/recently-played?limit=${limit}`);
  }

  // Get user's saved tracks (liked songs)
  async getSavedTracks(limit = 20, offset = 0) {
    return this.request(`/me/tracks?limit=${limit}&offset=${offset}`);
  }

  // Search for tracks
  async search(query: string, type = 'track', limit = 20) {
    const encodedQuery = encodeURIComponent(query);
    return this.request(`/search?q=${encodedQuery}&type=${type}&limit=${limit}`);
  }

  // Get current playback state
  async getPlaybackState() {
    return this.request('/me/player');
  }

  // Play a track
  async play(trackUri?: string) {
    const body = trackUri ? { uris: [trackUri] } : undefined;
    return this.request('/me/player/play', {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // Pause playback
  async pause() {
    return this.request('/me/player/pause', {
      method: 'PUT',
    });
  }

  // Skip to next track
  async next() {
    return this.request('/me/player/next', {
      method: 'POST',
    });
  }

  // Skip to previous track
  async previous() {
    return this.request('/me/player/previous', {
      method: 'POST',
    });
  }

  // Set volume
  async setVolume(volumePercent: number) {
    return this.request(`/me/player/volume?volume_percent=${volumePercent}`, {
      method: 'PUT',
    });
  }

  // Get track details
  async getTrack(trackId: string) {
    return this.request(`/tracks/${trackId}`);
  }

  // Get playlist tracks
  async getPlaylistTracks(playlistId: string, limit = 50, offset = 0) {
    return this.request(`/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`);
  }

  // Get playlist details
  async getPlaylist(playlistId: string) {
    return this.request(`/playlists/${playlistId}`);
  }
} 