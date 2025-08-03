'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { SpotifyWebApi } from '@/lib/spotify/api';
import { Playlist } from '@/types/music';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Music, Users, Play } from 'lucide-react';

interface LibraryPageState {
  playlists: Playlist[];
  loading: boolean;
  error: string | null;
}

export default function LibraryContent() {
  const { data: session } = useSession();
  const [libraryState, setLibraryState] = useState<LibraryPageState>({
    playlists: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    if (session?.accessToken) {
      fetchLibraryData();
    }
  }, [session]);

  const fetchLibraryData = async () => {
    try {
      setLibraryState(prev => ({ ...prev, loading: true, error: null }));
      
      if (!session?.accessToken) {
        throw new Error('No access token available');
      }
      
      const spotifyApi = new SpotifyWebApi(session.accessToken);
      const playlistsResponse = await spotifyApi.getUserPlaylists(50, 0);
      
      const formattedPlaylists: Playlist[] = playlistsResponse.items.map((playlist: any) => ({
        id: playlist.id,
        name: playlist.name,
        description: playlist.description || '',
        imageUrl: playlist.images?.[0]?.url || '/placeholder-playlist.jpg',
        trackCount: playlist.tracks.total,
        isOwned: playlist.owner.display_name === session?.user?.name,
        owner: playlist.owner.display_name || 'Unknown'
      }));

      setLibraryState({
        playlists: formattedPlaylists,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Failed to fetch library data:', error);
      setLibraryState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load your library. Please try again.'
      }));
    }
  };

  return (
    <div className="h-full p-6 overflow-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Your Library</h1>
        <p className="text-gray-400">Your music collection from Spotify</p>
      </div>

      {libraryState.loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a29bfe]"></div>
          <span className="ml-3 text-gray-400">Loading your library...</span>
        </div>
      ) : libraryState.error ? (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
          <p className="text-red-300">{libraryState.error}</p>
          <button 
            onClick={fetchLibraryData}
            className="mt-4 px-4 py-2 bg-[#a29bfe] hover:bg-[#9081f7] rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Playlists ({libraryState.playlists.length})</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {libraryState.playlists.map((playlist) => (
              <Card 
                key={playlist.id} 
                className="bg-[#121212] border-gray-800 hover:bg-[#1a1a1a] transition-colors cursor-pointer group"
              >
                <div className="p-4">
                  <div className="relative mb-4">
                    <img
                      src={playlist.imageUrl}
                      alt={playlist.name}
                      className="w-full aspect-square object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-playlist.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Play className="h-12 w-12 text-white" fill="white" />
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-white truncate mb-1">
                    {playlist.name}
                  </h3>
                  
                  <div className="flex items-center text-sm text-gray-400 mb-2">
                    <Music className="h-4 w-4 mr-1" />
                    <span>{playlist.trackCount} songs</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    <span className="truncate">
                      {playlist.isOwned ? 'by you' : `by ${playlist.owner}`}
                    </span>
                  </div>
                  
                  {playlist.description && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                      {playlist.description}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
          
          {libraryState.playlists.length === 0 && (
            <div className="text-center py-12">
              <Music className="h-16 w-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No playlists found</h3>
              <p className="text-gray-500">Create some playlists in Spotify to see them here!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 