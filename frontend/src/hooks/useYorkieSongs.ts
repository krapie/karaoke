import { useDocument } from '@yorkie-js/react';
import { useMemo } from 'react';
import type { KaraokeDocument, Song, CreateSongRequest, UpdateSongRequest } from '../types';
import { yorkieService } from '../services/yorkie';

export const useYorkieSongs = (playlistId?: string) => {
  const { root, update, loading, error } = useDocument<KaraokeDocument>();

  const songs = useMemo(() => {
    if (!root || !playlistId) return [];
    return yorkieService.getSongs(root, playlistId);
  }, [root, playlistId]);

  const createSong = async (songData: CreateSongRequest) => {
    if (!root) throw new Error('Document not ready');
    
    return new Promise<Song>((resolve, reject) => {
      try {
        update((root) => {
          const song = yorkieService.createSong(root, songData);
          resolve(song);
        });
      } catch (err) {
        reject(err);
      }
    });
  };

  const updateSong = async (id: string, songData: UpdateSongRequest) => {
    if (!root) throw new Error('Document not ready');
    
    return new Promise<Song>((resolve, reject) => {
      try {
        update((root) => {
          const updatedSong = yorkieService.updateSong(root, id, songData);
          if (updatedSong) {
            resolve(updatedSong);
          } else {
            reject(new Error('Song not found'));
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  };

  const updateSongOrder = async (id: string, order: number) => {
    return updateSong(id, { order });
  };

  const deleteSong = async (id: string) => {
    if (!root) throw new Error('Document not ready');
    
    return new Promise<void>((resolve, reject) => {
      try {
        update((root) => {
          const success = yorkieService.deleteSong(root, id);
          if (success) {
            resolve();
          } else {
            reject(new Error('Song not found'));
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  };

  const reorderSongs = async (newOrderedSongs: Song[]) => {
    if (!root || !playlistId) throw new Error('Document not ready or no playlist selected');
    
    return new Promise<void>((resolve, reject) => {
      try {
        const newOrder = newOrderedSongs.map(song => song.id);
        update((root) => {
          yorkieService.reorderSongs(root, playlistId, newOrder);
          resolve();
        });
      } catch (err) {
        reject(err);
      }
    });
  };

  return {
    songs,
    loading,
    error,
    createSong,
    updateSong,
    updateSongOrder,
    deleteSong,
    reorderSongs,
  };
};
