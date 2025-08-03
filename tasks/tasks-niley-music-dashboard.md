# Tasks: Niley - Family-Safe Music Streaming PWA

## Current Status: 🎨 **UI FOUNDATION COMPLETE** 
Basic dashboard UI built - now need to build the actual Niley product per PRD

## Product Vision
**Niley**: AI-powered family-safe layer on top of Spotify that filters explicit content in real-time, giving parents peace of mind while enjoying their full music library around kids.

## Relevant Files

### ✅ Completed (UI Foundation)
- ✅ `src/components/dashboard/Dashboard.tsx` - Basic dashboard container (needs Spotify integration)
- ✅ `src/components/dashboard/Sidebar.tsx` - Navigation sidebar (needs family profiles)
- ✅ `src/components/dashboard/TopBar.tsx` - Top bar (needs auth integration)
- ✅ `src/components/dashboard/PlayerBar.tsx` - Player controls (needs Spotify playback)
- ✅ `src/components/dashboard/MainContent.tsx` - Content area (needs filtered content)
- ✅ `src/app/globals.css` - Niley purple theme
- ✅ `src/types/music.ts` - Basic music types
- ✅ `src/lib/mock-data.ts` - Mock data (to be replaced with Spotify API)

### 🔨 To Be Created (Core Product)
- `src/lib/spotify/auth.ts` - Spotify OAuth 2.0 authentication
- `src/lib/spotify/api.ts` - Spotify Web API integration
- `src/lib/ai/content-filter.ts` - AI-powered content analysis engine
- `src/lib/ai/lyrics-fetcher.ts` - Lyrics API integration (Genius, Musixmatch)
- `src/lib/filtering/filter-engine.ts` - Content filtering logic
- `src/lib/filtering/filter-levels.ts` - Squeaky Clean, Family Friendly, Teen Safe configs
- `src/components/family/FamilySetup.tsx` - Family account creation flow
- `src/components/family/ParentDashboard.tsx` - Parent controls and monitoring
- `src/components/family/ProfileManager.tsx` - Family member profile management
- `src/components/auth/SpotifyLogin.tsx` - Spotify authentication flow
- `src/components/filtering/FilterSettings.tsx` - Filter level configuration
- `src/components/filtering/ContentModeration.tsx` - Manual content review/reporting
- `src/lib/database/supabase.ts` - Database integration for family data
- `src/lib/cache/filter-cache.ts` - Caching system for filtered content
- `src/lib/pwa/service-worker.ts` - PWA offline functionality
- `public/manifest.json` - PWA manifest for home screen installation

## Tasks

- [x] **1.0 UI Foundation Setup** ✅ **COMPLETED**
  - [x] 1.1 Basic Next.js project with Niley theme
  - [x] 1.2 Dashboard components (Sidebar, TopBar, PlayerBar, MainContent)
  - [x] 1.3 Mock data and basic state management
  - [x] 1.4 shadcn/ui components integration

- [ ] **2.0 Spotify Integration & Authentication** 🔥 **HIGH PRIORITY**
  - [ ] 2.1 Set up Spotify Developer Account and App registration
  - [ ] 2.2 Implement OAuth 2.0 authentication flow with Spotify
  - [ ] 2.3 Create secure token storage and refresh handling
  - [ ] 2.4 Build Spotify Web API client with rate limiting
  - [ ] 2.5 Integrate real Spotify search, playlists, and user data
  - [ ] 2.6 Replace mock data with live Spotify content

- [ ] **3.0 AI Content Filtering Engine** 🔥 **CORE FEATURE**
  - [ ] 3.1 Set up Hugging Face API for content analysis
  - [ ] 3.2 Integrate lyrics APIs (Genius primary, Musixmatch backup)
  - [ ] 3.3 Build AI content classification system (profanity, adult themes, violence)
  - [ ] 3.4 Create confidence scoring and decision logic
  - [ ] 3.5 Implement real-time filtering during playback
  - [ ] 3.6 Build caching system for filter decisions
  - [ ] 3.7 Add manual override and correction system

- [ ] **4.0 Family Account Management** 🔥 **KEY DIFFERENTIATOR**
  - [ ] 4.1 Create family setup onboarding flow
  - [ ] 4.2 Build family member profile management
  - [ ] 4.3 Implement filter level presets (Squeaky Clean, Family Friendly, Teen Safe, Custom)
  - [ ] 4.4 Create parent dashboard with monitoring and controls
  - [ ] 4.5 Add PIN/password protection for settings
  - [ ] 4.6 Build spouse/partner sharing and collaboration features
  - [ ] 4.7 Implement age-based default settings

