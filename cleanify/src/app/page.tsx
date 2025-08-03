'use client';

import { useSession } from 'next-auth/react';
import Dashboard from '@/components/dashboard/Dashboard';
import SpotifyLogin from '@/components/auth/SpotifyLogin';

export default function Home() {
  const { data: session, status } = useSession();

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

  return <Dashboard />;
}
