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
  lyrics?: string;
}

export interface UpdateSongRequest {
  title?: string;
  artist?: string;
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
