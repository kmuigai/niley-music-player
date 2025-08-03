'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Shield, ShieldCheck, ShieldX } from 'lucide-react';
import FilterToggle from '@/components/mvp/FilterToggle';
import SafetyIndicator from '@/components/mvp/SafetyIndicator';
import { FilterEngine } from '@/lib/filtering/filter-engine';
import { FilterSettings } from '@/lib/filtering/filter-engine';

// Sample tracks for demo (mix of explicit and clean)
const DEMO_TRACKS = [
  {
    id: 'demo-1',
    name: 'Shake It Off',
    artist: 'Taylor Swift', 
    album: '1989',
    imageUrl: 'https://i.scdn.co/image/ab67616d0000b273904445d70d04eb24d6bb79ac',
    duration: 219,
    isExplicit: false,
    expectedResult: 'safe'
  },
  {
    id: 'demo-2', 
    name: 'The Real Slim Shady',
    artist: 'Eminem',
    album: 'The Marshall Mathers LP',
    imageUrl: 'https://i.scdn.co/image/ab67616d0000b273dbb3dd82da45b7d7f31b1b42',
    duration: 284,
    isExplicit: true,
    expectedResult: 'blocked'
  },
  {
    id: 'demo-3',
    name: 'Perfect',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    imageUrl: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96',
    duration: 263,
    isExplicit: false,
    expectedResult: 'safe'
  },
  {
    id: 'demo-4',
    name: 'WAP',
    artist: 'Cardi B',
    album: 'WAP (feat. Megan Thee Stallion)',
    imageUrl: 'https://i.scdn.co/image/ab67616d0000b27334362676667a4322838ccc97',
    duration: 187,
    isExplicit: true,
    expectedResult: 'blocked'
  }
];

interface DemoTrackResult {
  track: typeof DEMO_TRACKS[0];
  filterResult: any;
  isAnalyzing: boolean;
  skipped: boolean;
}

