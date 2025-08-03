import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Track } from '@/types/music';

interface SpotifyPlayerState {
  isReady: boolean;
  deviceId: string | null;
  currentTrack: Track | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  volume: number;
  error: string | null;
}

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: {
      Player: new (options: any) => any;
    };
  }
}

export function useSpotifyPlayer() {
  const { data: session } = useSession();
  const [playerState, setPlayerState] = useState<SpotifyPlayerState>({
    isReady: false,
    deviceId: null,
    currentTrack: null,
    isPlaying: false,
    position: 0,
    duration: 0,
    volume: 50,
    error: null,
  });
  
  const playerRef = useRef<any>(null);

  // Transform Spotify SDK track data to our Track interface
  const transformSpotifyTrack = (spotifyTrack: any): Track | null => {
    if (!spotifyTrack) return null;
    
    console.log('🎵 Transforming Spotify track:', {
      name: spotifyTrack.name,
      imageUrl: spotifyTrack.album?.images?.[0]?.url,
      albumImages: spotifyTrack.album?.images,
    });
    
    return {
      id: spotifyTrack.id,
      name: spotifyTrack.name,
      artist: spotifyTrack.artists?.[0]?.name || 'Unknown Artist',
      album: spotifyTrack.album?.name || 'Unknown Album',
      imageUrl: spotifyTrack.album?.images?.[0]?.url || '/placeholder-track.jpg',
      duration: Math.floor((spotifyTrack.duration_ms || 0) / 1000), // Convert to seconds
      uri: spotifyTrack.uri,
      explicit: spotifyTrack.explicit || false,
      previewUrl: spotifyTrack.preview_url,
    };
  };

  // Real-time position polling for smooth progress updates
  useEffect(() => {
    if (!playerRef.current || !playerState.isPlaying) return;

    const pollPosition = async () => {
      try {
        const state = await playerRef.current.getCurrentState();
        if (state && !state.paused) {
          setPlayerState(prev => ({
            ...prev,
            position: state.position,
            isPlaying: !state.paused,
          }));
        }
      } catch (error) {
        console.error('Error polling position:', error);
      }
    };

    // Poll position every second when playing
    const interval = setInterval(pollPosition, 1000);
    return () => clearInterval(interval);
  }, [playerState.isPlaying]);

  useEffect(() => {
    if (!session?.accessToken) return;

    const initializePlayer = () => {
      const player = new window.Spotify.Player({
        name: 'Niley Music Player',
        getOAuthToken: (cb: (token: string) => void) => {
          cb(session.accessToken!);
        },
        volume: 0.5,
      });

      // Error handling
      player.addListener('initialization_error', ({ message }: any) => {
        setPlayerState(prev => ({ ...prev, error: `Initialization error: ${message}` }));
      });

      player.addListener('authentication_error', ({ message }: any) => {
        setPlayerState(prev => ({ ...prev, error: `Authentication error: ${message}` }));
      });

      player.addListener('account_error', ({ message }: any) => {
        setPlayerState(prev => ({ ...prev, error: `Account error: ${message}` }));
      });

      player.addListener('playback_error', ({ message }: any) => {
        setPlayerState(prev => ({ ...prev, error: `Playback error: ${message}` }));
      });

      // Playback status updates
      player.addListener('player_state_changed', (state: any) => {
        if (!state) return;

        const transformedTrack = transformSpotifyTrack(state.track_window.current_track);
        
        setPlayerState(prev => ({
          ...prev,
          currentTrack: transformedTrack,
          isPlaying: !state.paused,
          position: state.position,
          duration: state.duration,
        }));
      });

      // Ready
      player.addListener('ready', ({ device_id }: any) => {
        console.log('Ready with Device ID', device_id);
        setPlayerState(prev => ({
          ...prev,
          isReady: true,
          deviceId: device_id,
          error: null,
        }));
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }: any) => {
        console.log('Device ID has gone offline', device_id);
        setPlayerState(prev => ({
          ...prev,
          isReady: false,
        }));
      });

      // Connect to the player
      player.connect().then((success: boolean) => {
        if (success) {
          console.log('Successfully connected to Spotify!');
        } else {
          setPlayerState(prev => ({ ...prev, error: 'Failed to connect to Spotify' }));
        }
      });

      playerRef.current = player;
    };

    if (window.Spotify) {
      initializePlayer();
    } else {
      window.onSpotifyWebPlaybackSDKReady = initializePlayer;
    }

    // Cleanup
    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
      }
    };
  }, [session?.accessToken]);

  const playTrack = async (spotifyUri: string, contextTracks?: string[], retryCount = 0) => {
    if (!session?.accessToken) {
      setPlayerState(prev => ({ ...prev, error: 'No access token available' }));
      return;
    }

    // If player isn't ready yet, wait a bit and retry (up to 3 times)
    if (!playerState.deviceId || !playerState.isReady) {
      if (retryCount < 3) {
        console.log(`Player not ready, retrying in ${(retryCount + 1) * 1000}ms...`);
        setTimeout(() => {
          playTrack(spotifyUri, contextTracks, retryCount + 1);
        }, (retryCount + 1) * 1000);
        return;
      } else {
        setPlayerState(prev => ({ ...prev, error: 'Player not ready after retries' }));
        return;
      }
    }

    try {
      console.log(`🎵 Starting playback for: ${spotifyUri}`);
      
      // Step 1: Transfer playback to our device first
      const transferResponse = await fetch('https://api.spotify.com/v1/me/player', {
        method: 'PUT',
        body: JSON.stringify({ 
          device_ids: [playerState.deviceId],
          play: false
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
      });

      // Wait a moment for transfer to complete
      await new Promise(resolve => setTimeout(resolve, 750));

      // Step 2: Create a queue with the requested track and some context
      const urisToPlay = contextTracks && contextTracks.length > 0 
        ? [spotifyUri, ...contextTracks.filter(uri => uri !== spotifyUri).slice(0, 19)] // Max 20 tracks total
        : [spotifyUri]; // Single track fallback

      console.log(`🎵 Playing track with ${urisToPlay.length} tracks in queue`);

      // Step 3: Start playback with the queue
      const playResponse = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${playerState.deviceId}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: urisToPlay }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
      });

      if (!playResponse.ok) {
        const errorData = await playResponse.json();
        throw new Error(errorData.error?.message || 'Failed to play track');
      }

      console.log('🎵 Successfully started playback!');
      
      // Clear any previous errors
      setPlayerState(prev => ({ ...prev, error: null }));
      
    } catch (error) {
      console.error('Error playing track:', error);
      setPlayerState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to play track' 
      }));
    }
  };

  const togglePlayPause = () => {
    if (playerRef.current) {
      playerRef.current.togglePlay();
    }
  };

  const skipToPrevious = () => {
    if (playerRef.current) {
      playerRef.current.previousTrack();
    }
  };

  const skipToNext = () => {
    if (playerRef.current) {
      playerRef.current.nextTrack();
    }
  };

  const setVolume = (volume: number) => {
    if (playerRef.current) {
      playerRef.current.setVolume(volume / 100).then(() => {
        setPlayerState(prev => ({ ...prev, volume }));
      });
    }
  };

  const seek = (positionMs: number) => {
    if (playerRef.current) {
      playerRef.current.seek(positionMs);
    }
  };

  return {
    ...playerState,
    playTrack,
    togglePlayPause,
    skipToPrevious,
    skipToNext,
    setVolume,
    seek,
  };
} 