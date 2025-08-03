import LyricsService from './lyrics-fetcher';
import { LyricsAnalyzer, FilterResult, FilterOptions } from './profanity-filter';
import { FILTER_LEVELS } from './word-lists';

export interface TrackFilterResult {
  shouldBlock: boolean;
  reason: string;
  confidence: number;
  filterResult?: FilterResult;
  hasLyrics: boolean;
  track: {
    id: string;
    name: string;
    artist: string;
  };
}

export interface FilterSettings {
  level: keyof typeof FILTER_LEVELS;
  strictMode: boolean;
  blockUnknown: boolean; // Block songs when lyrics can't be found
  minConfidence: number;
}

export class FilterEngine {
  private lyricsService: LyricsService;
  private lyricsAnalyzer: LyricsAnalyzer;
  private cache: Map<string, TrackFilterResult> = new Map();
  
  constructor() {
    this.lyricsService = new LyricsService();
    this.lyricsAnalyzer = new LyricsAnalyzer();
  }

  /**
   * Main method: Determine if a track should be blocked
   */
  async shouldBlockTrack(
    trackId: string,
    trackName: string,
    artistName: string,
    settings: FilterSettings
  ): Promise<TrackFilterResult> {
    const cacheKey = `${trackId}-${settings.level}-${settings.strictMode}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const track = {
      id: trackId,
      name: trackName,
      artist: artistName
    };

    try {
      // Get lyrics for the track
      const lyrics = await this.lyricsService.getLyrics(artistName, trackName);
      
      if (!lyrics || lyrics.trim().length === 0) {
        // No lyrics found - use blockUnknown setting
        const result: TrackFilterResult = {
          shouldBlock: settings.blockUnknown,
          reason: settings.blockUnknown 
            ? 'No lyrics available - blocking for safety' 
            : 'No lyrics available - allowing',
          confidence: settings.blockUnknown ? 0.8 : 0.2,
          hasLyrics: false,
          track
        };
        
        this.cache.set(cacheKey, result);
        return result;
      }

      // Analyze lyrics for explicit content
      const filterOptions: Partial<FilterOptions> = {
        level: settings.level,
        strictMode: settings.strictMode,
        minConfidence: settings.minConfidence
      };

      const filterResult = this.lyricsAnalyzer.analyzeLyrics(lyrics, filterOptions);

      const result: TrackFilterResult = {
        shouldBlock: !filterResult.isClean,
        reason: !filterResult.isClean 
          ? filterResult.reasons.join(', ') || 'Contains explicit content'
          : 'Content is family-safe',
        confidence: filterResult.confidence,
        filterResult,
        hasLyrics: true,
        track
      };

      // Cache the result
      this.cache.set(cacheKey, result);
      
      return result;

    } catch (error) {
      console.error('Error filtering track:', error);
      
      // On error, be conservative and block
      const result: TrackFilterResult = {
        shouldBlock: true,
        reason: 'Error analyzing content - blocking for safety',
        confidence: 0.9,
        hasLyrics: false,
        track
      };
      
      return result;
    }
  }

  /**
   * Batch filter multiple tracks (for playlists)
   */
  async filterTracks(
    tracks: Array<{ id: string; name: string; artist: string }>,
    settings: FilterSettings
  ): Promise<TrackFilterResult[]> {
    const results: TrackFilterResult[] = [];
    
    // Process tracks in parallel (but limit concurrency to avoid rate limits)
    const batchSize = 5;
    for (let i = 0; i < tracks.length; i += batchSize) {
      const batch = tracks.slice(i, i + batchSize);
      const batchPromises = batch.map(track => 
        this.shouldBlockTrack(track.id, track.name, track.artist, settings)
      );
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }
    
    return results;
  }

  /**
   * Get filter statistics for a set of tracks
   */
  async getFilterStats(
    tracks: Array<{ id: string; name: string; artist: string }>,
    settings: FilterSettings
  ) {
    const results = await this.filterTracks(tracks, settings);
    
    const blocked = results.filter(r => r.shouldBlock);
    const allowed = results.filter(r => !r.shouldBlock);
    const noLyrics = results.filter(r => !r.hasLyrics);
    
    return {
      total: results.length,
      blocked: blocked.length,
      allowed: allowed.length,
      noLyrics: noLyrics.length,
      blockRate: (blocked.length / results.length) * 100,
      averageConfidence: results.reduce((sum, r) => sum + r.confidence, 0) / results.length,
      reasons: this.aggregateReasons(blocked)
    };
  }

  /**
   * Clear the cache (useful when settings change)
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  /**
   * Manually add a track to allowed/blocked list (parent override)
   */
  addManualOverride(
    trackId: string,
    shouldBlock: boolean,
    reason: string,
    settings: FilterSettings
  ): void {
    const cacheKey = `${trackId}-${settings.level}-${settings.strictMode}`;
    
    const result: TrackFilterResult = {
      shouldBlock,
      reason: `Manual override: ${reason}`,
      confidence: 1.0,
      hasLyrics: true,
      track: {
        id: trackId,
        name: 'Manual Override',
        artist: 'Manual Override'
      }
    };
    
    this.cache.set(cacheKey, result);
  }

  /**
   * Get default filter settings for different family situations
   */
  static getDefaultSettings(level: keyof typeof FILTER_LEVELS): FilterSettings {
    const baseSettings = {
      level,
      strictMode: false,
      blockUnknown: true,
      minConfidence: 0.7
    };

    switch (level) {
      case 'squeaky-clean':
        return {
          ...baseSettings,
          strictMode: true,
          blockUnknown: true,
          minConfidence: 0.5 // Lower threshold = more blocking
        };
      
      case 'family-friendly':
        return {
          ...baseSettings,
          strictMode: false,
          blockUnknown: true,
          minConfidence: 0.7
        };
      
      case 'teen-safe':
        return {
          ...baseSettings,
          strictMode: false,
          blockUnknown: false,
          minConfidence: 0.8 // Higher threshold = less blocking
        };
      
      default:
        return baseSettings;
    }
  }

  /**
   * Aggregate blocking reasons for statistics
   */
  private aggregateReasons(blockedTracks: TrackFilterResult[]): Record<string, number> {
    const reasons: Record<string, number> = {};
    
    for (const track of blockedTracks) {
      if (track.filterResult?.reasons) {
        for (const reason of track.filterResult.reasons) {
          reasons[reason] = (reasons[reason] || 0) + 1;
        }
      } else {
        // Fallback reason
        reasons[track.reason] = (reasons[track.reason] || 0) + 1;
      }
    }
    
    return reasons;
  }

  /**
   * Test the filter with sample lyrics (for debugging)
   */
  testFilter(lyrics: string, settings: FilterSettings): FilterResult {
    const filterOptions: Partial<FilterOptions> = {
      level: settings.level,
      strictMode: settings.strictMode,
      minConfidence: settings.minConfidence
    };

    return this.lyricsAnalyzer.analyzeLyrics(lyrics, filterOptions);
  }
}

// Export default instance
export const filterEngine = new FilterEngine(); 