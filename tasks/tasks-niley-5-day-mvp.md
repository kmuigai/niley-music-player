# 5-Day MVP: Niley Barebones Launch

## 🎯 **5-Day Goal**: Ship a working product that demonstrates core value

**Core Value Proposition**: Parents can search and play music with confidence that explicit content will be filtered out in real-time.

## 🚀 **MVP Scope (Minimum Viable Product)**

### **What We're Building**:
- Music search and playback using Spotify API (OAuth integration complete)
- Real-time lyric analysis with basic profanity filtering
- "Family Safe Mode" toggle that parents can trust
- Working audio player with skip functionality
- Simple demonstration that filtering actually works

### **What We're NOT Building** (Post-MVP):
- ❌ Complex AI analysis (start with word lists)
- ❌ Family account management (single user for now)
- ❌ PWA features (web app is fine)
- ❌ Parent dashboard (focus on core filtering)
- ❌ Multiple filter levels (just "Family Safe" on/off)

## 📅 **5-Day Sprint Plan**

### **Day 1: Spotify Integration Foundation** ✅ **COMPLETED**
- [x] 1.1 Set up Spotify Developer Account and OAuth app registration
- [x] 1.2 Implement OAuth 2.0 authentication flow with NextAuth
- [x] 1.3 Create Spotify Web API client with comprehensive methods
- [x] 1.4 Build authentication UI and session management

### **Day 2: Real Spotify Data Integration** ✅ **COMPLETED**
- [x] 2.1 Connect Dashboard to real Spotify user data ✅ **COMPLETED**
- [x] 2.2 Fetch and display user's actual playlists ✅ **COMPLETED**
- [x] 2.3 Replace mock data with live recently played tracks ✅ **COMPLETED**
- [x] 2.4 Implement real search functionality with Spotify API ✅ **COMPLETED**

### **Day 3: Content Filtering Foundation**
- [ ] 3.1 Integrate Genius Lyrics API for song lyrics
- [ ] 3.2 Create profanity word list (comprehensive but simple)
- [ ] 3.3 Build basic lyrics analysis function
- [ ] 3.4 Implement filter decision logic (block vs allow)

### **Day 4: Real-time Filtering**
- [ ] 4.1 Connect lyrics analysis to music playback
- [ ] 4.2 Implement automatic skipping of filtered content
- [ ] 4.3 Add "Family Safe Mode" toggle in UI
- [ ] 4.4 Show filtering status to user ("Song skipped - not family safe")

### **Day 5: Launch Preparation**
- [ ] 5.1 Test filtering with variety of content (explicit vs clean songs)
- [ ] 5.2 Fix critical bugs and performance issues
- [ ] 5.3 Deploy to production (Vercel)
- [ ] 5.4 Create demo video showing filtering in action
- [ ] 5.5 Write simple landing page explaining the product

## 🛠 **Technical Implementation**

### **Tech Stack (Confirmed)**:
- **Music Source**: Spotify Web API with OAuth 2.0 ✅
- **Authentication**: NextAuth with Spotify provider ✅
- **Lyrics**: Genius API (free tier available)
- **Filtering**: JavaScript word list + regex (no AI service needed)
- **Audio**: Spotify Web Playbook SDK
- **Frontend**: Current Niley UI (already built) ✅
- **Backend**: Next.js API routes (no external database needed)

### **Key Files Created** ✅:
```
src/app/api/auth/[...nextauth]/route.ts  ✅ // NextAuth configuration
src/lib/spotify/api.ts                   ✅ // Spotify Web API client
src/types/spotify.ts                     ✅ // Spotify data types
src/types/next-auth.d.ts                 ✅ // NextAuth session types
src/components/auth/SpotifyLogin.tsx     ✅ // Authentication UI
src/components/providers/SessionProvider.tsx ✅ // Session management

Still to create:
src/lib/filtering/
├── lyrics-fetcher.ts  // Genius API integration
├── profanity-filter.ts // Word list + analysis
├── filter-engine.ts   // Main filtering logic
└── word-lists.ts      // Profanity/explicit content lists

src/components/mvp/
├── FilterToggle.tsx   // Family Safe Mode switch
├── SafetyIndicator.tsx // Shows filtering status
└── SpotifyPlayer.tsx  // Spotify Web Playback SDK integration
```

