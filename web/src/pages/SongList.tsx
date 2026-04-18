import { useEffect, useState } from 'react';
import { getSongs, deleteSong } from '../api';
import type { Song } from '../types';

interface Props {
  isAdmin: boolean;
  token: string | null;
  onSelect: (id: number) => void;
}

type Tab = 'songs' | 'singers';

export default function SongList({ isAdmin, token, onSelect }: Props) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('songs');
  const [selectedSinger, setSelectedSinger] = useState<string | null>(null);

  useEffect(() => {
    getSongs().then(setSongs).finally(() => setLoading(false));
  }, []);

  async function handleDelete(e: React.MouseEvent, id: number) {
    e.stopPropagation();
    if (!token) return;
    if (!confirm('Delete this song?')) return;
    await deleteSong(token, id);
    setSongs(songs.filter(s => s.id !== id));
  }

  const filtered = songs.filter(s =>
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    (s.singer && s.singer.toLowerCase().includes(query.toLowerCase())) ||
    (s.tj_number && s.tj_number.includes(query))
  );

  const singers = Array.from(
    new Set(songs.map(s => s.singer).filter(Boolean) as string[])
  ).sort();

  const singerSongs = selectedSinger
    ? songs.filter(s => s.singer === selectedSinger)
    : [];

  if (loading) return <p className="text-gray-500 text-center py-16">Loading...</p>;

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-800">
        {(['songs', 'singers'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setSelectedSinger(null); setQuery(''); }}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
              tab === t
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'songs' && (
        <>
          <input
            type="text"
            placeholder="Search songs, singer, or TJ number..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 mb-6"
          />
          {filtered.length === 0 ? (
            <p className="text-gray-500 text-center py-16">No songs found.</p>
          ) : (
            <ul className="space-y-2">
              {filtered.map(song => (
                <SongRow
                  key={song.id}
                  song={song}
                  isAdmin={isAdmin}
                  onSelect={onSelect}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          )}
        </>
      )}

      {tab === 'singers' && !selectedSinger && (
        <>
          {singers.length === 0 ? (
            <p className="text-gray-500 text-center py-16">No singers added yet.</p>
          ) : (
            <ul className="space-y-2">
              {singers.map(singer => {
                const count = songs.filter(s => s.singer === singer).length;
                return (
                  <li
                    key={singer}
                    onClick={() => setSelectedSinger(singer)}
                    className="flex items-center justify-between bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg px-4 py-3 cursor-pointer transition-colors"
                  >
                    <span className="font-medium">{singer}</span>
                    <span className="text-xs text-gray-500">{count} {count === 1 ? 'song' : 'songs'}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}

      {tab === 'singers' && selectedSinger && (
        <>
          <button
            onClick={() => setSelectedSinger(null)}
            className="text-sm text-gray-500 hover:text-gray-300 mb-4 transition-colors"
          >
            ← Singers
          </button>
          <h2 className="text-lg font-semibold mb-4">{selectedSinger}</h2>
          <ul className="space-y-2">
            {singerSongs.map(song => (
              <SongRow
                key={song.id}
                song={song}
                isAdmin={isAdmin}
                onSelect={onSelect}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function SongRow({ song, isAdmin, onSelect, onDelete }: {
  song: Song;
  isAdmin: boolean;
  onSelect: (id: number) => void;
  onDelete: (e: React.MouseEvent, id: number) => void;
}) {
  return (
    <li
      onClick={() => onSelect(song.id)}
      className="flex items-center justify-between bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg px-4 py-3 cursor-pointer transition-colors group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="min-w-0">
          <span className="font-medium truncate block">{song.title}</span>
          {song.singer && (
            <span className="text-xs text-gray-500 truncate block">{song.singer}</span>
          )}
        </div>
        {song.tj_number && (
          <span className="shrink-0 text-xs bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 px-2 py-0.5 rounded-full">
            TJ {song.tj_number}
          </span>
        )}
      </div>
      {isAdmin && (
        <button
          onClick={e => onDelete(e, song.id)}
          className="opacity-0 group-hover:opacity-100 ml-3 text-red-500 hover:text-red-400 text-sm shrink-0 transition-opacity"
        >
          Delete
        </button>
      )}
    </li>
  );
}
