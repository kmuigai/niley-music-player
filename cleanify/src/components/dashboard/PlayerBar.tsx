'use client';

import { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Volume2,
  Heart,
  Monitor
} from 'lucide-react';
import { Track } from '@/types/music';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { formatDuration } from '@/lib/mock-data';
import Image from 'next/image';

interface PlayerBarProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  shuffle: boolean;
  repeat: 'off' | 'track' | 'playlist';
  onPlay: () => void;
  onPause: () => void;
  onVolumeChange: (volume: number) => void;
  onSeek: (time: number) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function PlayerBar({
  currentTrack,
  isPlaying,
  volume,
  shuffle,
  repeat,
  onPlay,
  onPause,
  onVolumeChange,
  onSeek,
  onToggleShuffle,
  onToggleRepeat,
  onNext,
  onPrevious,
}: PlayerBarProps) {
  const [currentTime, setCurrentTime] = useState(45);
  const duration = 180;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Mock progress update when playing
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          if (newTime >= duration) {
            return 0; // Loop back to start
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, duration]);

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  const handleProgressChange = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    onSeek(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    onVolumeChange(value[0]);
  };

  if (!currentTrack) {
    return (
      <div className="bg-[#2d3436] border-t border-gray-800 p-4 flex items-center justify-center text-gray-400">
        <span>No track selected</span>
      </div>
    );
  }

  return (
    <div className="bg-[#2d3436] border-t border-gray-800 p-4 flex items-center justify-between">
      {/* Song Info */}
      <div className="flex items-center gap-4 w-1/4">
        <Image
          src="/placeholder.svg?height=56&width=56"
          alt="Current song"
          width={56}
          height={56}
          className="rounded"
        />
        <div>
          <h4 className="text-white text-sm font-medium">{currentTrack.name}</h4>
          <p className="text-gray-400 text-xs">{currentTrack.artist}</p>
        </div>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      {/* Playback Controls */}
      <div className="flex flex-col items-center gap-2 w-1/2">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-400 hover:text-white"
            onClick={onToggleShuffle}
          >
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-400 hover:text-white"
            onClick={onPrevious}
            disabled={!onPrevious}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            className="bg-white hover:bg-gray-200 text-black rounded-full w-8 h-8"
            onClick={handlePlayPause}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-400 hover:text-white"
            onClick={onNext}
            disabled={!onNext}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-400 hover:text-white"
            onClick={onToggleRepeat}
          >
            <Repeat className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 w-full max-w-md">
          <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
          <Slider
            value={[currentTime]}
            max={duration}
            step={1}
            className="flex-1 [&>span:first-child]:h-1 [&>span:first-child]:bg-gray-600 [&_[role=slider]]:bg-white [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-white [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0 [&_[role=slider]:focus-visible]:scale-105 [&_[role=slider]:focus-visible]:transition-transform"
            onValueChange={handleProgressChange}
          />
          <span className="text-xs text-gray-400">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume and Device Controls */}
      <div className="flex items-center gap-4 w-1/4 justify-end">
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <Monitor className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Volume2 className="h-4 w-4" />
          </Button>
          <Slider
            value={[volume]}
            max={100}
            step={1}
            className="w-24 [&>span:first-child]:h-1 [&>span:first-child]:bg-gray-600 [&_[role=slider]]:bg-white [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-white [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0"
            onValueChange={handleVolumeChange}
          />
        </div>
      </div>
    </div>
  );
} 