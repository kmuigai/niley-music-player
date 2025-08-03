'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { navigationItems } from '@/lib/mock-data';
import { DashboardState, PlayerState } from '@/types/music';
import { useSpotifyData } from '@/hooks/useSpotifyData';
import { useSpotifyPlayer } from '@/hooks/useSpotifyPlayer';
import { useContentFiltering } from '@/hooks/useContentFiltering';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import PlayerBar from './PlayerBar';
import FilterToggle from '@/components/mvp/FilterToggle';
import SafetyIndicator from '@/components/mvp/SafetyIndicator';

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

export default function Dashboard() {
  const { data: session } = useSession();
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

  // Update dashboard state with real player state
  useEffect(() => {
    if (spotifyPlayer.currentTrack) {
      setDashboardState(prev => ({
        ...prev,
        playerState: {
          ...prev.playerState,
          currentTrack: {
            id: spotifyPlayer.currentTrack.id || '',
            name: spotifyPlayer.currentTrack.name || '',
            artist: spotifyPlayer.currentTrack.artists?.map((a: any) => a.name).join(', ') || '',
            album: spotifyPlayer.currentTrack.album?.name || '',
            imageUrl: spotifyPlayer.currentTrack.album?.images?.[0]?.url || '',
            duration: Math.floor(spotifyPlayer.duration / 1000),
            currentTime: Math.floor(spotifyPlayer.position / 1000),
            isPlaying: spotifyPlayer.isPlaying,
            uri: spotifyPlayer.currentTrack.uri,
          },
          isPlaying: spotifyPlayer.isPlaying,
          volume: spotifyPlayer.volume,
        },
      }));
    }
  }, [spotifyPlayer.currentTrack, spotifyPlayer.isPlaying, spotifyPlayer.position, spotifyPlayer.volume]);

  // Real player control functions using Spotify SDK
  const handlePlay = () => {
    if (!spotifyPlayer.isPlaying) {
      spotifyPlayer.togglePlayPause();
    }
  };

  const handlePause = () => {
    if (spotifyPlayer.isPlaying) {
      spotifyPlayer.togglePlayPause();
    }
  };

  const handleVolumeChange = (volume: number) => {
    spotifyPlayer.setVolume(volume);
  };

  const handleSeek = (time: number) => {
    spotifyPlayer.seek(time * 1000); // Convert seconds to milliseconds
  };

  const handleToggleShuffle = () => {
    // TODO: Implement shuffle via Spotify Web API
    console.log('Shuffle toggle - TODO: Implement via Spotify Web API');
  };

  const handleToggleRepeat = () => {
    // TODO: Implement repeat via Spotify Web API
    console.log('Repeat toggle - TODO: Implement via Spotify Web API');
  };

  const handleNext = () => {
    spotifyPlayer.skipToNext();
  };

  const handlePrevious = () => {
    spotifyPlayer.skipToPrevious();
  };

  // Function to play a specific track (used by MainContent)
  const handleTrackPlay = (track: any) => {
    // Mark user interaction and dismiss notification
    setNotificationState(prev => ({
      ...prev,
      userHasInteracted: true,
      shouldShow: false,
    }));
    
    // Store interaction in session storage
    sessionStorage.setItem('spotify-user-interacted', 'true');
    
    if (track.uri) {
      // Create context from recently played tracks
      const contextTracks = dashboardState.recentlyPlayed
        .filter(t => t.uri && t.uri !== track.uri)
        .map(t => t.uri!)
        .slice(0, 10);
      
      spotifyPlayer.playTrack(track.uri, contextTracks);
    } else {
      console.error('Track URI is missing:', track);
    }
  };

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
    <div className="h-screen bg-[#2d3436] text-white flex flex-col">
      {/* Top Navigation */}
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar 
          navigationItems={navigationItems} 
          playlists={dashboardState.topPlaylists}
        />

        {/* Main Content */}
        <MainContent 
          recentlyPlayed={dashboardState.recentlyPlayed}
          topPlaylists={dashboardState.topPlaylists}
          recommendedTracks={dashboardState.recommendedTracks}
          onTrackPlay={handleTrackPlay}
        />
      </div>



      {!spotifyPlayer.isReady && !spotifyPlayer.error && session?.accessToken && (
        <div className="bg-yellow-600 text-white p-2 text-center text-sm">
          <strong>Connecting to Spotify...</strong> Initializing Web Player (requires Premium)...
        </div>
      )}



      {/* Family Safe Mode Controls */}
      <div className="bg-[#1a1a1a] border-t border-gray-800 p-3 flex items-center justify-between">
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
  );
} 