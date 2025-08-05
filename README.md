# Karaoke - Real-time Collaborative Karaoke App

A modern web application for managing karaoke playlists with real-time collaboration powered by Yorkie. Create separate karaoke sessions using URL paths and collaborate with friends in real-time!

## Features

- **Real-time Collaboration**: Multiple users can edit playlists simultaneously using Yorkie CRDT
- **URL-based Sessions**: Create separate sessions with custom URLs (e.g., `/party2025`, `/office-karaoke`)
- **Playlist Management**: Create, edit, delete, and organize multiple playlists
- **Song Management**: Add, edit, delete, and reorder songs within playlists
- **Lyrics Display & Editing**: View and edit song lyrics with proper text support
- **Mobile-First Design**: Optimized for touch devices with responsive UI
- **Dark Theme**: Sleek dark theme optimized for comfortable viewing
- **Drag & Drop**: Reorder songs within playlists (desktop and mobile)
- **Search Functionality**: Quick search through songs by title or artist
- **Live Presence**: See who else is online and collaborating

## Tech Stack

### Frontend
- **React + TypeScript** - Modern UI with type safety
- **Vite** - Fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **Yorkie React** - Real-time collaboration hooks
- **Lucide React** - Beautiful icons

### Backend
- **Yorkie** - Real-time collaboration backend
- **GitHub Pages** - Static hosting with custom domain

## Live Demo

