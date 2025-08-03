interface GeniusSearchResponse {
  response: {
    hits: Array<{
      result: {
        id: number;
        title: string;
        artist_names: string;
        url: string;
        lyrics_state: string;
      };
    }>;
  };
}

interface GeniusLyricsResponse {
  lyrics: string;
  error?: string;
}

class LyricsFetcher {
  private baseUrl = 'https://api.genius.com';
  private accessToken: string;

  constructor() {
    this.accessToken = process.env.GENIUS_ACCESS_TOKEN || '';
    if (!this.accessToken) {
      console.warn('Genius API token not found. Set GENIUS_ACCESS_TOKEN in environment variables.');
    }
  }

  /**
   * Search for a song on Genius
   */
  async searchSong(artist: string, title: string): Promise<number | null> {
    if (!this.accessToken) {
      throw new Error('Genius API token not configured');
    }

    const query = `${artist} ${title}`.trim();
    const searchUrl = `${this.baseUrl}/search?q=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(searchUrl, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Genius API error: ${response.status}`);
      }

      const data: GeniusSearchResponse = await response.json();
      
      if (data.response.hits.length === 0) {
        return null;
      }

      // Return the first matching song ID
      return data.response.hits[0].result.id;
    } catch (error) {
      console.error('Error searching for song on Genius:', error);
      return null;
    }
  }

  /**
   * Fetch lyrics for a song by Genius song ID
   * Note: Genius API doesn't provide direct lyrics access, so we'll use web scraping
   * For MVP, we'll implement a basic version that can be enhanced later
   */
  async fetchLyrics(songId: number): Promise<GeniusLyricsResponse> {
    try {
      // For MVP: Return placeholder indicating we need lyrics
      // In production, you'd either:
      // 1. Use lyrics.ovh API as fallback
      // 2. Use Musixmatch API 
      // 3. Implement web scraping (with proper rate limiting)
      
      return {
        lyrics: '', // Will implement scraping in next iteration
        error: 'Lyrics fetching not yet implemented'
      };
    } catch (error) {
      console.error('Error fetching lyrics:', error);
      return {
        lyrics: '',
        error: 'Failed to fetch lyrics'
      };
    }
  }

  /**
   * Get lyrics for a Spotify track
   */
  async getLyricsForTrack(artist: string, title: string): Promise<string> {
    try {
      const songId = await this.searchSong(artist, title);
      
      if (!songId) {
        console.log(`No lyrics found for: ${artist} - ${title}`);
        return '';
      }

      const result = await this.fetchLyrics(songId);
      return result.lyrics || '';
    } catch (error) {
      console.error('Error getting lyrics for track:', error);
      return '';
    }
  }
}

// Alternative lyrics API (lyrics.ovh) as fallback
class LyricsOvhFetcher {
  private baseUrl = 'https://api.lyrics.ovh/v1';

  async fetchLyrics(artist: string, title: string): Promise<string> {
    try {
      const url = `${this.baseUrl}/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`;
      const response = await fetch(url);

      if (!response.ok) {
        return '';
      }

      const data = await response.json();
      return data.lyrics || '';
    } catch (error) {
      console.error('Error fetching from lyrics.ovh:', error);
      return '';
    }
  }
}

// Main lyrics service with fallback strategy
export class LyricsService {
  private geniusFetcher: LyricsFetcher;
  private lyricsOvhFetcher: LyricsOvhFetcher;

  constructor() {
    this.geniusFetcher = new LyricsFetcher();
    this.lyricsOvhFetcher = new LyricsOvhFetcher();
  }

  async getLyrics(artist: string, title: string): Promise<string> {
    // Clean up artist and title
    const cleanArtist = artist.replace(/\s*\([^)]*\)/g, '').trim();
    const cleanTitle = title.replace(/\s*\([^)]*\)/g, '').trim();

    // Try lyrics.ovh first (simpler, more reliable for MVP)
    let lyrics = await this.lyricsOvhFetcher.fetchLyrics(cleanArtist, cleanTitle);
    
    if (lyrics) {
      return lyrics;
    }

    // Fallback to Genius (for future enhancement)
    lyrics = await this.geniusFetcher.getLyricsForTrack(cleanArtist, cleanTitle);
    
    return lyrics;
  }
}

export default LyricsService; 