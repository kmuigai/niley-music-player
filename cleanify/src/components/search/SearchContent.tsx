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

interface SearchResults {
  tracks: any[];
  artists: any[];
  albums: any[];
  playlists: any[];
}

export default function SearchContent() {
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

      setResults({
        tracks: tracksResult.tracks?.items || [],
        artists: artistsResult.artists?.items || [],
        albums: albumsResult.albums?.items || [],
        playlists: playlistsResult.playlists?.items || [],
      });
      setSearchPerformed(true);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackPlay = (track: any) => {
    console.log('Playing track:', track.name);
    if (track.uri) {
      spotifyPlayer.playTrack(track.uri);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="h-full p-6 overflow-auto">
      <div className="max-w-4xl mx-auto">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-6">Search</h1>
          
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="What do you want to listen to?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 bg-[#2a2a2a] border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="bg-[#a29bfe] hover:bg-[#9081f7] text-white"
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>

        {/* Search Results */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a29bfe]"></div>
            <span className="ml-3 text-gray-400">Searching Spotify...</span>
          </div>
        )}

        {searchPerformed && !loading && (
          <div className="space-y-8">
            {/* Tracks */}
            {results.tracks.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Music className="h-6 w-6 mr-2 text-[#a29bfe]" />
                  Songs
                </h2>
                <div className="grid gap-2">
                  {results.tracks.slice(0, 10).map((track) => (
                    <Card key={track.id} className="bg-[#121212] border-gray-800 hover:bg-[#1a1a1a] transition-colors">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Image
                            src={track.album.images[0]?.url || '/placeholder-track.jpg'}
                            alt={track.name}
                            width={48}
                            height={48}
                            className="rounded object-cover"
                          />
                          <div>
                            <h3 className="font-medium text-white">
                              {track.name}
                              {track.explicit && (
                                <span className="ml-2 text-xs bg-gray-600 text-white px-1 py-0.5 rounded">
                                  E
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {track.artists.map((artist: any) => artist.name).join(', ')} • {track.album.name}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleTrackPlay(track)}
                          className="text-[#a29bfe] hover:text-white hover:bg-[#a29bfe]/20"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Artists */}
            {results.artists.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <User className="h-6 w-6 mr-2 text-[#a29bfe]" />
                  Artists
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {results.artists.slice(0, 12).map((artist) => (
                    <Card key={artist.id} className="bg-[#121212] border-gray-800 hover:bg-[#1a1a1a] transition-colors cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <Image
                          src={artist.images[0]?.url || '/placeholder-artist.jpg'}
                          alt={artist.name}
                          width={120}
                          height={120}
                          className="rounded-full mx-auto mb-3 object-cover"
                        />
                        <h3 className="font-medium text-white text-sm truncate">{artist.name}</h3>
                        <p className="text-xs text-gray-400">Artist</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Albums */}
            {results.albums.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Disc3 className="h-6 w-6 mr-2 text-[#a29bfe]" />
                  Albums
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {results.albums.slice(0, 12).map((album) => (
                    <Card key={album.id} className="bg-[#121212] border-gray-800 hover:bg-[#1a1a1a] transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <Image
                          src={album.images[0]?.url || '/placeholder-album.jpg'}
                          alt={album.name}
                          width={120}
                          height={120}
                          className="rounded mx-auto mb-3 object-cover"
                        />
                        <h3 className="font-medium text-white text-sm truncate">{album.name}</h3>
                        <p className="text-xs text-gray-400 truncate">
                          {album.artists.map((artist: any) => artist.name).join(', ')}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Playlists */}
            {results.playlists.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Music className="h-6 w-6 mr-2 text-[#a29bfe]" />
                  Playlists
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {results.playlists.slice(0, 12).map((playlist) => (
                    <Card key={playlist.id} className="bg-[#121212] border-gray-800 hover:bg-[#1a1a1a] transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <Image
                          src={playlist.images[0]?.url || '/placeholder-playlist.jpg'}
                          alt={playlist.name}
                          width={120}
                          height={120}
                          className="rounded mx-auto mb-3 object-cover"
                        />
                        <h3 className="font-medium text-white text-sm truncate">{playlist.name}</h3>
                        <p className="text-xs text-gray-400 truncate">
                          by {playlist.owner?.display_name || 'Unknown'}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* No Results */}
            {searchPerformed && !loading && 
             results.tracks.length === 0 && 
             results.artists.length === 0 && 
             results.albums.length === 0 && 
             results.playlists.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-16 w-16 mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No results found</h3>
                <p className="text-gray-500">Try searching with different keywords</p>
              </div>
            )}
          </div>
        )}

        {/* Initial State */}
        {!searchPerformed && !loading && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Search Spotify</h3>
            <p className="text-gray-500">Find your favorite songs, artists, albums, and playlists</p>
          </div>
        )}
      </div>
    </div>
  );
} 