- [ ] **5.0 Database & Backend Infrastructure**
  - [ ] 5.1 Set up Supabase database for family data
  - [ ] 5.2 Design schema for families, profiles, filter settings, and cache
  - [ ] 5.3 Implement row-level security for family data isolation
  - [ ] 5.4 Create API routes for family management
  - [ ] 5.5 Build filter cache and analytics storage
  - [ ] 5.6 Add user activity tracking and listening history

- [ ] **6.0 Progressive Web App Features**
  - [ ] 6.1 Create PWA manifest for home screen installation
  - [ ] 6.2 Implement service worker for offline functionality
  - [ ] 6.3 Add push notifications for family activity
  - [ ] 6.4 Optimize for mobile, tablet, and desktop experiences
  - [ ] 6.5 Implement multi-device sync for settings and playback
  - [ ] 6.6 Add background audio capabilities

- [ ] **7.0 Content Discovery & Playback**
  - [ ] 7.1 Build filtered search with safety indicators
  - [ ] 7.2 Create "Clean versions available" suggestions
  - [ ] 7.3 Implement automatic clean version substitution
  - [ ] 7.4 Build family-safe playlist creation and sharing
  - [ ] 7.5 Add "Recently Cleaned" auto-generated playlists
  - [ ] 7.6 Create genre/mood browsing with filtering applied

- [ ] **8.0 Parent Controls & Monitoring**
  - [ ] 8.1 Build content moderation dashboard
  - [ ] 8.2 Create custom blocked/allowed lists
  - [ ] 8.3 Add listening activity monitoring and reports
  - [ ] 8.4 Implement manual song reporting and correction
  - [ ] 8.5 Build analytics and family insights
  - [ ] 8.6 Create filter effectiveness tracking

- [ ] **9.0 Performance & Quality Assurance**
  - [ ] 9.1 Optimize filter decision time (<500ms cached, <3s new)
  - [ ] 9.2 Implement comprehensive error handling and fallbacks
  - [ ] 9.3 Add automated testing for filtering accuracy
  - [ ] 9.4 Build user feedback and correction loops
  - [ ] 9.5 Implement monitoring and alerting (Sentry)
  - [ ] 9.6 Optimize for 99.5% uptime and performance

- [ ] **10.0 Launch Preparation**
  - [ ] 10.1 Beta testing with 50 parent families
  - [ ] 10.2 COPPA compliance review and implementation
  - [ ] 10.3 Security audit and penetration testing
  - [ ] 10.4 Performance testing under load
  - [ ] 10.5 Legal review of Spotify API usage and terms
  - [ ] 10.6 Marketing materials and launch strategy

## 🎯 **Implementation Priority (PRD-Based)**

### **Phase 1: Core MVP (Weeks 1-4)**
1. **Spotify Authentication & API Integration** - Must work with real Spotify accounts
2. **Basic AI Content Filtering** - Simple profanity filtering to start
3. **Family Account Setup** - Core family management functionality
4. **Filtered Playback** - Music that actually skips inappropriate content

### **Phase 2: Enhanced Filtering (Weeks 5-8)**
1. **Advanced AI Analysis** - Lyrics analysis, theme detection, confidence scoring
2. **Filter Level Presets** - Squeaky Clean, Family Friendly, Teen Safe
3. **Parent Dashboard** - Monitoring, controls, manual overrides
4. **PWA Features** - Offline functionality, home screen installation

### **Phase 3: Launch Ready (Weeks 9-12)**
1. **Performance Optimization** - Speed, caching, reliability
2. **User Experience Polish** - "Invisible" filtering experience
3. **Beta Testing & Feedback** - 50 family testing program
4. **Launch Preparation** - Legal, security, marketing

## 🚨 **Key Risks to Address**
- **Spotify API Rate Limits** - Need intelligent caching and batch processing
- **AI Filtering Accuracy** - Conservative defaults, multiple models, user feedback
- **Lyrics Availability** - Multiple providers, safe defaults for unknown content
- **Real-time Performance** - <500ms filter decisions for good UX

The current UI foundation is just 5% of the actual product. The real work is building the AI filtering engine, Spotify integration, and family management system that makes parents feel safe playing their music around kids. 