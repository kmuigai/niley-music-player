'use client';

import { Home, Search, Library, Plus, Heart, Download } from 'lucide-react';
import { NavigationItem } from '@/types/music';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  navigationItems: NavigationItem[];
}

export default function Sidebar({ navigationItems }: SidebarProps) {
  const pathname = usePathname();

  const getNavButtonClass = (href: string) => {
    const isActive = pathname === href;
    return `w-full justify-start hover:text-white hover:bg-[#a29bfe]/15 ${
      isActive 
        ? 'text-white bg-[#a29bfe]/20' 
        : 'text-gray-400'
    }`;
  };

  return (
    <div className="w-64 bg-[#121212] rounded-lg p-6 flex flex-col h-full">
      {/* Main Navigation */}
      <nav className="space-y-4 mb-8">
        <Link href="/">
          <Button 
            variant="ghost" 
            className={getNavButtonClass('/')}
          >
            <Home className="h-5 w-5 mr-3" />
            Home
          </Button>
        </Link>
        <Link href="/search">
          <Button
            variant="ghost"
            className={getNavButtonClass('/search')}
          >
            <Search className="h-5 w-5 mr-3" />
            Search
          </Button>
        </Link>
        <Link href="/library">
          <Button
            variant="ghost"
            className={getNavButtonClass('/library')}
          >
            <Library className="h-5 w-5 mr-3" />
            Your Library
          </Button>
        </Link>
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
        <Link href="/liked-songs">
          <Button
            variant="ghost"
            className={getNavButtonClass('/liked-songs')}
          >
            <Heart className="h-5 w-5 mr-3" />
            Liked Songs
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:text-white hover:bg-[#a29bfe]/15"
        >
          <Download className="h-5 w-5 mr-3" />
          Your Episodes
        </Button>
      </div>
    </div>
  );
} 