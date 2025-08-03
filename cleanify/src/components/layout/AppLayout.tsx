'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { navigationItems } from '@/lib/mock-data';
import { DashboardState, PlayerState } from '@/types/music';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { useSpotifyPlayer } from '@/hooks/useSpotifyPlayer';
import { useContentFiltering } from '@/hooks/useContentFiltering';
import TopBar from '@/components/dashboard/TopBar';
import Sidebar from '@/components/dashboard/Sidebar';
import PlayerBar from '@/components/dashboard/PlayerBar';
import FilterToggle from '@/components/mvp/FilterToggle';
import SafetyIndicator from '@/components/mvp/SafetyIndicator';
import SpotifyLogin from '@/components/auth/SpotifyLogin';

// Default empty state for when data is loading
const defaultDashboardState: DashboardState = {
  playerState: {
    currentTrack: null,
    isPlaying: false,
    volume: 75,
    shuffle: false,
    repeat: 'off',
    queue: [],
  },
  recentlyPlayed: [],
  topPlaylists: [],
  recommendedTracks: [],
  likedSongs: [],
  user: {
    id: '',
    name: 'Loading...',
    imageUrl: '/placeholder-user.jpg',
    isPremium: false,
  },
};

// Smart notification state management
interface NotificationState {
  shouldShow: boolean;
  hasShownInSession: boolean;
  userHasInteracted: boolean;
  lastConnectionState: boolean;
}

interface AppLayoutProps {
  children: React.ReactNode;
}

// Add PlayerContext interface and create context
interface PlayerContextValue {
  handleTrackPlay: (track: any) => void;
  isPlayerReady: boolean;
  currentTrack: any | null;
  isPlaying: boolean;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { dashboardData, loading, error } = useSpotifyData();
  const spotifyPlayer = useSpotifyPlayer();
  const [dashboardState, setDashboardState] = useState<DashboardState>(defaultDashboardState);

  // Smart notification state
  const [notificationState, setNotificationState] = useState<NotificationState>({
    shouldShow: false,
    hasShownInSession: false,
    userHasInteracted: false,
    lastConnectionState: false,
  });

  // Content Filtering Integration
  const contentFiltering = useContentFiltering({
    currentTrack: spotifyPlayer.currentTrack,
    onSkipTrack: () => {
      console.log('🛡️ Content filtering triggered - skipping track');
      spotifyPlayer.skipToNext();
    },
  });

  // Smart notification logic
  useEffect(() => {
    const sessionKey = 'spotify-notification-shown';
    const interactionKey = 'spotify-user-interacted';
    
    // Check if we've shown notification in this session
    const hasShownInSession = sessionStorage.getItem(sessionKey) === 'true';
    const userHasInteracted = sessionStorage.getItem(interactionKey) === 'true';
    
    setNotificationState(prev => ({
      ...prev,
      hasShownInSession,
      userHasInteracted,
    }));

    // Handle connection state changes
    const wasConnected = notificationState.lastConnectionState;
    const isNowConnected = spotifyPlayer.isReady;
    
    // Show notification logic:
    // 1. First connection in session (if user hasn't interacted)
    // 2. Reconnection after disconnection (if user hasn't interacted)
    if (isNowConnected && !userHasInteracted) {
      if (!hasShownInSession || (!wasConnected && isNowConnected)) {
        setNotificationState(prev => ({
          ...prev,
          shouldShow: true,
          hasShownInSession: true,
          lastConnectionState: isNowConnected,
        }));
        
        // Mark as shown in session
        sessionStorage.setItem(sessionKey, 'true');
      }
    }

    // Update last connection state
    if (wasConnected !== isNowConnected) {
      setNotificationState(prev => ({
        ...prev,
        lastConnectionState: isNowConnected,
      }));
    }
  }, [spotifyPlayer.isReady, notificationState.lastConnectionState]);

  // Update local state when Spotify data is loaded
  useEffect(() => {
    if (dashboardData) {
      setDashboardState(dashboardData);
    }
  }, [dashboardData]);

  // Sync Spotify player state with dashboard state
  useEffect(() => {
    setDashboardState(prev => ({
      ...prev,
      playerState: {
        ...prev.playerState,
        currentTrack: spotifyPlayer.currentTrack,
        isPlaying: spotifyPlayer.isPlaying,
        volume: spotifyPlayer.volume,
      }
    }));
  }, [spotifyPlayer.currentTrack, spotifyPlayer.isPlaying, spotifyPlayer.volume]);

  // Player control handlers
  const handlePlay = () => {
    if (dashboardState.playerState.currentTrack) {
      spotifyPlayer.togglePlayPause();
    }
  };

