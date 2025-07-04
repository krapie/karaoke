
import { useState, useEffect } from 'react';
import type { Song, CreateSongRequest, UpdateSongRequest } from '../types';
import { songAPI } from '../services/api';

export const useSongs = (playlistId?: string) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await songAPI.getAll(playlistId);
      setSongs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch songs');
    } finally {
      setLoading(false);
    }
  };

  const createSong = async (song: CreateSongRequest) => {
    try {
      const newSong = await songAPI.create(song);
      setSongs(prev => [...prev, newSong]);
      return newSong;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create song');
      throw err;
    }
  };

  const updateSong = async (id: string, song: UpdateSongRequest) => {
    try {
      const updatedSong = await songAPI.update(id, song);
      setSongs(prev => 
        prev.map(s => s.id === id ? updatedSong : s)
      );
      return updatedSong;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update song');
      throw err;
    }
  };

  const updateSongOrder = async (id: string, order: number) => {
    try {
      const updatedSong = await songAPI.updateOrder(id, order);
      setSongs(prev => 
        prev.map(s => s.id === id ? updatedSong : s)
      );
      return updatedSong;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update song order');
      throw err;
    }
  };

  const deleteSong = async (id: string) => {
    try {
      await songAPI.delete(id);
      setSongs(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete song');
      throw err;
    }
  };

  const reorderSongs = (dragIndex: number, hoverIndex: number) => {
    setSongs(prev => {
      const draggedSong = prev[dragIndex];
      const newSongs = [...prev];
      newSongs.splice(dragIndex, 1);
      newSongs.splice(hoverIndex, 0, draggedSong);
      return newSongs;
    });
  };

  useEffect(() => {
    fetchSongs();
  }, [playlistId]);

  return {
    songs,
    loading,
    error,
    fetchSongs,
    createSong,
    updateSong,
    updateSongOrder,
    deleteSong,
    reorderSongs,
  };
};
