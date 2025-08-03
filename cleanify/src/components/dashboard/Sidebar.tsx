'use client';

import { Home, Search, Library, Plus, Heart, Download } from 'lucide-react';
import { NavigationItem, Playlist } from '@/types/music';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';

interface SidebarProps {
  navigationItems: NavigationItem[];
  playlists: Playlist[];
}

export default function Sidebar({ navigationItems, playlists }: SidebarProps) {
  const handlePlaylistClick = (playlist: Playlist) => {
    console.log('Opening playlist:', playlist.name);
    // TODO: Navigate to playlist detail view
  };

  return (
    <div className="w-64 bg-[#2d3436] p-6 flex flex-col h-full">
      {/* Brand Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#6c5ce7]">Niley</h1>
      </div>

      {/* Main Navigation */}
      <nav className="space-y-4 mb-8">
        <Link href="/">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:text-white hover:bg-[#a29bfe]/15"
          >
            <Home className="h-5 w-5 mr-3" />
            Home
          </Button>
        </Link>
        <Link href="/search">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-400 hover:text-white hover:bg-[#a29bfe]/15"
          >
            <Search className="h-5 w-5 mr-3" />
            Search
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:text-white hover:bg-[#a29bfe]/15"
        >
          <Library className="h-5 w-5 mr-3" />
          Your Library
        </Button>
      </nav>

      {/* Secondary Actions */}
      <div className="space-y-4 mb-8">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:text-white hover:bg-[#a29bfe]/15"
        >
          <Plus className="h-5 w-5 mr-3" />
          Create Playlist
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:text-white hover:bg-[#a29bfe]/15"
        >
          <Heart className="h-5 w-5 mr-3" />
          Liked Songs
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:text-white hover:bg-[#a29bfe]/15"
        >
          <Download className="h-5 w-5 mr-3" />
          Your Episodes
        </Button>
      </div>

      {/* Playlist Section */}
      <div className="border-t border-gray-800 pt-4 flex-1">
        <ScrollArea className="h-32">
          <div className="space-y-2">
            {playlists.map((playlist, index) => (
              <div 
                key={playlist.id || index} 
                className="text-sm text-gray-400 hover:text-white cursor-pointer transition-colors py-1 px-2 rounded hover:bg-[#a29bfe]/15"
                onClick={() => handlePlaylistClick(playlist)}
                title={playlist.description || playlist.name}
              >
                <div className="truncate">{playlist.name}</div>
                {playlist.isOwned && (
                  <div className="text-xs text-gray-500">by you • {playlist.trackCount} songs</div>
                )}
              </div>
            ))}
            {playlists.length === 0 && (
              <div className="text-sm text-gray-500 italic">
                No playlists available
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
} 