Visit **[karaoke.krapie.cloud](https://karaoke.krapie.cloud)** to try it out!

### Create Your Own Session
- `karaoke.krapie.cloud/` - Default session
- `karaoke.krapie.cloud/your-name` - Your personal session
- `karaoke.krapie.cloud/party2025` - Party session
- `karaoke.krapie.cloud/family-night` - Family session

## Getting Started

### Quick Start
1. **Visit the live demo**: [karaoke.krapie.cloud](https://karaoke.krapie.cloud)
2. **Create your session**: Add your name to the URL (e.g., `/yourname`)
3. **Start collaborating**: Create playlists and songs with real-time updates

### Development Setup
```bash
# Clone the repository
git clone https://github.com/krapie/karaoke.git
cd karaoke/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app in development mode.

### Building for Production
```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

### Environment Configuration
No environment variables required! The app uses Yorkie's public API for real-time collaboration.

### Custom Deployment
1. Fork this repository
2. Enable GitHub Pages in your repository settings
3. Configure your custom domain (optional)
4. The app will auto-deploy on every push to main branch

## Usage

### Creating Collaborative Sessions
1. **Visit the app**: Go to [karaoke.krapie.cloud](https://karaoke.krapie.cloud)
2. **Create a custom session**: Add any path to the URL (e.g., `/party2025`)
3. **Share the URL**: Send the link to friends for real-time collaboration
4. **Start collaborating**: Everyone can add/edit playlists and songs simultaneously

### Managing Playlists & Songs
- **Create Playlist**: Click the "+" button or "Create Playlist"
- **Add Songs**: Select a playlist and click "Add Song"
- **Edit Content**: Click on any playlist or song to edit
- **Reorder Items**: Drag and drop songs to reorder them
- **Search**: Use the search bar to find songs quickly

### Real-time Features
- **Live Updates**: Changes appear instantly across all connected devices
- **Presence Indicators**: See who else is online (connection status in header)
- **Conflict Resolution**: Yorkie automatically handles simultaneous edits
- **Offline Support**: Works offline and syncs when reconnected

### Mobile Experience
- **Touch Optimized**: All interactions work smoothly on mobile
- **Responsive Design**: Adapts to any screen size
- **Gesture Support**: Swipe and touch gestures throughout the app

## Architecture

### Real-time Collaboration
The app uses **Yorkie** as the backend for real-time collaboration:
- **Document-based**: Each URL path creates a separate Yorkie document
- **CRDT**: Conflict-free replicated data types handle simultaneous edits
- **Offline-first**: Changes sync automatically when reconnected
- **No traditional backend**: Direct connection to Yorkie's collaboration server

### Data Structure
```typescript
// Yorkie document structure
{
  playlists: {
    [id: string]: {
      id: string;
      name: string;
      createdAt: string;
    }
  },
  songs: {
    [id: string]: {
      id: string;
      title: string;
      artist: string;
      lyrics?: string;
      playlistId: string;
      order: number;
      createdAt: string;
    }
  }
}
```

### Frontend Architecture
- **React Hooks**: Custom hooks for Yorkie operations (`useYorkiePlaylists`, `useYorkieSongs`)
- **Type Safety**: Full TypeScript support with proper Yorkie typing
- **Component Structure**: Modular components with clear separation of concerns
- **State Management**: Yorkie document serves as single source of truth

## Design System

### Colors (YouTube Music Inspired)
- **Primary**: Red-based palette for actions and highlights
- **Dark Theme**: Deep blacks and grays for comfortable viewing

### Typography
- **Primary Font**: Noto Sans JP (for Japanese text support)
- **Fallback**: System fonts for optimal performance

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Multiple variants (primary, secondary, ghost, danger)
- **Forms**: Clean inputs with proper validation
- **Navigation**: Tab-based playlist switching

## Development

### Project Structure
```
karaoke/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/             # Header, Layout components
│   │   │   ├── playlist/           # Playlist management
│   │   │   ├── song/               # Song components
│   │   │   └── ui/                 # Reusable UI components
│   │   ├── hooks/
│   │   │   ├── useYorkiePlaylists.ts  # Real-time playlist operations
│   │   │   └── useYorkieSongs.ts      # Real-time song operations
│   │   ├── providers/
│   │   │   └── KaraokeProvider.tsx    # Yorkie integration wrapper
│   │   ├── types/                  # TypeScript definitions
│   │   └── utils/                  # Utility functions
│   ├── public/                     # Static assets
│   └── package.json
├── docker/                         # Docker configuration (legacy)
└── README.md
```

### Key Features Implementation

#### URL-based Sessions
```typescript
// Extract document key from URL path
const getDocumentKey = () => {
  const path = window.location.pathname;
  return path === '/' ? 'default' : path.slice(1);
};
```

#### Real-time Collaboration
```typescript
// Custom hook for real-time playlist operations
export const useYorkiePlaylists = () => {
  const document = useDocument();
  
  const createPlaylist = useCallback(async (name: string) => {
    const playlist = { id: crypto.randomUUID(), name, createdAt: new Date().toISOString() };
    document.update((root) => {
      root.playlists[playlist.id] = playlist;
    });
  }, [document]);
  
  return { playlists, createPlaylist, updatePlaylist, deletePlaylist };
};
```

#### Mobile-First Design
- TailwindCSS responsive utilities (`sm:`, `md:`, `lg:`)
- Touch-optimized button sizes (min 44px)
- Responsive header with progressive disclosure
- Mobile-specific presence indicators

## Deployment

### GitHub Pages (Current)
The app is automatically deployed to GitHub Pages:
- **Custom Domain**: [karaoke.krapie.cloud](https://karaoke.krapie.cloud)
- **GitHub Actions**: Automated build and deployment on push
- **SPA Support**: 404.html redirect for client-side routing
- **No Backend Required**: Direct connection to Yorkie's collaboration server

### Deploy Your Own Version
```bash
# 1. Fork the repository
# 2. Enable GitHub Pages in repository settings
# 3. Set up GitHub Actions (already configured)
# 4. Optional: Configure custom domain in repository settings
```

### Local Development
```bash
cd frontend
npm install
npm run dev    # Development server on localhost:5173
npm run build  # Production build
npm run preview # Preview production build
```

### Environment Variables
No environment variables needed! The app uses Yorkie's public collaboration API.

## Testing

### Manual Testing Scenarios
1. **Real-time Collaboration**
   - Open same URL in multiple browser windows
   - Create/edit playlists and songs simultaneously
   - Verify changes appear instantly across all windows

2. **Session Management**
   - Test different URL paths (e.g., `/test`, `/party`)
   - Verify each path creates separate document/session
   - Check session persistence across page refreshes

3. **Mobile Experience**
   - Test responsive design on various screen sizes
   - Verify touch interactions and mobile-optimized header
   - Check presence indicators on mobile devices

4. **Offline Support**
   - Disconnect internet and make changes
   - Reconnect and verify changes sync properly
   - Test conflict resolution with simultaneous offline edits

### Development Testing
```bash
# Start development server
npm run dev

# Test different sessions
# http://localhost:5173/        (default session)
# http://localhost:5173/test    (test session)
# http://localhost:5173/party   (party session)

# Build and preview production
npm run build
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **Yorkie** - Real-time collaboration infrastructure by [Yorkie Team](https://yorkie.dev)
- **React** - Modern UI framework for building the frontend
- **TailwindCSS** - Utility-first CSS framework for rapid development
- **Vite** - Fast build tool and development server
- **GitHub Pages** - Free static hosting platform
- **Lucide React** - Beautiful icon set for the UI
- Built with love for karaoke enthusiasts worldwide
