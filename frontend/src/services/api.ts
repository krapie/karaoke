import axios from 'axios';
import type { 
  Playlist, 
  Song, 
  CreatePlaylistRequest, 
  UpdatePlaylistRequest, 
  CreateSongRequest, 
  UpdateSongRequest,
  ApiResponse
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Playlist API
export const playlistAPI = {
  getAll: async (): Promise<Playlist[]> => {
    const response = await api.get<ApiResponse<Playlist[]>>('/playlists');
    return response.data.data;
  },

  getById: async (id: string): Promise<Playlist> => {
    const response = await api.get<ApiResponse<Playlist>>(`/playlists/${id}`);
    return response.data.data;
  },

  create: async (playlist: CreatePlaylistRequest): Promise<Playlist> => {
    const response = await api.post<ApiResponse<Playlist>>('/playlists', playlist);
    return response.data.data;
  },

  update: async (id: string, playlist: UpdatePlaylistRequest): Promise<Playlist> => {
    const response = await api.put<ApiResponse<Playlist>>(`/playlists/${id}`, playlist);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/playlists/${id}`);
  },
};

// Song API
export const songAPI = {
  getAll: async (playlistId?: string): Promise<Song[]> => {
    const params = playlistId ? { playlistId } : {};
    const response = await api.get<ApiResponse<Song[]>>('/songs', { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<Song> => {
    const response = await api.get<ApiResponse<Song>>(`/songs/${id}`);
    return response.data.data;
  },

  create: async (song: CreateSongRequest): Promise<Song> => {
    const response = await api.post<ApiResponse<Song>>('/songs', song);
    return response.data.data;
  },

  update: async (id: string, song: UpdateSongRequest): Promise<Song> => {
    const response = await api.put<ApiResponse<Song>>(`/songs/${id}`, song);
    return response.data.data;
  },

  updateOrder: async (id: string, order: number): Promise<Song> => {
    const response = await api.put<ApiResponse<Song>>(`/songs/${id}/order`, { order });
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/songs/${id}`);
  },
};

export default api;
