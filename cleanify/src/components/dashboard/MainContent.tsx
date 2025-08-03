'use client';

import { Track, Playlist } from '@/types/music';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import Image from 'next/image';

interface MainContentProps {
  recentlyPlayed: Track[];
  topPlaylists: Playlist[];
  recommendedTracks: Track[];
  onTrackPlay?: (track: Track) => void;
}

export default function MainContent({
  recentlyPlayed,
  topPlaylists,
  recommendedTracks,
  onTrackPlay,
}: MainContentProps) {
  
  const handleTrackPlay = (track: Track) => {
    if (onTrackPlay) {
      onTrackPlay(track);
    } else {
      console.log('Playing track:', track.name);
    }
  };

  const handlePlaylistClick = (playlist: Playlist) => {
    console.log('Opening playlist:', playlist.name);
    // TODO: Navigate to playlist detail view
  };

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-[#a29bfe]/20 to-[#121212] rounded-lg overflow-auto">
      <div className="p-8">
        {/* Dynamic Greeting */}
        <h2 className="text-3xl font-bold mb-8">{getGreeting()}</h2>

        {/* Recently Played Grid */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {recentlyPlayed.slice(0, 6).map((track, index) => (
            <div
              key={track.id ? `track-${track.id}` : `track-index-${index}`}
              className="bg-[#a29bfe]/10 rounded-md flex items-center hover:bg-[#a29bfe]/20 transition-colors cursor-pointer group"
              onClick={() => handleTrackPlay(track)}
            >
              <Image
                src={track.imageUrl || "/placeholder.svg"}
                alt={track.name}
                width={80}
                height={80}
                className="rounded-l-md"
                unoptimized
              />
              <div className="p-4 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white truncate flex-1">{track.name}</h3>
                  {track.explicit && (
                    <span className="bg-gray-600 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                      E
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 truncate">{track.artist}</p>
              </div>
              <Button
                size="icon"
                className="mr-4 bg-[#6c5ce7] hover:bg-[#a29bfe] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTrackPlay(track);
                }}
              >
                <Play className="h-4 w-4 text-black fill-black" />
              </Button>
            </div>
          ))}
        </div>

        {/* Your Playlists */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Playlists</h2>
            <Button variant="ghost" className="text-gray-400 hover:text-white text-sm">
              Show all
            </Button>
          </div>
          <div className="grid grid-cols-5 gap-6">
            {topPlaylists.map((playlist, index) => (
              <div 
                key={playlist.id ? `playlist-${playlist.id}` : `playlist-index-${index}`} 
                className="group cursor-pointer"
                onClick={() => handlePlaylistClick(playlist)}
              >
                <div className="relative mb-4">
                  <Image
                    src={playlist.imageUrl || "/placeholder.svg"}
                    alt={playlist.name}
                    width={160}
                    height={160}
                    className="rounded-md shadow-lg"
                    unoptimized
                  />
                  <Button
                    size="icon"
                    className="absolute bottom-2 right-2 bg-[#6c5ce7] hover:bg-[#a29bfe] rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlaylistClick(playlist);
                    }}
                  >
                    <Play className="h-4 w-4 text-black fill-black" />
                  </Button>
                </div>
                <h3 className="font-semibold text-white mb-1 truncate">{playlist.name}</h3>
                <p className="text-sm text-gray-400 truncate">{playlist.trackCount} songs</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended for You */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recommended for You</h2>
            <Button variant="ghost" className="text-gray-400 hover:text-white text-sm">
              Show all
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {recommendedTracks.map((track, index) => (
              <div 
                key={track.id ? `recommended-${track.id}` : `recommended-index-${index}`} 
                className="group cursor-pointer"
                onClick={() => handleTrackPlay(track)}
              >
                <div className="relative mb-4">
                  <Image
                    src={track.imageUrl || "/placeholder.svg"}
                    alt={track.name}
                    width={160}
                    height={160}
                    className="rounded-md shadow-lg"
                    unoptimized
                  />
                  <Button
                    size="icon"
                    className="absolute bottom-2 right-2 bg-[#6c5ce7] hover:bg-[#a29bfe] rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTrackPlay(track);
                    }}
                  >
                    <Play className="h-4 w-4 text-black fill-black" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white truncate flex-1">{track.name}</h3>
                  {track.explicit && (
                    <span className="bg-gray-600 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                      E
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 truncate">{track.artist}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 