  const handlePause = () => {
    spotifyPlayer.togglePlayPause();
  };

  const handleVolumeChange = (volume: number) => {
    spotifyPlayer.setVolume(volume);
  };

  const handleSeek = (position: number) => {
    spotifyPlayer.seek(position);
  };

  const handleToggleShuffle = () => {
    const newShuffleState = !dashboardState.playerState.shuffle;
    setDashboardState(prev => ({
      ...prev,
      playerState: {
        ...prev.playerState,
        shuffle: newShuffleState
      }
    }));
    // Note: Spotify Web Playback SDK doesn't support shuffle control
    console.log('Shuffle toggled:', newShuffleState);
  };

  const handleToggleRepeat = () => {
    const currentRepeat = dashboardState.playerState.repeat;
    const newRepeat = currentRepeat === 'off' ? 'playlist' : 
                     currentRepeat === 'playlist' ? 'track' : 'off';
    
    setDashboardState(prev => ({
      ...prev,
      playerState: {
        ...prev.playerState,
        repeat: newRepeat
      }
    }));
    // Note: Spotify Web Playback SDK doesn't support repeat control
    console.log('Repeat toggled:', newRepeat);
  };

  const handleNext = () => {
    spotifyPlayer.skipToNext();
  };

  const handlePrevious = () => {
    spotifyPlayer.skipToPrevious();
  };

  const handleTrackPlay = (track: any) => {
    if (track.uri) {
      // Create context for seamless playback
      const contextTracks = dashboardState.recentlyPlayed
        .filter(t => t.uri && t.uri !== track.uri)
        .map(t => t.uri!)
        .slice(0, 10);
      
      spotifyPlayer.playTrack(track.uri, contextTracks);
    } else {
      console.error('Track URI is missing:', track);
    }
  };

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#2d3436] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Not authenticated
  if (!session?.user) {
    return <SpotifyLogin />;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="h-screen bg-[#2d3436] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">Loading your Spotify data...</h2>
          <p className="text-gray-400 mt-2">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="h-screen bg-[#2d3436] text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Unable to load Spotify data</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-white flex flex-col p-2">
      {/* Top Navigation */}
      <TopBar />

      <div className="flex flex-1 gap-2 overflow-hidden mt-2">
        {/* Left Sidebar */}
        <Sidebar 
          navigationItems={navigationItems} 
          playlists={dashboardState.topPlaylists}
        />

        {/* Main Content Area - Dynamic */}
        <div className="flex-1 bg-[#121212] rounded-lg overflow-auto">
          <PlayerContext.Provider value={{
            handleTrackPlay,
            isPlayerReady: spotifyPlayer.isReady,
            currentTrack: spotifyPlayer.currentTrack,
            isPlaying: spotifyPlayer.isPlaying,
          }}>
            {children}
          </PlayerContext.Provider>
        </div>
      </div>

      {!spotifyPlayer.isReady && !spotifyPlayer.error && session?.accessToken && (
        <div className="bg-yellow-600 text-white p-2 text-center text-sm rounded-lg mx-2 my-1">
          <strong>Connecting to Spotify...</strong> Initializing Web Player (requires Premium)...
        </div>
      )}

      {/* Family Safe Mode Controls */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg m-2 p-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <FilterToggle
            isEnabled={contentFiltering.isEnabled}
            filterSettings={contentFiltering.settings}
            onToggle={contentFiltering.toggleFiltering}
            onSettingsChange={(settings) => contentFiltering.updateSettings(settings)}
          />
          <SafetyIndicator
            filterResult={contentFiltering.currentFilterResult || undefined}
            isAnalyzing={contentFiltering.isAnalyzing}
          />
        </div>
        <div className="text-xs text-gray-400">
          Analyzed: {contentFiltering.stats.tracksAnalyzed} | Blocked: {contentFiltering.stats.tracksBlocked}
        </div>
      </div>

      {/* Currently Playing Bar */}
      <div className="mx-2 mb-2">
        <PlayerBar
          currentTrack={dashboardState.playerState.currentTrack}
          isPlaying={dashboardState.playerState.isPlaying}
          volume={dashboardState.playerState.volume}
          shuffle={dashboardState.playerState.shuffle}
          repeat={dashboardState.playerState.repeat}
          onPlay={handlePlay}
          onPause={handlePause}
          onVolumeChange={handleVolumeChange}
          onSeek={handleSeek}
          onToggleShuffle={handleToggleShuffle}
          onToggleRepeat={handleToggleRepeat}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      </div>
    </div>
  );
} 