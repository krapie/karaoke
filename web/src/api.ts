import type { Song, SongDetail } from './types';

const BASE = '/api';

function authHeaders(token: string) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

export async function getSongs(): Promise<Song[]> {
  const res = await fetch(`${BASE}/songs`);
  if (!res.ok) throw new Error('Failed to fetch songs');
  return res.json();
}

export async function getSong(id: number): Promise<SongDetail> {
  const res = await fetch(`${BASE}/songs/${id}`);
  if (!res.ok) throw new Error('Failed to fetch song');
  return res.json();
}

export async function createSong(
  token: string,
  data: { title: string; singer?: string; tj_number?: string; lyrics: string }
): Promise<{ id: number }> {
  const res = await fetch(`${BASE}/songs`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error('Failed to create song');
  return res.json();
}

export async function deleteSong(token: string, id: number): Promise<void> {
  const res = await fetch(`${BASE}/songs/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error('Failed to delete song');
}
