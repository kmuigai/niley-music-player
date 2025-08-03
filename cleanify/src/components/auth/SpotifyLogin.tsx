'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Music } from 'lucide-react';

export default function SpotifyLogin() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#2d3436] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="min-h-screen bg-[#2d3436] flex items-center justify-center p-4">
        <Card className="bg-[#2d3436] border border-gray-700 p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#6c5ce7] mb-2">Welcome to Niley!</h1>
            <p className="text-white">Connected to Spotify as:</p>
            <p className="text-[#a29bfe] font-semibold">{session.user.name}</p>
          </div>
          
          <div className="space-y-4">
            <Button
              onClick={() => window.location.href = '/'}
              className="w-full bg-[#6c5ce7] hover:bg-[#a29bfe] text-white"
            >
              <Music className="mr-2 h-4 w-4" />
              Open Music Dashboard
            </Button>
            
            <Button
              onClick={() => signOut()}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Disconnect Spotify
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2d3436] flex items-center justify-center p-4">
      <Card className="bg-[#2d3436] border border-gray-700 p-8 max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#6c5ce7] mb-4">Niley</h1>
          <p className="text-white text-lg mb-2">Family-Safe Music Streaming</p>
          <p className="text-gray-400 text-sm">
            Connect your Spotify account to start filtering explicit content in real-time
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-[#a29bfe]/10 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">What you get:</h3>
            <ul className="text-gray-300 text-sm space-y-1 text-left">
              <li>✓ Your existing Spotify playlists & library</li>
              <li>✓ Automatic explicit content filtering</li>
              <li>✓ Family Safe Mode toggle</li>
              <li>✓ Peace of mind around kids</li>
            </ul>
          </div>

          <Button
            onClick={() => signIn('spotify')}
            className="w-full bg-[#1db954] hover:bg-[#1ed760] text-white font-semibold py-3"
          >
            <Music className="mr-2 h-5 w-5" />
            Connect Spotify Account
          </Button>

          <p className="text-xs text-gray-500">
            Requires Spotify Premium for full functionality
          </p>
        </div>
      </Card>
    </div>
  );
} 