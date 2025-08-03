import { 
  EXPLICIT_CONTENT, 
  EXPLICIT_PHRASES, 
  FILTER_LEVELS,
  getFilterWords,
  getFilterPhrases,
  isContextSensitive 
} from './word-lists';

export interface FilterResult {
  isClean: boolean;
  confidence: number; // 0-1, higher = more confident in decision
  flaggedWords: string[];
  flaggedPhrases: string[];
  reasons: string[];
  filterLevel: string;
}

export interface FilterOptions {
  level: keyof typeof FILTER_LEVELS;
  strictMode: boolean; // If true, context-sensitive words are always flagged
  minConfidence: number; // Minimum confidence to block (0-1)
}

export class LyricsAnalyzer {
  private defaultOptions: FilterOptions = {
    level: 'family-friendly',
    strictMode: false,
    minConfidence: 0.7
  };

  /**
   * Analyze lyrics for explicit content
   */
  analyzeLyrics(lyrics: string, options?: Partial<FilterOptions>): FilterResult {
    const opts = { ...this.defaultOptions, ...options };
    const filterWords = getFilterWords(opts.level);
    const filterPhrases = getFilterPhrases(opts.level);

    // Normalize lyrics for analysis
    const normalizedLyrics = this.normalizeLyrics(lyrics);
    
    // Check for explicit words
    const flaggedWords = this.findFlaggedWords(normalizedLyrics, filterWords, opts.strictMode);
    
    // Check for explicit phrases
    const flaggedPhrases = this.findFlaggedPhrases(normalizedLyrics, filterPhrases);
    
    // Calculate confidence score
    const confidence = this.calculateConfidence(flaggedWords, flaggedPhrases, normalizedLyrics);
    
    // Determine if content is clean
    const isClean = confidence < opts.minConfidence;
    
    // Generate reasons for blocking
    const reasons = this.generateReasons(flaggedWords, flaggedPhrases);

    return {
      isClean,
      confidence,
      flaggedWords,
      flaggedPhrases,
      reasons,
      filterLevel: opts.level
    };
  }

  /**
   * Quick check for explicit content without detailed analysis
   */
  isContentClean(lyrics: string, level: keyof typeof FILTER_LEVELS = 'family-friendly'): boolean {
    const result = this.analyzeLyrics(lyrics, { level });
    return result.isClean;
  }

  /**
   * Normalize lyrics for analysis (lowercase, remove special chars, etc.)
   */
  private normalizeLyrics(lyrics: string): string {
    return lyrics
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
      .replace(/\s+/g, ' ')     // Multiple spaces to single space
      .trim();
  }

  /**
   * Find flagged words in normalized lyrics
   */
  private findFlaggedWords(lyrics: string, filterWords: string[], strictMode: boolean): string[] {
    const words = lyrics.split(' ');
    const flagged: string[] = [];

    for (const word of words) {
      for (const filterWord of filterWords) {
        if (this.wordMatches(word, filterWord)) {
          // Skip context-sensitive words in non-strict mode
          if (!strictMode && isContextSensitive(filterWord)) {
            // Could add context analysis here in the future
            continue;
          }
          
          if (!flagged.includes(filterWord)) {
            flagged.push(filterWord);
          }
        }
      }
    }

    return flagged;
  }

  /**
   * Find flagged phrases in normalized lyrics
   */
  private findFlaggedPhrases(lyrics: string, filterPhrases: string[]): string[] {
    const flagged: string[] = [];

    for (const phrase of filterPhrases) {
      const normalizedPhrase = phrase.toLowerCase();
      if (lyrics.includes(normalizedPhrase)) {
        flagged.push(phrase);
      }
    }

    return flagged;
  }

  /**
   * Check if a word matches a filter word (handles variations)
   */
  private wordMatches(word: string, filterWord: string): boolean {
    // Exact match
    if (word === filterWord) return true;
    
    // Handle common variations (plurals, ing endings, etc.)
    const variations = this.getWordVariations(filterWord);
    return variations.some(variation => word === variation || word.includes(variation));
  }

  /**
   * Generate common variations of a word
   */
  private getWordVariations(word: string): string[] {
    const variations = [word];
    
    // Add plural
    variations.push(word + 's');
    
    // Add ing form
    if (word.endsWith('e')) {
      variations.push(word.slice(0, -1) + 'ing');
    } else {
      variations.push(word + 'ing');
    }
    
    // Add ed form
    if (word.endsWith('e')) {
      variations.push(word + 'd');
    } else {
      variations.push(word + 'ed');
    }
    
    // Add er form
    variations.push(word + 'er');
    
    return variations;
  }

  /**
   * Calculate confidence score (0-1) that content should be blocked
   */
  private calculateConfidence(flaggedWords: string[], flaggedPhrases: string[], lyrics: string): number {
    let score = 0;
    const lyricsLength = lyrics.split(' ').length;

    // Base score from flagged words (more severe words = higher score)
    for (const word of flaggedWords) {
      if (['fuck', 'fucking', 'shit', 'bitch', 'nigger', 'faggot'].includes(word)) {
        score += 0.3; // Heavy profanity
      } else if (['damn', 'hell', 'ass', 'crap'].includes(word)) {
        score += 0.1; // Mild profanity
      } else {
        score += 0.2; // Other explicit content
      }
    }

    // Additional score from flagged phrases
    score += flaggedPhrases.length * 0.25;

    // Adjust based on frequency (more occurrences = higher confidence)
    const flaggedWordsCount = flaggedWords.length;
    const frequency = flaggedWordsCount / Math.max(lyricsLength, 1);
    
    if (frequency > 0.1) { // More than 10% flagged words
      score += 0.3;
    } else if (frequency > 0.05) { // More than 5% flagged words
      score += 0.15;
    }

    // Cap at 1.0
    return Math.min(score, 1.0);
  }

  /**
   * Generate human-readable reasons for blocking
   */
  private generateReasons(flaggedWords: string[], flaggedPhrases: string[]): string[] {
    const reasons: string[] = [];

    if (flaggedWords.length > 0) {
      const severeProfanity = flaggedWords.filter(w => 
        ['fuck', 'fucking', 'shit', 'bitch', 'nigger', 'faggot'].includes(w)
      );
      
      if (severeProfanity.length > 0) {
        reasons.push('Contains strong profanity');
      }
      
      if (flaggedWords.some(w => ['sex', 'sexy', 'fuck', 'cock', 'pussy'].includes(w))) {
        reasons.push('Contains sexual content');
      }
      
      if (flaggedWords.some(w => ['kill', 'murder', 'gun', 'violence'].includes(w))) {
        reasons.push('Contains violent content');
      }
      
      if (flaggedWords.some(w => ['weed', 'cocaine', 'drugs', 'high'].includes(w))) {
        reasons.push('Contains drug references');
      }
    }

    if (flaggedPhrases.length > 0) {
      reasons.push('Contains explicit phrases');
    }

    if (reasons.length === 0 && (flaggedWords.length > 0 || flaggedPhrases.length > 0)) {
      reasons.push('Contains inappropriate content');
    }

    return reasons;
  }
}

// Export default instance
export const lyricsAnalyzer = new LyricsAnalyzer(); 