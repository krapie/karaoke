import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Layout } from './components/layout';
import { PlaylistTabs, CreatePlaylistModal } from './components/playlist';
import { SongList } from './components/song/SongList';
import { SongForm } from './components/song/SongForm';
import { SongDetails } from './components/song/SongDetails';
import { Button } from './components/ui';
import { useYorkiePlaylists } from './hooks/useYorkiePlaylists';
import { useYorkieSongs } from './hooks/useYorkieSongs';
import type { Playlist, Song, CreateSongRequest, UpdateSongRequest } from './types';

// Helper function to get the current session path
const useSessionPath = () => {
  const { sessionId } = useParams<{ sessionId?: string }>();
  return sessionId ? `/${sessionId}` : '';
};

function PlaylistView() {
  const navigate = useNavigate();
  const sessionPath = useSessionPath();
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);

  const {
    playlists,
    loading: playlistsLoading,
    error: playlistsError,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
  } = useYorkiePlaylists();

  const {
    songs,
    loading: songsLoading,
    error: songsError,
    reorderSongs,
  } = useYorkieSongs(activePlaylist?.id);

  // Set first playlist as active when playlists load
  useEffect(() => {
    if (playlists.length > 0 && !activePlaylist) {
      setActivePlaylist(playlists[0]);
    }
  }, [playlists, activePlaylist]);

  const handleCreatePlaylist = async () => {
    setShowCreatePlaylistModal(true);
  };

  const handleCreatePlaylistSubmit = async (name: string) => {
    try {
      const newPlaylist = await createPlaylist(name);
      setActivePlaylist(newPlaylist);
    } catch (error) {
      alert('Failed to create playlist');
      throw error;
    }
  };

  const handleEditPlaylist = async (playlist: Playlist, newName: string) => {
    if (newName !== playlist.name) {
      try {
        await updatePlaylist(playlist.id, { name: newName });
      } catch (error) {
        alert('Failed to update playlist');
      }
    }
  };

  const handleDeletePlaylist = async (playlist: Playlist) => {
    if (confirm(`Are you sure you want to delete "${playlist.name}"?`)) {
      try {
        await deletePlaylist(playlist.id);
        if (activePlaylist?.id === playlist.id) {
          setActivePlaylist(playlists.find(p => p.id !== playlist.id) || null);
        }
      } catch (error) {
        alert('Failed to delete playlist');
      }
    }
  };

  const handleSongSelect = (song: Song) => {
    navigate(`${sessionPath}/song/${song.id}`);
  };

  const handleAddSong = () => {
    navigate(`${sessionPath}/add-song`);
  };

  if (playlistsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (playlistsError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">
          Error loading playlists: {playlistsError?.message || 'Unknown error'}
        </p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <PlaylistTabs
          playlists={playlists}
          activePlaylistId={activePlaylist?.id}
          onPlaylistSelect={setActivePlaylist}
          onCreatePlaylist={handleCreatePlaylist}
          onEditPlaylist={handleEditPlaylist}
          onDeletePlaylist={handleDeletePlaylist}
        />

        {activePlaylist && (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Songs in {activePlaylist.name}
              </h3>
              <Button onClick={handleAddSong}>
                <Plus className="h-4 w-4 mr-2" />
                Add Song
              </Button>
            </div>

            {songsLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
              </div>
            ) : songsError ? (
              <div className="text-center py-8">
                <p className="text-red-600 dark:text-red-400">
                  Error loading songs: {songsError?.message || 'Unknown error'}
                </p>
              </div>
            ) : (
              <SongList
                songs={songs}
                onSongSelect={handleSongSelect}
                onReorderSongs={reorderSongs}
              />
            )}
          </>
        )}

        {playlists.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Welcome to Karaoke!
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Create your first playlist to get started
            </p>
            <Button onClick={handleCreatePlaylist}>
              <Plus className="h-4 w-4 mr-2" />
              Create Playlist
            </Button>
          </div>
        )}
      </div>

      <CreatePlaylistModal
        isOpen={showCreatePlaylistModal}
        onClose={() => setShowCreatePlaylistModal(false)}
        onSubmit={handleCreatePlaylistSubmit}
      />
    </>
  );
}

function SongDetailsView() {
  const { songId } = useParams<{ songId: string }>();
  const navigate = useNavigate();
  const sessionPath = useSessionPath();
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);

  const { playlists } = useYorkiePlaylists();
  const { songs, updateSong, deleteSong } = useYorkieSongs(activePlaylist?.id);

  // Set first playlist as active when playlists load
  useEffect(() => {
    if (playlists.length > 0 && !activePlaylist) {
      setActivePlaylist(playlists[0]);
    }
  }, [playlists, activePlaylist]);

  const song = songs.find(s => s.id === songId);

  const handleBack = () => {
    navigate(sessionPath || '/');
  };

  const handleEdit = (song: Song) => {
    navigate(`${sessionPath}/edit-song/${song.id}`);
  };

  const handleUpdate = async (songId: string, updates: UpdateSongRequest) => {
    await updateSong(songId, updates);
  };

  const handleDelete = async (songId: string) => {
    await deleteSong(songId);
    navigate(sessionPath || '/');
  };

  if (!song) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Song not found</p>
        <Button onClick={handleBack} className="mt-4">
          Back to Playlist
        </Button>
      </div>
    );
  }

  return (
    <SongDetails
      song={song}
      onBack={handleBack}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      onEdit={handleEdit}
    />
  );
}

function SongFormView() {
  const { songId } = useParams<{ songId?: string }>();
  const navigate = useNavigate();
  const sessionPath = useSessionPath();
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);

  const { playlists } = useYorkiePlaylists();
  const { songs, createSong, updateSong } = useYorkieSongs(activePlaylist?.id);

  // Set first playlist as active when playlists load
  useEffect(() => {
    if (playlists.length > 0 && !activePlaylist) {
      setActivePlaylist(playlists[0]);
    }
  }, [playlists, activePlaylist]);

  const editingSong = songId ? songs.find(s => s.id === songId) : null;

  const handleSubmit = async (songData: CreateSongRequest | UpdateSongRequest) => {
    try {
      if (editingSong) {
        await updateSong(editingSong.id, songData as UpdateSongRequest);
      } else {
        await createSong(songData as CreateSongRequest);
      }
      navigate(sessionPath || '/');
    } catch (error) {
      throw error;
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  if (!activePlaylist) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No playlist available</p>
        <Button onClick={() => navigate(sessionPath || '/')} className="mt-4">
          Back to Playlist
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-auto">
      <SongForm
        song={editingSong || undefined}
        playlistId={activePlaylist.id}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}

function App() {
  // Initialize dark theme
  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  return (
    <Layout>
      <Routes>
        {/* Default session route */}
        <Route path="/" element={<PlaylistView />} />
        
        {/* Session-specific routes */}
        <Route path="/:sessionId" element={<PlaylistView />} />
        <Route path="/:sessionId/song/:songId" element={<SongDetailsView />} />
        <Route path="/:sessionId/add-song" element={<SongFormView />} />
        <Route path="/:sessionId/edit-song/:songId" element={<SongFormView />} />
        
        {/* Default session specific routes (for root path) */}
        <Route path="/song/:songId" element={<SongDetailsView />} />
        <Route path="/add-song" element={<SongFormView />} />
        <Route path="/edit-song/:songId" element={<SongFormView />} />
      </Routes>
    </Layout>
  );
}

export default App;
