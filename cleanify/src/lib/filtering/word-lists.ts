/**
 * Profanity and explicit content word lists for family-safe filtering
 * MVP version - comprehensive but simple word-based filtering
 */

// Basic profanity list (family-safe filtering)
export const PROFANITY_WORDS = [
  // Common profanity
  'damn', 'hell', 'crap', 'shit', 'fuck', 'fucking', 'bitch', 'ass', 'bastard',
  'asshole', 'piss', 'bullshit', 'wtf', 'stfu', 'motherfucker', 'dickhead',
  
  // Slurs and offensive terms (partial list for MVP)
  'nigga', 'nigger', 'faggot', 'retard', 'slut', 'whore', 'cunt',
  
  // Sexual content
  'sex', 'sexy', 'horny', 'pussy', 'dick', 'cock', 'tits', 'boobs', 'porn',
  'masturbate', 'orgasm', 'climax', 'cum', 'cumming', 'blow job', 'blowjob',
  
  // Violence
  'kill', 'murder', 'shoot', 'gun', 'bullet', 'death', 'die', 'suicide',
  'rape', 'abuse', 'violence', 'blood', 'gore',
  
  // Drugs and alcohol
  'weed', 'marijuana', 'cocaine', 'crack', 'heroin', 'meth', 'drugs',
  'high', 'stoned', 'drunk', 'alcohol', 'beer', 'vodka', 'whiskey',
  
  // Other inappropriate content
  'gangsta', 'thug', 'pimp', 'ho', 'hoe', 'stripper', 'strip club'
];

// Sexual content keywords
export const SEXUAL_CONTENT = [
  'bedroom', 'bed', 'naked', 'nude', 'strip', 'seduce', 'tempt', 'desire',
  'lust', 'passion', 'intimate', 'sensual', 'erotic', 'sexual', 'foreplay',
  'make love', 'making love', 'one night', 'hookup', 'booty call'
];

// Violence and criminal activity
export const VIOLENCE_CONTENT = [
  'gang', 'gangster', 'criminal', 'crime', 'steal', 'rob', 'robbery',
  'fight', 'fighting', 'war', 'battle', 'weapon', 'knife', 'sword',
  'bomb', 'explosion', 'terrorist', 'revenge', 'enemy', 'hate'
];

// Drug and substance references
export const DRUG_CONTENT = [
  'smoke', 'smoking', 'joint', 'blunt', 'bong', 'pipe', 'dealer',
  'party', 'club', 'rave', 'molly', 'ecstasy', 'acid', 'trip',
  'pills', 'prescription', 'addicted', 'addiction'
];

// Combined explicit content list
export const EXPLICIT_CONTENT = [
  ...PROFANITY_WORDS,
  ...SEXUAL_CONTENT,
  ...VIOLENCE_CONTENT,
  ...DRUG_CONTENT
];

// Context-based phrases that might indicate explicit content
export const EXPLICIT_PHRASES = [
  'get high', 'getting high', 'smoke weed', 'roll up', 'light up',
  'one night stand', 'booty call', 'hook up', 'make out',
  'gang violence', 'drive by', 'street life', 'thug life',
  'strip club', 'lap dance', 'pole dance', 'red light district'
];

// Words that are often used in clean contexts but might be flagged
export const CONTEXT_SENSITIVE = [
  'hell', 'damn', 'ass', 'sex', 'kill', 'die', 'death', 'gun', 'shoot',
  'high', 'blow', 'strip', 'crack', 'weed', 'smoke', 'party'
];

// Filter levels
export interface FilterLevel {
  name: string;
  description: string;
  words: string[];
  phrases: string[];
  strictness: 'low' | 'medium' | 'high';
}

export const FILTER_LEVELS: Record<string, FilterLevel> = {
  'squeaky-clean': {
    name: 'Squeaky Clean',
    description: 'No questionable content whatsoever - perfect for young children',
    words: EXPLICIT_CONTENT,
    phrases: EXPLICIT_PHRASES,
    strictness: 'high'
  },
  'family-friendly': {
    name: 'Family Friendly', 
    description: 'Mild language okay, no explicit content - good for family listening',
    words: [...PROFANITY_WORDS, ...SEXUAL_CONTENT, ...VIOLENCE_CONTENT, ...DRUG_CONTENT],
    phrases: EXPLICIT_PHRASES,
    strictness: 'medium'
  },
  'teen-safe': {
    name: 'Teen Safe',
    description: 'Some mature themes okay, heavy profanity and explicit content filtered',
    words: [...PROFANITY_WORDS.filter(w => ['fuck', 'fucking', 'shit', 'bitch', 'motherfucker'].includes(w)), 
           ...SEXUAL_CONTENT, ...DRUG_CONTENT],
    phrases: EXPLICIT_PHRASES.filter(p => p.includes('drug') || p.includes('sex')),
    strictness: 'low'
  }
};

// Helper function to check if a word should be filtered based on context
export function isContextSensitive(word: string): boolean {
  return CONTEXT_SENSITIVE.includes(word.toLowerCase());
}

// Helper function to get filter words for a specific level
export function getFilterWords(level: keyof typeof FILTER_LEVELS): string[] {
  return FILTER_LEVELS[level]?.words || EXPLICIT_CONTENT;
}

// Helper function to get filter phrases for a specific level
export function getFilterPhrases(level: keyof typeof FILTER_LEVELS): string[] {
  return FILTER_LEVELS[level]?.phrases || EXPLICIT_PHRASES;
} 