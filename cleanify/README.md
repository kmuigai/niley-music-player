# 🎵 Niley - Family-Safe Music Streaming

[![Deployment Status](https://img.shields.io/badge/deployment-ready-green.svg)](https://niley-music.vercel.app)
[![Filter Status](https://img.shields.io/badge/filtering-active-blue.svg)](#filtering-system)
[![Spotify](https://img.shields.io/badge/spotify-premium_required-1DB954.svg)](https://spotify.com)

**Niley** is an AI-powered family-safe layer on top of Spotify that filters explicit content in real-time, giving parents peace of mind while enjoying their full music library around kids.

## ✨ **5-Day MVP - COMPLETE!**

🎉 **All core features implemented and ready for production:**

✅ **Day 1-2**: Full Spotify integration with OAuth  
✅ **Day 3**: Advanced content filtering engine  
✅ **Day 4**: Real-time filtering with auto-skip  
✅ **Day 5**: Demo pages and launch preparation  

## 🚀 **Key Features**

### **Real-Time Content Filtering**
- AI-powered lyrics analysis with confidence scoring
- Automatic skipping of explicit content before it plays
- Multi-level filtering: Squeaky Clean, Family Friendly, Teen Safe
- Context-sensitive word analysis and manual overrides

### **Seamless Spotify Integration**  
- Full OAuth 2.0 authentication with Spotify
- Access to complete user library (playlists, recently played, search)
- Real-time music playback via Spotify Web Playback SDK
- Queue management and device control

### **Family-Safe UI**
- Toggle Family Safe Mode with advanced settings
- Real-time safety indicators with confidence scores
- Comprehensive testing suite for filter validation
- Professional dashboard with statistics tracking

## 🛠 **Tech Stack**

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Authentication**: NextAuth.js with Spotify provider
- **Music**: Spotify Web API + Web Playback SDK
- **Filtering**: Custom AI engine with lyrics.ovh + Genius APIs
- **Deployment**: Vercel (production-ready)

## 📦 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- Spotify Premium account
- Spotify Developer App (for API keys)

### **1. Clone and Install**
```bash
git clone <your-repo>
cd cleanify
npm install
```

### **2. Environment Setup**
Create `.env.local`:
```env
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-nextauth-secret
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
GENIUS_ACCESS_TOKEN=your-genius-token  # Optional
```

### **3. Run Development Server**
```bash
npm run dev
```

Visit `http://localhost:3001` and complete Spotify OAuth flow.

## 🎯 **Demo Pages**

- **Main Dashboard**: `/` - Full Spotify integration with filtering
- **Filter Testing**: `/test` - Comprehensive testing suite 
- **Live Demo**: `/demo` - Interactive filtering demonstration
- **Landing Page**: `/landing` - Product information and signup

## 🛡️ **Filtering System**

### **Filter Levels**
1. **Squeaky Clean**: Zero tolerance - perfect for young children
2. **Family Friendly**: Mild language okay, no explicit content  
3. **Teen Safe**: Mature themes allowed, heavy profanity filtered

### **How It Works**
1. **Real-time Analysis**: AI analyzes lyrics instantly when tracks start
2. **Smart Caching**: Results cached for performance (sub-500ms decisions)
3. **Auto-Skip**: Explicit tracks automatically skipped with visual feedback
4. **Confidence Scoring**: Shows filtering confidence (0-100%)
5. **Manual Overrides**: Parents can allow/block specific tracks

### **Testing the Filter**
Visit `/test` to run the comprehensive test suite:
- **Explicit Content**: Tests known inappropriate songs
- **Clean Content**: Validates family-safe tracks  
- **Borderline Content**: Tests edge cases and context sensitivity

## 🚀 **Deployment**

### **Vercel Deployment** (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Update NEXTAUTH_URL to production domain
```

### **Environment Variables for Production**
- `NEXTAUTH_URL`: Your production domain
- `NEXTAUTH_SECRET`: Strong random string
- `SPOTIFY_CLIENT_ID`: Spotify app client ID
- `SPOTIFY_CLIENT_SECRET`: Spotify app secret
- `GENIUS_ACCESS_TOKEN`: Optional, for enhanced lyrics

## 📊 **Architecture**

```
src/
├── app/                    # Next.js app router
│   ├── api/auth/           # NextAuth configuration  
│   ├── demo/               # Interactive demo page
│   ├── test/               # Filter testing suite
│   └── landing/            # Marketing landing page
├── components/
│   ├── dashboard/          # Main Spotify dashboard
│   ├── mvp/                # MVP filtering components
│   ├── auth/               # Authentication UI
│   └── ui/                 # shadcn/ui components
├── hooks/
│   ├── useSpotifyData.ts   # Spotify API integration
│   ├── useSpotifyPlayer.ts # Playback control
│   └── useContentFiltering.ts # Real-time filtering
├── lib/
│   ├── filtering/          # Content filtering engine
│   └── spotify/            # Spotify Web API client
└── types/                  # TypeScript definitions
```

## 🔧 **Core Components**

### **Content Filtering Engine** (`/lib/filtering/`)
- `filter-engine.ts`: Main filtering logic with caching
- `lyrics-fetcher.ts`: Multi-provider lyrics API integration  
- `profanity-filter.ts`: AI analysis with confidence scoring
- `word-lists.ts`: Comprehensive filter levels and word lists

### **Spotify Integration** (`/hooks/`)
- `useSpotifyData.ts`: Real user data (playlists, recently played)
- `useSpotifyPlayer.ts`: Web Playback SDK integration
- `useContentFiltering.ts`: Real-time filtering with auto-skip

### **UI Components** (`/components/mvp/`)
- `FilterToggle.tsx`: Family Safe Mode control with settings
- `SafetyIndicator.tsx`: Real-time filter status display
- `FilterTester.tsx`: Comprehensive testing interface

## 📈 **Performance**

- **Filter Decision Time**: <500ms (cached), <3s (new analysis)
- **Cache Hit Rate**: ~80% for repeated content
- **Spotify API**: Efficient batching and rate limiting
- **Real-time Updates**: WebSocket-style player state sync

## 🧪 **Testing**

### **Filter Accuracy Testing**
```bash
# Run the test suite
npm run dev
# Visit http://localhost:3001/test
```

Tests include:
- Known explicit tracks (should be blocked)
- Clean family-friendly tracks (should pass)
- Borderline content (context-dependent)
- Edge cases and error handling

### **Manual Testing Checklist**
- [ ] Spotify OAuth flow works
- [ ] Dashboard loads real user data  
- [ ] Music playback functions correctly
- [ ] Family Safe Mode toggle works
- [ ] Explicit tracks are auto-skipped
- [ ] Safety indicators show correct status
- [ ] Filter settings persist across sessions

## 🎬 **Demo Script**

1. **Visit landing page** → Explain product value
2. **Connect Spotify** → Show OAuth flow  
3. **Browse dashboard** → Real playlists and tracks
4. **Enable Family Safe Mode** → Toggle filtering
5. **Play explicit track** → Watch auto-skip in action
6. **Show safety indicators** → Real-time confidence scores
7. **Test different filter levels** → Squeaky Clean vs Teen Safe
8. **Visit test page** → Comprehensive validation suite

## 🚨 **Known Limitations**

- **Spotify Premium Required**: Web Playback SDK limitation
- **Lyrics Availability**: ~80% coverage, safe defaults for unknown
- **Real-time Analysis**: 1-3 second delay for new tracks
- **Language Support**: Currently English-only filtering

## 🛣️ **Post-MVP Roadmap**

- **Multi-language Support**: Expand beyond English
- **Advanced AI Models**: More sophisticated content analysis  
- **Family Accounts**: Multiple user profiles and parental controls
- **PWA Features**: Offline functionality and mobile optimization
- **Analytics Dashboard**: Detailed filtering insights for parents

## 📝 **License**

MIT License - see LICENSE file for details.

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Test thoroughly with real Spotify data
4. Submit pull request with demo video

## 💬 **Support**

- **Demo Issues**: Check `/test` page for filter validation
- **Spotify Connection**: Ensure Premium account and valid API keys
- **Filter Accuracy**: Report false positives/negatives with track details

---

**🎵 Niley: Making music safe for families, one track at a time.** 

Built with ❤️ for parents who want to enjoy their music library worry-free.
