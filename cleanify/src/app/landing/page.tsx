'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  ShieldCheck, 
  Music, 
  Heart, 
  Users, 
  Play,
  CheckCircle,
  ArrowRight,
  Headphones,
  Star
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#2d3436] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-[#2d3436] to-blue-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-green-600/20 border border-green-600/50 rounded-full px-4 py-2 text-green-400">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Family-Safe Music Streaming</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Niley
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Enjoy your full Spotify library with confidence. AI-powered filtering automatically removes explicit content in real-time, giving parents peace of mind while listening with kids.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3">
                  <Play className="w-5 h-5 mr-2" />
                  Try Niley Now
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-gray-400 hover:bg-gray-800">
                  <Headphones className="w-5 h-5 mr-2" />
                  See Demo
                </Button>
              </Link>
            </div>

            <div className="text-gray-400 text-sm">
              ✨ Works with your existing Spotify Premium account
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Parents Choose Niley</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Advanced AI filtering technology meets seamless music streaming for the ultimate family-safe experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 bg-gray-800 border-gray-700 hover:border-purple-500 transition-colors">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-Time Filtering</h3>
              <p className="text-gray-400">
                Our AI analyzes lyrics instantly and automatically skips explicit content before it reaches your family's ears.
              </p>
            </Card>

            <Card className="p-8 bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Family Profiles</h3>
              <p className="text-gray-400">
                Different filter levels for different ages: Squeaky Clean, Family Friendly, and Teen Safe modes.
              </p>
            </Card>

            <Card className="p-8 bg-gray-800 border-gray-700 hover:border-green-500 transition-colors">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <Music className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Your Full Library</h3>
              <p className="text-gray-400">
                Access your complete Spotify collection - playlists, liked songs, and recommendations - all filtered safely.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How Niley Works</h2>
            <p className="text-xl text-gray-400">Simple. Smart. Safe.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Connect Spotify</h3>
              <p className="text-gray-400 text-sm">Link your existing Spotify Premium account in seconds</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Enable Family Mode</h3>
              <p className="text-gray-400 text-sm">Choose your family's filter level and preferences</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">AI Analyzes</h3>
              <p className="text-gray-400 text-sm">Our AI instantly checks lyrics for explicit content</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">4</span>
              </div>
              <h3 className="font-semibold mb-2">Enjoy Safely</h3>
              <p className="text-gray-400 text-sm">Listen worry-free as inappropriate songs are skipped automatically</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Levels */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Filter Levels for Every Family</h2>
            <p className="text-xl text-gray-400">Choose the protection level that's right for your family</p>
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-r from-green-900/30 to-green-800/30 border-green-600">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-green-400">Squeaky Clean</h3>
                  <p className="text-gray-300">Perfect for young children - no questionable content whatsoever</p>
                </div>
                <Badge variant="outline" className="border-green-600 text-green-400">Highest Protection</Badge>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-blue-900/30 to-blue-800/30 border-blue-600">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-blue-400">Family Friendly</h3>
                  <p className="text-gray-300">Good for family listening - mild language okay, no explicit content</p>
                </div>
                <Badge variant="outline" className="border-blue-600 text-blue-400">Recommended</Badge>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-purple-900/30 to-purple-800/30 border-purple-600">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-purple-400">Teen Safe</h3>
                  <p className="text-gray-300">For teenagers - mature themes okay, heavy profanity and explicit content filtered</p>
                </div>
                <Badge variant="outline" className="border-purple-600 text-purple-400">Age 13+</Badge>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Enjoy Music Safely?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of families who trust Niley to keep their music experience family-friendly.
          </p>

          {!isEmailSubmitted ? (
            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                required
              />
              <Button type="submit" size="lg" className="bg-purple-600 hover:bg-purple-700">
                Get Early Access
              </Button>
            </form>
          ) : (
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-green-600/20 border border-green-600/50 rounded-lg px-6 py-3 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span>Thanks! We'll notify you when Niley launches.</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Play className="w-5 h-5 mr-2" />
                Try Niley Now
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="border-gray-400 hover:bg-gray-800">
                <ArrowRight className="w-5 h-5 mr-2" />
                See How It Works
              </Button>
            </Link>
          </div>

          <p className="text-gray-400 text-sm mt-6">
            Requires Spotify Premium • Free during beta
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>&copy; 2024 Niley. Making music safe for families.</p>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <Link href="/demo" className="hover:text-white">Demo</Link>
            <Link href="/test" className="hover:text-white">Test Filtering</Link>
            <Link href="/" className="hover:text-white">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
} 