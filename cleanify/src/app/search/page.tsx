'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { SpotifyWebApi } from '@/lib/spotify/api';
import { useSpotifyPlayer } from '@/hooks/useSpotifyPlayer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Play, User, Disc3, Music } from 'lucide-react';
import Image from 'next/image';
import TopBar from '@/components/dashboard/TopBar';
import Sidebar from '@/components/dashboard/Sidebar';
import { navigationItems } from '@/lib/mock-data';

interface SearchResults {
  tracks: any[];
  artists: any[];
  albums: any[];
  playlists: any[];
}

export default function SearchPage() {
  const { data: session } = useSession();
  const spotifyPlayer = useSpotifyPlayer();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({
    tracks: [],
    artists: [],
    albums: [],
    playlists: [],
  });
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async () => {
    if (!query.trim() || !session?.accessToken) return;

    setLoading(true);
    try {
      const spotify = new SpotifyWebApi(session.accessToken);
      
      // Search for multiple types
      const [tracksResult, artistsResult, albumsResult, playlistsResult] = await Promise.all([
        spotify.search(query, 'track', 20),
        spotify.search(query, 'artist', 20),
        spotify.search(query, 'album', 20),
        spotify.search(query, 'playlist', 20),
      ]);

      // Log the API responses for debugging
      console.log('Search results:', { tracksResult, artistsResult, albumsResult, playlistsResult });
      
      setResults({
        tracks: tracksResult.tracks?.items || [],
        artists: artistsResult.artists?.items || [],
        albums: albumsResult.albums?.items || [],
        playlists: playlistsResult.playlists?.items || [],
      });
      setSearchPerformed(true);
    } catch (error) {
      console.error('Search error:', error);
      // Reset results on error to prevent displaying stale data
      setResults({
        tracks: [],
        artists: [],
        albums: [],
        playlists: [],
      });
    }
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${(Number(seconds) < 10 ? '0' : '')}${seconds}`;
  };

  const handleTrackPlay = (track: any) => {
    if (track.uri) {
      // Create context from search results tracks
      const contextTracks = (results.tracks || [])
        .filter(t => t.uri && t.uri !== track.uri)
        .map(t => t.uri!)
        .slice(0, 10);
      
      spotifyPlayer.playTrack(track.uri, contextTracks);
    } else {
      console.error('Track URI is missing:', track);
    }
  };

  const handleArtistClick = (artist: any) => {
    console.log('Opening artist:', artist.name);
    // TODO: Navigate to artist detail view
  };

  const handleAlbumClick = (album: any) => {
    console.log('Opening album:', album.name);
    // TODO: Navigate to album detail view
  };

  const handlePlaylistClick = (playlist: any) => {
    console.log('Opening playlist:', playlist.name);
    // TODO: Navigate to playlist detail view
  };

  // Update navigation to show search as active
  const updatedNavigationItems = (navigationItems || []).map(item => ({
    ...item,
    isActive: item.id === 'search'
  }));

  return (
    <div className="h-screen bg-[#2d3436] text-white flex flex-col">
      {/* Top Navigation */}
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar 
          navigationItems={updatedNavigationItems} 
          playlists={[]}
        />

        {/* Main Search Content */}
        <div className="flex-1 bg-gradient-to-b from-[#a29bfe]/20 to-[#2d3436] overflow-auto">
          <div className="p-8">
            {/* Search Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-6">Search</h1>
              
              {/* Search Input */}
              <div className="flex gap-4 max-w-2xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="What do you want to listen to?"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10 bg-[#2d3436] border-gray-600 text-white placeholder-gray-400 text-lg py-6"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  disabled={loading || !query.trim()}
                  className="bg-[#6c5ce7] hover:bg-[#a29bfe] px-8 py-6"
                >
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>

            {/* Search Results */}
            {searchPerformed && (
              <div className="space-y-8">
                {/* Tracks */}
                {results.tracks && results.tracks.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                      <Music className="mr-2" />
                      Songs
                    </h2>
                    <div className="space-y-2">
                      {(results.tracks || []).slice(0, 5).map((track: any) => (
                        <Card 
                          key={track.id} 
                          className="bg-[#2d3436]/50 border-gray-700 hover:bg-[#a29bfe]/10 transition-colors cursor-pointer group"
                          onClick={() => handleTrackPlay(track)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <Image
                                src={track.album?.images?.[0]?.url || '/placeholder.svg'}
                                alt={track.name}
                                width={60}
                                height={60}
                                className="rounded-md"
                                unoptimized
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-white truncate">{track.name}</h3>
                                  {track.explicit && (
                                    <span className="bg-gray-600 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                                      E
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-400 truncate">
                                  {track.artists?.map((artist: any) => artist.name).join(', ') || 'Unknown Artist'}
                                </p>
                                <p className="text-gray-500 text-sm">{track.album?.name || 'Unknown Album'}</p>
                              </div>
                              <div className="text-gray-400 text-sm">
                                {formatDuration(track.duration_ms)}
                              </div>
                              <Button
                                size="icon"
                                className="bg-[#6c5ce7] hover:bg-[#a29bfe] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTrackPlay(track);
                                }}
                              >
                                <Play className="h-4 w-4 text-black fill-black" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Artists */}
                {results.artists && results.artists.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                      <User className="mr-2" />
                      Artists
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {(results.artists || []).slice(0, 6).map((artist: any) => (
                        <Card 
                          key={artist.id} 
                          className="bg-[#2d3436]/50 border-gray-700 hover:bg-[#a29bfe]/10 transition-colors cursor-pointer"
                          onClick={() => handleArtistClick(artist)}
                        >
                          <CardContent className="p-4 text-center">
                            <Image
                              src={artist.images?.[0]?.url || '/placeholder.svg'}
                              alt={artist.name}
                              width={120}
                              height={120}
                              className="rounded-full mx-auto mb-3"
                              unoptimized
                            />
                            <h3 className="font-semibold text-white truncate">{artist.name}</h3>
                            <p className="text-gray-400 text-sm">Artist</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Albums */}
                {results.albums && results.albums.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                      <Disc3 className="mr-2" />
                      Albums
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {(results.albums || []).slice(0, 6).map((album: any) => (
                        <Card 
                          key={album.id} 
                          className="bg-[#2d3436]/50 border-gray-700 hover:bg-[#a29bfe]/10 transition-colors cursor-pointer"
                          onClick={() => handleAlbumClick(album)}
                        >
                          <CardContent className="p-4">
                            <Image
                              src={album.images?.[0]?.url || '/placeholder.svg'}
                              alt={album.name}
                              width={120}
                              height={120}
                              className="rounded-md mx-auto mb-3"
                              unoptimized
                            />
                            <h3 className="font-semibold text-white truncate">{album.name}</h3>
                            <p className="text-gray-400 text-sm truncate">
                              {album.artists?.map((artist: any) => artist.name).join(', ') || 'Unknown Artist'}
                            </p>
                            <p className="text-gray-500 text-xs">{album.release_date?.substring(0, 4)}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Playlists */}
                {results.playlists && results.playlists.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                      <Music className="mr-2" />
                      Playlists
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {(results.playlists || []).slice(0, 6).map((playlist: any) => (
                        <Card 
                          key={playlist.id} 
                          className="bg-[#2d3436]/50 border-gray-700 hover:bg-[#a29bfe]/10 transition-colors cursor-pointer"
                          onClick={() => handlePlaylistClick(playlist)}
                        >
                          <CardContent className="p-4">
                            <Image
                              src={playlist.images?.[0]?.url || '/placeholder.svg'}
                              alt={playlist.name}
                              width={120}
                              height={120}
                              className="rounded-md mx-auto mb-3"
                              unoptimized
                            />
                            <h3 className="font-semibold text-white truncate">{playlist.name}</h3>
                            <p className="text-gray-400 text-sm truncate">{playlist.description}</p>
                            <p className="text-gray-500 text-xs">{playlist.tracks?.total || 0} tracks</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {searchPerformed && 
                 (!results.tracks || results.tracks.length === 0) && 
                 (!results.artists || results.artists.length === 0) && 
                 (!results.albums || results.albums.length === 0) && 
                 (!results.playlists || results.playlists.length === 0) && (
                  <div className="text-center py-12">
                    <Search className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-400 mb-2">No results found</h2>
                    <p className="text-gray-500">Try searching for something else</p>
                  </div>
                )}
              </div>
            )}

            {/* Empty State */}
            {!searchPerformed && (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-400 mb-2">Start searching</h2>
                <p className="text-gray-500">Find your favorite songs, artists, albums, and playlists</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 