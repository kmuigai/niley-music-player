'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { SpotifyWebApi } from '@/lib/spotify/api';
import { Track } from '@/types/music';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Heart, Play, Clock, MoreHorizontal } from 'lucide-react';
import { usePlayer } from '@/components/layout/AppLayout';

interface LikedSongsState {
  tracks: Track[];
  loading: boolean;
  error: string | null;
  total: number;
}

export default function LikedSongsContent() {
  const { data: session } = useSession();
  const { handleTrackPlay, isPlayerReady } = usePlayer();
  const [likedSongsState, setLikedSongsState] = useState<LikedSongsState>({
    tracks: [],
    loading: true,
    error: null,
    total: 0
  });

  useEffect(() => {
    if (session?.accessToken) {
      fetchLikedSongs();
    }
  }, [session]);

  const fetchLikedSongs = async () => {
    try {
      setLikedSongsState(prev => ({ ...prev, loading: true, error: null }));
      
      if (!session?.accessToken) {
        throw new Error('No access token available');
      }
      
      const spotifyApi = new SpotifyWebApi(session.accessToken);
      const savedTracksResponse = await spotifyApi.getSavedTracks(50, 0);
      
      const formattedTracks: Track[] = savedTracksResponse.items.map((item: any) => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists[0]?.name || 'Unknown Artist',
        album: item.track.album.name,
        imageUrl: item.track.album.images?.[0]?.url || '/placeholder-track.jpg',
        duration: item.track.duration_ms,
        uri: item.track.uri,
        explicit: item.track.explicit,
        previewUrl: item.track.preview_url,
        addedAt: item.added_at
      }));

      setLikedSongsState({
        tracks: formattedTracks,
        loading: false,
        error: null,
        total: savedTracksResponse.total
      });
    } catch (error) {
      console.error('Failed to fetch liked songs:', error);
      setLikedSongsState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load your liked songs. Please try again.'
      }));
    }
  };

  const handlePlayAll = () => {
    if (likedSongsState.tracks.length > 0 && isPlayerReady) {
      const firstTrack = likedSongsState.tracks[0];
      handleTrackPlay(firstTrack);
    }
  };

  const handlePlayTrack = (track: Track) => {
    if (isPlayerReady) {
      handleTrackPlay(track);
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="h-full p-6 overflow-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded flex items-center justify-center mr-6">
            <Heart className="h-8 w-8 text-white" fill="white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">Liked Songs</h1>
            <p className="text-gray-400">
              {likedSongsState.total} {likedSongsState.total === 1 ? 'song' : 'songs'}
            </p>
          </div>
        </div>
      </div>

      {likedSongsState.loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a29bfe]"></div>
          <span className="ml-3 text-gray-400">Loading your liked songs...</span>
        </div>
      ) : likedSongsState.error ? (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
          <p className="text-red-300">{likedSongsState.error}</p>
          <button 
            onClick={fetchLikedSongs}
            className="mt-4 px-4 py-2 bg-[#a29bfe] hover:bg-[#9081f7] rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div>
          {/* Controls */}
          <div className="flex items-center mb-6">
            <Button 
              size="lg" 
              className="bg-[#a29bfe] hover:bg-[#9081f7] text-white mr-4"
              onClick={handlePlayAll}
              disabled={!isPlayerReady || likedSongsState.tracks.length === 0}
            >
              <Play className="h-5 w-5 mr-2" fill="white" />
              Play
            </Button>
            <Button variant="ghost" size="lg">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>

          {/* Track List Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm text-gray-400 border-b border-gray-800 mb-2">
            <div className="col-span-1">#</div>
            <div className="col-span-6">TITLE</div>
            <div className="col-span-3">ALBUM</div>
            <div className="col-span-1">DATE ADDED</div>
            <div className="col-span-1 text-right">
              <Clock className="h-4 w-4 ml-auto" />
            </div>
          </div>

          {/* Track List */}
          <div className="space-y-1 max-h-[500px] overflow-auto">
            {likedSongsState.tracks.map((track, index) => (
              <div 
                key={track.id} 
                className="grid grid-cols-12 gap-4 px-4 py-2 hover:bg-[#1a1a1a] rounded-lg group cursor-pointer"
                onClick={() => handlePlayTrack(track)}
              >
                <div className="col-span-1 flex items-center">
                  <span className="text-gray-400 group-hover:hidden">
                    {index + 1}
                  </span>
                  <Play className="h-4 w-4 text-white hidden group-hover:block" />
                </div>
                
                <div className="col-span-6 flex items-center">
                  <img
                    src={track.imageUrl}
                    alt={track.album}
                    className="w-10 h-10 rounded mr-3"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-track.jpg';
                    }}
                  />
                  <div>
                    <p className="text-white font-medium truncate">
                      {track.name}
                      {track.explicit && (
                        <span className="ml-2 text-xs bg-gray-600 text-white px-1 py-0.5 rounded">
                          E
                        </span>
                      )}
                    </p>
                    <p className="text-gray-400 text-sm truncate">
                      {track.artist}
                    </p>
                  </div>
                </div>
                
                <div className="col-span-3 flex items-center">
                  <span className="text-gray-400 text-sm truncate">
                    {track.album}
                  </span>
                </div>
                
                <div className="col-span-1 flex items-center">
                  <span className="text-gray-400 text-sm">
                    {track.addedAt ? formatDate(track.addedAt) : ''}
                  </span>
                </div>
                
                <div className="col-span-1 flex items-center justify-end">
                  <span className="text-gray-400 text-sm">
                    {formatDuration(track.duration)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {likedSongsState.tracks.length === 0 && (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No liked songs</h3>
              <p className="text-gray-500">Songs you like will appear here</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 