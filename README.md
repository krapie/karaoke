# Karaoke

A mobile-optimized web service for managing karaoke playlists with lyrics display functionality, particularly focusing on Japanese songs.

## 🎵 Features

- ✅ **Playlist Management**: Create, edit, delete, and organize multiple playlists
- ✅ **Song Management**: Add, edit, delete, and reorder songs within playlists
- ✅ **Lyrics Display & Editing**: View and edit song lyrics with proper Japanese text support
- ✅ **Mobile-First Design**: Optimized for touch devices with YouTube Music-inspired UI
- ✅ **Dark Theme**: Sleek dark theme optimized for comfortable viewing
- ✅ **Drag & Drop**: Reorder songs within playlists (desktop and mobile)
- ✅ **Search Functionality**: Quick search through songs by title or artist
- ✅ **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

## 🛠 Tech Stack

### Frontend
- **Vite** - Build tool and development server
- **React** - UI library with TypeScript
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client

### Backend
- **Go (Golang)** - Server language
- **Gorilla Mux** - HTTP router
- **MongoDB** - NoSQL database
- **Docker** - Containerization

### Database Schema
```
Collections:
├── playlists
│   ├── _id (ObjectID)
│   ├── name (string)
│   ├── order (int)
│   ├── createdAt (timestamp)
│   └── updatedAt (timestamp)
└── songs
    ├── _id (ObjectID)
    ├── title (string)
    ├── artist (string)
    ├── playlistId (ObjectID)
    ├── order (int)
    ├── lyrics (string, optional)
    ├── createdAt (timestamp)
    └── updatedAt (timestamp)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Go (v1.19+)
- MongoDB (via Docker or local installation)
- Docker (optional, for easy setup)

### Development Setup

#### 1. Clone the repository
```bash
git clone <repository-url>
cd karaoke
```

#### 2. Start MongoDB (using Docker)
```bash
docker run -d --name karaoke-mongo -p 27017:27017 mongo:latest
```

#### 3. Start the Backend
```bash
cd backend
go mod tidy
go run cmd/main.go
```
The backend will start on `http://localhost:8080`

#### 4. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on `http://localhost:`

### Using Docker Compose (Recommended)

#### Development
```bash
# Start only MongoDB for development
docker-compose -f docker-compose.dev.yml up -d
```

#### Production
```bash
# Build and start all services
docker-compose up --build
```

## 📱 Usage

### Creating Your First Playlist
1. Open the application in your browser
2. Click "Create Playlist" 
3. Enter a name for your playlist
4. Start adding songs!

### Adding Songs
1. Select a playlist from the tabs
2. Click "Add Song"
3. Fill in the song title, artist, and optional lyrics
4. Save the song

### Viewing Song Details
1. Click on any song in the playlist
2. View full lyrics in a dedicated page
3. Edit lyrics inline by clicking "Edit Lyrics"
4. Use the back button to return to the playlist

### Mobile Features
- **Touch-friendly interface**: All buttons and interactions optimized for mobile
- **Responsive design**: Works on phones, tablets, and desktops
- **Touch drag & drop**: Long press and drag to reorder songs on mobile
- **Haptic feedback**: Vibration feedback during drag operations (if supported)
- **Gesture support**: Smooth scrolling and intuitive navigation
- **Japanese text support**: Proper rendering of Japanese characters

### Song Management
- **Search**: Use the search bar to quickly find songs by title or artist
- **Reordering**: 
  - **Desktop**: Click and drag the grip icon (⋮⋮) to reorder songs
  - **Mobile**: Long press and drag the grip icon to reorder songs
- **Quick access**: Tap any song to view details, lyrics, and edit options

## 🎯 API Endpoints

### Playlists
- `GET /api/playlists` - List all playlists
- `POST /api/playlists` - Create new playlist
- `GET /api/playlists/:id` - Get playlist by ID
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist

### Songs
- `GET /api/songs?playlistId=:id` - List songs in playlist
- `POST /api/songs` - Create new song
- `GET /api/songs/:id` - Get song by ID
- `PUT /api/songs/:id` - Update song
- `PUT /api/songs/:id/order` - Update song order
- `DELETE /api/songs/:id` - Delete song

## 🎨 Design System

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

## 🔧 Development

### Project Structure
```
karaoke/
├── backend/
│   ├── cmd/main.go                 # Application entry point
│   ├── internal/
│   │   ├── config/                 # Configuration management
│   │   ├── database/               # Database connection
│   │   ├── handlers/               # HTTP handlers
│   │   └── models/                 # Data models
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/             # React components
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── services/               # API services
│   │   ├── types/                  # TypeScript types
│   │   └── utils/                  # Utility functions
│   └── Dockerfile
└── docker-compose.yml
```

### Key Features Implementation

#### Mobile-First Responsive Design
- CSS Grid and Flexbox for layouts
- TailwindCSS responsive utilities
- Touch-optimized button sizes (44px minimum)
- Swipe gestures for navigation

#### Japanese Text Support
- Noto Sans JP font family
- Proper text rendering for mixed scripts
- UTF-8 encoding throughout the stack
- Japanese-friendly input handling

#### Real-time Updates
- Optimistic UI updates
- Error handling with rollback
- Loading states for better UX

## 🚢 Deployment

### Environment Variables

#### Backend (.env)
```
PORT=8080
MONGO_URI=mongodb://localhost:27017
DATABASE_NAME=karaoke
```

#### Frontend (.env)
```
VITE_API_URL=http://localhost:8080/api
```

### Production Deployment
1. Update environment variables for production
2. Build and deploy using Docker Compose
3. Configure reverse proxy (nginx) if needed
4. Set up SSL certificates for HTTPS

## 🧪 Testing

### Manual Testing Scenarios
1. **Playlist Management**
   - Create, edit, delete playlists
   - Switch between multiple playlists
   
2. **Song Management**
   - Add songs with Japanese characters
   - Edit song information and lyrics
   - Reorder songs within playlists
   
3. **Mobile Experience**
   - Test on various screen sizes
   - Verify touch interactions
   - Check theme switching

### API Testing
```bash
# Test playlist creation
curl -X POST http://localhost:8080/api/playlists \
  -H "Content-Type: application/json" \
  -d '{"name": "My Playlist"}'

# Test song creation with Japanese text
curl -X POST http://localhost:8080/api/songs \
  -H "Content-Type: application/json" \
  -d '{"title": "夜に駆ける", "artist": "YOASOBI", "playlistId": "..."}'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎵 Acknowledgments

- Inspired by YouTube Music's clean and intuitive interface
- Japanese font support by Google Fonts (Noto Sans JP)
- Icons provided by Lucide React
- Built with love for karaoke enthusiasts 🎤
