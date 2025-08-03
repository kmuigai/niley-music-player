'use client';

import MainContent from './MainContent';
import { Track, Playlist } from '@/types/music';
import { usePlayer } from '@/components/layout/AppLayout';

interface HomeContentProps {
  recentlyPlayed: Track[];
  topPlaylists: Playlist[];
  recommendedTracks: Track[];
}

export default function HomeContent({
  recentlyPlayed,
  topPlaylists,
  recommendedTracks,
}: HomeContentProps) {
  const { handleTrackPlay } = usePlayer();

  return (
    <MainContent 
      recentlyPlayed={recentlyPlayed}
      topPlaylists={topPlaylists}
      recommendedTracks={recommendedTracks}
      onTrackPlay={handleTrackPlay}
    />
  );
} 