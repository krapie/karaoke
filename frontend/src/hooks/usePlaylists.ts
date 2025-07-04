import { useState, useEffect } from 'react';
import type { Playlist, CreatePlaylistRequest, UpdatePlaylistRequest } from '../types';
import { playlistAPI } from '../services/api';

export const usePlaylists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await playlistAPI.getAll();
      setPlaylists(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch playlists');
    } finally {
      setLoading(false);
    }
  };

  const createPlaylist = async (playlist: CreatePlaylistRequest) => {
    try {
      const newPlaylist = await playlistAPI.create(playlist);
      setPlaylists(prev => [...prev, newPlaylist]);
      return newPlaylist;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create playlist');
      throw err;
    }
  };

  const updatePlaylist = async (id: string, playlist: UpdatePlaylistRequest) => {
    try {
      const updatedPlaylist = await playlistAPI.update(id, playlist);
      setPlaylists(prev => 
        prev.map(p => p.id === id ? updatedPlaylist : p)
      );
      return updatedPlaylist;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update playlist');
      throw err;
    }
  };

  const deletePlaylist = async (id: string) => {
    try {
      await playlistAPI.delete(id);
      setPlaylists(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete playlist');
      throw err;
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  return {
    playlists,
    loading,
    error,
    fetchPlaylists,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
  };
};
