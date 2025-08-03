import { useState, useEffect, useRef } from 'react';
import { FilterEngine } from '@/lib/filtering/filter-engine';
import { FilterSettings, TrackFilterResult } from '@/lib/filtering/filter-engine';

interface ContentFilteringState {
  isEnabled: boolean;
  currentFilterResult: TrackFilterResult | null;
  isAnalyzing: boolean;
  settings: FilterSettings;
  stats: {
    tracksAnalyzed: number;
    tracksBlocked: number;
    cacheHits: number;
  };
}

interface UseContentFilteringProps {
  currentTrack?: any; // Spotify track object
  onSkipTrack?: () => void; // Function to skip to next track
}

export function useContentFiltering({ 
  currentTrack, 
  onSkipTrack 
}: UseContentFilteringProps) {
  const [state, setState] = useState<ContentFilteringState>({
    isEnabled: false,
    currentFilterResult: null,
    isAnalyzing: false,
    settings: {
      level: 'family-friendly',
      strictMode: false,
      blockUnknown: false,
      minConfidence: 0.7
    },
    stats: {
      tracksAnalyzed: 0,
      tracksBlocked: 0,
      cacheHits: 0
    }
  });

  const filterEngineRef = useRef<FilterEngine | null>(null);
  const currentTrackIdRef = useRef<string | null>(null);

  // Initialize FilterEngine
  useEffect(() => {
    filterEngineRef.current = new FilterEngine();
  }, []);

  // Monitor track changes and apply filtering
  useEffect(() => {
    if (!currentTrack || !state.isEnabled || !filterEngineRef.current) return;

    const trackId = currentTrack.id;
    
    // Skip if same track is already being analyzed
    if (currentTrackIdRef.current === trackId) return;
    
    currentTrackIdRef.current = trackId;

    const analyzeTrack = async () => {
      setState(prev => ({ ...prev, isAnalyzing: true, currentFilterResult: null }));

      try {
        const result = await filterEngineRef.current!.shouldBlockTrack(
          trackId,
          currentTrack.name || 'Unknown Track',
          currentTrack.artists?.[0]?.name || 'Unknown Artist',
          state.settings
        );

        setState(prev => ({
          ...prev,
          isAnalyzing: false,
          currentFilterResult: result,
          stats: {
            ...prev.stats,
            tracksAnalyzed: prev.stats.tracksAnalyzed + 1,
            tracksBlocked: result.shouldBlock ? prev.stats.tracksBlocked + 1 : prev.stats.tracksBlocked
          }
        }));

        // Auto-skip if track should be blocked
        if (result.shouldBlock && onSkipTrack) {
          console.log(`🛡️ Blocking track: ${currentTrack.name} - ${result.reason}`);
          setTimeout(() => {
            onSkipTrack();
          }, 1000); // Small delay to show the blocking message
        }

      } catch (error) {
        console.error('Error analyzing track:', error);
        setState(prev => ({
          ...prev,
          isAnalyzing: false,
          currentFilterResult: {
            shouldBlock: false,
            reason: 'Analysis failed',
            confidence: 0,
            filterResult: undefined,
            hasLyrics: false,
            track: {
              id: trackId,
              name: currentTrack.name || 'Unknown Track',
              artist: currentTrack.artists?.[0]?.name || 'Unknown Artist'
            }
          }
        }));
      }
    };

    analyzeTrack();
  }, [currentTrack, state.isEnabled, state.settings, onSkipTrack]);

  const toggleFiltering = (enabled: boolean) => {
    setState(prev => ({ ...prev, isEnabled: enabled }));
    if (!enabled) {
      // Clear current result when disabled
      setState(prev => ({ ...prev, currentFilterResult: null, isAnalyzing: false }));
    }
  };

  const updateSettings = (newSettings: Partial<FilterSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  };

  const clearCache = () => {
    if (filterEngineRef.current) {
      filterEngineRef.current.clearCache();
    }
  };

  const getFilterStats = () => {
    return state.stats;
  };

  return {
    ...state,
    toggleFiltering,
    updateSettings,
    clearCache,
    getFilterStats,
  };
} 