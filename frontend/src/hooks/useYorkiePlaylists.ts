import { useDocument } from '@yorkie-js/react';
import { useMemo } from 'react';
import type { KaraokeDocument, Playlist } from '../types';
import { yorkieService } from '../services/yorkie';

export const useYorkiePlaylists = () => {
  const { root, update, loading, error } = useDocument<KaraokeDocument>();

  const playlists = useMemo(() => {
    if (!root) return [];
    return yorkieService.getPlaylists(root);
  }, [root]);

  const createPlaylist = async (name: string) => {
    if (!root) throw new Error('Document not ready');
    
    return new Promise<Playlist>((resolve, reject) => {
      try {
        update((root) => {
          const playlist = yorkieService.createPlaylist(root, name);
          resolve(playlist);
        });
      } catch (err) {
        reject(err);
      }
    });
  };

  const updatePlaylist = async (id: string, updates: Partial<Playlist>) => {
    if (!root) throw new Error('Document not ready');
    
    return new Promise<Playlist>((resolve, reject) => {
      try {
        update((root) => {
          const updatedPlaylist = yorkieService.updatePlaylist(root, id, updates);
          if (updatedPlaylist) {
            resolve(updatedPlaylist);
          } else {
            reject(new Error('Playlist not found'));
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  };

  const deletePlaylist = async (id: string) => {
    if (!root) throw new Error('Document not ready');
    
    return new Promise<void>((resolve, reject) => {
      try {
        update((root) => {
          const success = yorkieService.deletePlaylist(root, id);
          if (success) {
            resolve();
          } else {
            reject(new Error('Playlist not found'));
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  };

  const reorderPlaylists = async (newOrder: string[]) => {
    if (!root) throw new Error('Document not ready');
    
    return new Promise<void>((resolve, reject) => {
      try {
        update((root) => {
          yorkieService.reorderPlaylists(root, newOrder);
          resolve();
        });
      } catch (err) {
        reject(err);
      }
    });
  };

  return {
    playlists,
    loading,
    error,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    reorderPlaylists,
  };
};