## 🎯 **Success Metrics for 5-Day MVP**

### **Must Have (Launch Blockers)**:
- ✅ User can connect Spotify account (OAuth working)
- ✅ Authentication flow works properly
- ✅ Dashboard displays real user data (recently played, playlists, user info)
- ✅ User can search their Spotify library (tracks, artists, albums, playlists)
- ✅ **COMPLETED**: Songs play with working audio via Spotify Web Playback SDK
- [ ] Explicit songs are automatically skipped
- [ ] User sees clear indication when content is filtered
- [ ] Family Safe Mode toggle works reliably

### **Nice to Have (Post-Launch)**:
- Clean version suggestions
- Multiple filter sensitivity levels
- Better audio quality/source
- Playlist functionality

## 🚨 **Current Status & Next Steps**

### **✅ Day 1 Completed**:
- Spotify Developer Account configured
- OAuth 2.0 authentication working
- NextAuth session management
- Spotify API client ready
- Beautiful authentication UI

### **✅ Day 2 COMPLETE - Full Spotify Integration**:
- Created `useSpotifyData` hook for real API integration
- Dashboard displays real user data (recently played, playlists, user profile)
- Added loading states and error handling
- Replaced ALL mock data with live Spotify API responses
- Made playlists and tracks fully interactive with click handlers
- Added explicit content indicators (E) for family-safe filtering
- Enhanced UI with hover states, transitions, and better formatting
- Added dynamic greeting based on time of day
- **COMPLETE SEARCH FUNCTIONALITY** with real Spotify API
- Search page with tracks, artists, albums, and playlists
- Interactive search results with click handlers
- Navigation integration between dashboard and search

### **🔧 Setup Required**:
**User needs to complete**: Add Spotify Client ID and Client Secret to `.env.local`
**Test**: Visit **http://127.0.0.1:3001** and complete Spotify OAuth flow

### **🎯 PRIORITY: Music Playback Integration** ✅ **COMPLETED**:
- [x] Spotify Web Playback SDK integration for real audio streaming ✅ **COMPLETED**
- [x] Device initialization and connection in browser ✅ **COMPLETED**
- [x] Connect all play/pause/skip buttons to actual Spotify audio ✅ **COMPLETED**
- [x] Update player bar with real-time playback state ✅ **COMPLETED**
- [x] Error handling for premium requirements and playback issues ✅ **COMPLETED**

### **🎯 Day 3 Focus** (After Playback):
- Content filtering foundation with lyrics analysis
- Family Safe Mode toggle implementation
- Real-time explicit content filtering

---

## ⚡ **Ready for Content Filtering Foundation!**

**MUSIC PLAYBACK IS COMPLETE!** 🎉🎵 Your Spotify music player is fully functional. The app is running at **http://127.0.0.1:3001** with:

✅ **Real user data**: Recently played tracks, playlists, and user profile  
✅ **Interactive UI**: Clickable tracks and playlists with hover effects  
✅ **Complete Search**: Full search functionality for tracks, artists, albums, playlists  
✅ **Navigation**: Seamless navigation between dashboard and search  
✅ **Explicit content indicators**: Shows "E" for explicit tracks (family-safe prep!)  
✅ **Enhanced UX**: Dynamic greetings, transitions, and professional UI  
✅ **🎵 ACTUAL MUSIC PLAYBACK**: Spotify Web Playback SDK with real streaming audio!  
✅ **Player Controls**: Play/pause, skip, volume, seek - all connected to real Spotify  
✅ **Queue Management**: Proper track context and device transfer for seamless playback  
✅ **Error Handling**: Premium requirements, device management, connection status  

**🎯 NEXT: Day 3 - Content Filtering Foundation 🛡️**  
Time to implement the core family-safe filtering with lyrics analysis! 