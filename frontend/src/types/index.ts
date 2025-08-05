export interface Playlist {
  id: string;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  playlistId: string;
  order: number;
  tjNumber?: number;
  lyrics?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlaylistRequest {
  name: string;
}

export interface UpdatePlaylistRequest {
  name?: string;
  order?: number;
}

export interface CreateSongRequest {
  title: string;
  artist: string;
  playlistId: string;
  tjNumber?: number;
  lyrics?: string;
}

export interface UpdateSongRequest {
  title?: string;
  artist?: string;
  tjNumber?: number;
  lyrics?: string;
  order?: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Yorkie Document Root Structure
export interface KaraokeDocument {
  playlists: { [key: string]: Playlist };
  songs: { [key: string]: Song };
  playlistOrder: string[];
  songOrder: { [playlistId: string]: string[] };
}

// Presence data for real-time collaboration
export interface UserPresence {
  clientID: string;
  name?: string;
  color?: string;
  cursor?: {
    playlistId?: string;
    songId?: string;
  };
}
