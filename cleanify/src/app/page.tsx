'use client';

import { useSession } from 'next-auth/react';
import AppLayout from '@/components/layout/AppLayout';
import HomeContent from '@/components/dashboard/HomeContent';
import SpotifyLogin from '@/components/auth/SpotifyLogin';
import { useSpotifyData } from '@/hooks/useSpotifyData';

export default function Home() {
  const { data: session, status } = useSession();
  const { dashboardData, loading, error } = useSpotifyData();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#2d3436] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!session?.user) {
    return <SpotifyLogin />;
  }

  return (
    <AppLayout>
      <HomeContent 
        recentlyPlayed={dashboardData?.recentlyPlayed || []}
        topPlaylists={dashboardData?.topPlaylists || []}
        recommendedTracks={dashboardData?.recommendedTracks || []}
      />
    </AppLayout>
  );
}
