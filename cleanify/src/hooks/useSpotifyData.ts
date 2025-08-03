import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { SpotifyWebApi } from '@/lib/spotify/api';
import { DashboardState, Track, Playlist } from '@/types/music';

interface SpotifyDataState {
  dashboardData: DashboardState | null;
  loading: boolean;
  error: string | null;
}

export function useSpotifyData() {
  const { data: session } = useSession();
  const [state, setState] = useState<SpotifyDataState>({
    dashboardData: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!session?.accessToken) {
      setState(prev => ({ ...prev, loading: false, error: 'No access token available' }));
      return;
    }

    const fetchSpotifyData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const spotify = new SpotifyWebApi(session.accessToken!);

        // Fetch all the data in parallel for better performance
        const [
          userProfile,
          recentlyPlayedData,
          userPlaylistsData,
          savedTracksData
        ] = await Promise.all([
          spotify.getMe(),
          spotify.getRecentlyPlayed(20),
          spotify.getUserPlaylists(20),
          spotify.getSavedTracks(20)
        ]);

        // Transform Spotify API responses to our app's data structure
        const user: DashboardState['user'] = {
          id: userProfile.id,
          name: userProfile.display_name || 'Spotify User',
          imageUrl: userProfile.images?.[0]?.url || '/placeholder-user.jpg',
          isPremium: userProfile.product === 'premium',
        };

        // Transform recently played tracks
        const recentlyPlayed: Track[] = recentlyPlayedData.items.map((item: any) => ({
          id: item.track.id,
          name: item.track.name,
          artist: item.track.artists.map((artist: any) => artist.name).join(', '),
          album: item.track.album.name,
          imageUrl: item.track.album.images?.[0]?.url || '/placeholder-album.jpg',
          duration: Math.floor(item.track.duration_ms / 1000),
          currentTime: 0,
          isPlaying: false,
          isLiked: false, // We'll determine this from saved tracks
          explicit: item.track.explicit,
          uri: item.track.uri,
        })).slice(0, 4);

        // Transform user playlists
        const playlistsToExclude = ['RACE TIME', 'IG', 'Instagram Reels - Top Trending'];
        const topPlaylists: Playlist[] = userPlaylistsData.items
          .filter((playlist: any) => !playlistsToExclude.includes(playlist.name))
          .map((playlist: any) => ({
            id: playlist.id,
            name: playlist.name,
            description: playlist.description || '',
            imageUrl: playlist.images?.[0]?.url || '/placeholder-playlist.jpg',
            trackCount: playlist.tracks.total,
            isOwned: playlist.owner.id === userProfile.id,
            isPublic: playlist.public,
            uri: playlist.uri,
          })).slice(0, 3);

        // Transform saved tracks (liked songs)
        const likedSongs: Track[] = savedTracksData.items.map((item: any) => ({
          id: item.track.id,
          name: item.track.name,
          artist: item.track.artists.map((artist: any) => artist.name).join(', '),
          album: item.track.album.name,
          imageUrl: item.track.album.images?.[0]?.url || '/placeholder-album.jpg',
          duration: Math.floor(item.track.duration_ms / 1000),
          currentTime: 0,
          isPlaying: false,
          isLiked: true,
          explicit: item.track.explicit,
          uri: item.track.uri,
        }));

        // Create a set of liked track IDs for easy lookup
        const likedTrackIds = new Set(likedSongs.map(track => track.id));

        // Update isLiked status for recently played tracks
        recentlyPlayed.forEach(track => {
          track.isLiked = likedTrackIds.has(track.id);
        });

        // For recommended tracks, let's use some of the saved tracks as a start
        // In a real implementation, you might want to use Spotify's recommendations API
        const recommendedTracks = likedSongs.slice(0, 4);

        const dashboardData: DashboardState = {
          playerState: {
            currentTrack: recentlyPlayed[0] || null,
            isPlaying: false,
            volume: 75,
            shuffle: false,
            repeat: 'off',
            queue: recentlyPlayed,
          },
          recentlyPlayed,
          topPlaylists,
          recommendedTracks,
          likedSongs,
          user,
        };

        setState({
          dashboardData,
          loading: false,
          error: null,
        });

      } catch (error) {
        console.error('Error fetching Spotify data:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch Spotify data',
        }));
      }
    };

    fetchSpotifyData();
  }, [session?.accessToken]);

  return state;
} 