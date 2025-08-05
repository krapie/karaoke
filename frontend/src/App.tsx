import { useState, useEffect } from 'react';
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

function App() {
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [showSongForm, setShowSongForm] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
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
    createSong,
    updateSong,
    deleteSong,
    reorderSongs,
  } = useYorkieSongs(activePlaylist?.id);

  // Set first playlist as active when playlists load
  useEffect(() => {
    if (playlists.length > 0 && !activePlaylist) {
      setActivePlaylist(playlists[0]);
    }
  }, [playlists, activePlaylist]);

  // Initialize dark theme
  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  const handleCreatePlaylist = async () => {
    setShowCreatePlaylistModal(true);
  };

  const handleCreatePlaylistSubmit = async (name: string) => {
    try {
      const newPlaylist = await createPlaylist(name);
      setActivePlaylist(newPlaylist);
    } catch (error) {
      alert('Failed to create playlist');
      throw error; // Re-throw to let modal handle the error
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

  const handleSongFormSubmit = async (songData: CreateSongRequest | UpdateSongRequest) => {
    try {
      if (editingSong) {
        await updateSong(editingSong.id, songData as UpdateSongRequest);
      } else {
        await createSong(songData as CreateSongRequest);
      }
      setShowSongForm(false);
      setEditingSong(null);
    } catch (error) {
      throw error; // Re-throw to let form handle the error
    }
  };

  const handleSongSelect = (song: Song) => {
    setSelectedSong(song);
  };

  const handleBackToPlaylist = () => {
    setSelectedSong(null);
    setShowSongForm(false);
    setEditingSong(null);
  };    if (playlistsLoading) {
      return (
        <Layout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        </Layout>
      );
    }

  if (playlistsError) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">
            Error loading playlists: {playlistsError?.message || 'Unknown error'}
          </p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Layout onLogoClick={handleBackToPlaylist}>
        {selectedSong ? (
          <SongDetails
            song={selectedSong}
            onBack={() => setSelectedSong(null)}
            onUpdate={async (songId, updates) => {
              await updateSong(songId, updates);
              // Update the selected song with new data
              const updatedSong = songs.find(s => s.id === songId);
              if (updatedSong) {
                setSelectedSong(updatedSong);
              }
            }}
            onDelete={async (songId) => {
              await deleteSong(songId);
            }}
            onEdit={(song) => {
              setEditingSong(song);
              setShowSongForm(true);
              setSelectedSong(null);
            }}
          />
        ) : showSongForm && activePlaylist ? (
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-auto">
            <SongForm
              song={editingSong || undefined}
              playlistId={activePlaylist.id}
              onSubmit={handleSongFormSubmit}
              onCancel={() => {
                setShowSongForm(false);
                setEditingSong(null);
              }}
            />
          </div>
        ) : (
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
                  <Button onClick={() => setShowSongForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Song
                  </Button>
                </div>            {songsLoading ? (
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
        )}
      </Layout>

      {/* Create Playlist Modal */}
      <CreatePlaylistModal
        isOpen={showCreatePlaylistModal}
        onClose={() => setShowCreatePlaylistModal(false)}
        onSubmit={handleCreatePlaylistSubmit}
      />
    </>
  );
}

export default App;