export default function DemoPage() {
  const [isFilteringEnabled, setIsFilteringEnabled] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<typeof DEMO_TRACKS[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackResults, setTrackResults] = useState<Record<string, DemoTrackResult>>({});
  const [filterSettings, setFilterSettings] = useState<FilterSettings>({
    level: 'family-friendly',
    strictMode: false,
    blockUnknown: false,
    minConfidence: 0.7
  });

  const filterEngine = new FilterEngine();

  const analyzeTrack = async (track: typeof DEMO_TRACKS[0]) => {
    if (!isFilteringEnabled) return;

    setTrackResults(prev => ({
      ...prev,
      [track.id]: {
        track,
        filterResult: null,
        isAnalyzing: true,
        skipped: false
      }
    }));

    try {
      const result = await filterEngine.shouldBlockTrack(
        track.id,
        track.name,
        track.artist,
        filterSettings
      );

      const shouldSkip = result.shouldBlock;

      setTrackResults(prev => ({
        ...prev,
        [track.id]: {
          track,
          filterResult: result,
          isAnalyzing: false,
          skipped: shouldSkip
        }
      }));

      // Auto-skip if blocked
      if (shouldSkip && currentTrack?.id === track.id) {
        setTimeout(() => {
          setIsPlaying(false);
          setCurrentTrack(null);
        }, 2000); // Show blocking message for 2 seconds
      }

    } catch (error) {
      console.error('Demo analysis error:', error);
      setTrackResults(prev => ({
        ...prev,
        [track.id]: {
          track,
          filterResult: { shouldBlock: false, reason: 'Analysis failed', confidence: 0 },
          isAnalyzing: false,
          skipped: false
        }
      }));
    }
  };

  const playTrack = async (track: typeof DEMO_TRACKS[0]) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    
    if (isFilteringEnabled) {
      await analyzeTrack(track);
    }
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const getTrackResult = (trackId: string) => {
    return trackResults[trackId];
  };

  return (
    <div className="min-h-screen bg-[#2d3436] text-white">
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-gray-800 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">🎵 Niley Demo - Family-Safe Music Filtering</h1>
          <p className="text-gray-400">See how Niley automatically filters explicit content in real-time</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Filter Controls */}
        <Card className="p-6 bg-gray-800 border-gray-700">
          <h2 className="text-xl font-semibold mb-4">🛡️ Family Safe Mode</h2>
          <div className="flex items-center justify-between">
            <FilterToggle
              isEnabled={isFilteringEnabled}
              filterSettings={filterSettings}
              onToggle={setIsFilteringEnabled}
              onSettingsChange={setFilterSettings}
            />
            <div className="text-sm text-gray-400">
              {isFilteringEnabled 
                ? `Active - ${filterSettings.level.replace('-', ' ').toUpperCase()}` 
                : 'Click to enable filtering'
              }
            </div>
          </div>
        </Card>

        {/* Current Track */}
        {currentTrack && (
          <Card className="p-6 bg-gray-800 border-gray-700">
            <h3 className="text-lg font-semibold mb-4">🎧 Now Playing</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center">
                <div className="text-2xl">🎵</div>
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{currentTrack.name}</h4>
                <p className="text-gray-400">{currentTrack.artist}</p>
                {currentTrack.isExplicit && (
                  <Badge variant="destructive" className="mt-1">Explicit</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isFilteringEnabled && (
                  <SafetyIndicator
                    filterResult={getTrackResult(currentTrack.id)?.filterResult}
                    isAnalyzing={getTrackResult(currentTrack.id)?.isAnalyzing}
                    currentTrack={currentTrack}
                  />
                )}
                <Button
                  onClick={() => isPlaying ? pauseTrack() : playTrack(currentTrack)}
                  className="w-10 h-10 rounded-full"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Demo Track List */}
        <Card className="p-6 bg-gray-800 border-gray-700">
          <h3 className="text-xl font-semibold mb-4">🎵 Demo Tracks</h3>
          <p className="text-gray-400 mb-6">
            Try playing these tracks with Family Safe Mode enabled to see filtering in action:
          </p>
          
          <div className="grid gap-4">
            {DEMO_TRACKS.map((track) => {
              const result = getTrackResult(track.id);
              const isCurrentTrack = currentTrack?.id === track.id;
              
              return (
                <div 
                  key={track.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    isCurrentTrack 
                      ? 'border-purple-500 bg-purple-900/20' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-600 rounded flex items-center justify-center">
                      <div className="text-lg">🎵</div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{track.name}</h4>
                        {track.isExplicit && (
                          <Badge variant="destructive" className="text-xs">E</Badge>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{track.artist} • {track.album}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Filter Result */}
                      {isFilteringEnabled && result && (
                        <SafetyIndicator
                          filterResult={result.filterResult}
                          isAnalyzing={result.isAnalyzing}
                        />
                      )}

                      {/* Skipped Indicator */}
                      {result?.skipped && (
                        <Badge variant="destructive" className="animate-pulse">
                          Skipped
                        </Badge>
                      )}

                      {/* Play Button */}
                      <Button
                        onClick={() => playTrack(track)}
                        size="sm"
                        className="w-8 h-8 rounded-full"
                        disabled={result?.isAnalyzing}
                      >
                        <Play className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-6 bg-blue-900/20 border-blue-700">
          <h3 className="text-lg font-semibold mb-3">📝 How to Test</h3>
          <ol className="space-y-2 text-gray-300">
            <li>1. <strong>Enable Family Safe Mode</strong> above</li>
            <li>2. <strong>Click play</strong> on any demo track</li>
            <li>3. <strong>Watch the filtering</strong> - explicit tracks will be automatically skipped</li>
            <li>4. <strong>Try different filter levels</strong> in the settings (click the gear icon)</li>
            <li>5. <strong>See real-time analysis</strong> with confidence scores and reasons</li>
          </ol>
        </Card>
      </div>
    </div>
  );
} 