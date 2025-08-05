import type { KaraokeDocument, Playlist, Song } from '../types';

// Utility functions for working with Yorkie documents
export const yorkieService = {
  // Generate unique IDs
  generateId: (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  // Get all playlists as an array
  getPlaylists: (root: KaraokeDocument): Playlist[] => {
    return root.playlistOrder.map(id => root.playlists[id]).filter(Boolean);
  },

  // Get songs for a specific playlist
  getSongs: (root: KaraokeDocument, playlistId: string): Song[] => {
    const songIds = root.songOrder[playlistId] || [];
    return songIds.map(id => root.songs[id]).filter(Boolean);
  },

  // Create a new playlist
  createPlaylist: (root: KaraokeDocument, name: string): Playlist => {
    const id = yorkieService.generateId();
    const now = new Date().toISOString();
    const order = root.playlistOrder.length;
    
    const playlist: Playlist = {
      id,
      name,
      order,
      createdAt: now,
      updatedAt: now,
    };

    root.playlists[id] = playlist;
    root.playlistOrder.push(id);
    root.songOrder[id] = [];

    return playlist;
  },

  // Update a playlist
  updatePlaylist: (root: KaraokeDocument, id: string, updates: Partial<Playlist>): Playlist | null => {
    const playlist = root.playlists[id];
    if (!playlist) return null;

    const updatedPlaylist = {
      ...playlist,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    root.playlists[id] = updatedPlaylist;
    return updatedPlaylist;
  },

  // Delete a playlist
  deletePlaylist: (root: KaraokeDocument, id: string): boolean => {
    if (!root.playlists[id]) return false;

    // Delete all songs in the playlist
    const songIds = root.songOrder[id] || [];
    songIds.forEach(songId => {
      delete root.songs[songId];
    });

    // Remove playlist and its references
    delete root.playlists[id];
    delete root.songOrder[id];
    
    const index = root.playlistOrder.indexOf(id);
    if (index > -1) {
      root.playlistOrder.splice(index, 1);
    }

    return true;
  },

  // Create a new song
  createSong: (root: KaraokeDocument, songData: Omit<Song, 'id' | 'createdAt' | 'updatedAt' | 'order'>): Song => {
    const id = yorkieService.generateId();
    const now = new Date().toISOString();
    const playlistSongs = root.songOrder[songData.playlistId] || [];
    const order = playlistSongs.length;

    const song: Song = {
      ...songData,
      id,
      order,
      createdAt: now,
      updatedAt: now,
    };

    root.songs[id] = song;
    
    if (!root.songOrder[songData.playlistId]) {
      root.songOrder[songData.playlistId] = [];
    }
    root.songOrder[songData.playlistId].push(id);

    return song;
  },

  // Update a song
  updateSong: (root: KaraokeDocument, id: string, updates: Partial<Song>): Song | null => {
    const song = root.songs[id];
    if (!song) return null;

    const updatedSong = {
      ...song,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    root.songs[id] = updatedSong;
    return updatedSong;
  },

  // Delete a song
  deleteSong: (root: KaraokeDocument, id: string): boolean => {
    const song = root.songs[id];
    if (!song) return false;

    // Remove from song order
    const songIds = root.songOrder[song.playlistId];
    if (songIds) {
      const index = songIds.indexOf(id);
      if (index > -1) {
        songIds.splice(index, 1);
      }
    }

    // Delete the song
    delete root.songs[id];
    return true;
  },

  // Reorder songs in a playlist
  reorderSongs: (root: KaraokeDocument, playlistId: string, newOrder: string[]): void => {
    root.songOrder[playlistId] = newOrder;
    
    // Update order property for each song
    newOrder.forEach((songId, index) => {
      if (root.songs[songId]) {
        root.songs[songId].order = index;
      }
    });
  },

  // Reorder playlists
  reorderPlaylists: (root: KaraokeDocument, newOrder: string[]): void => {
    root.playlistOrder = newOrder;
    
    // Update order property for each playlist
    newOrder.forEach((playlistId, index) => {
      if (root.playlists[playlistId]) {
        root.playlists[playlistId].order = index;
      }
    });
  },
};
