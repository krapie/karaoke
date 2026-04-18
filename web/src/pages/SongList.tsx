import { useEffect, useState } from 'react';
import { getSongs, deleteSong } from '../api';
import type { Song } from '../types';

interface Props {
  isAdmin: boolean;
  token: string | null;
  onSelect: (id: number) => void;
}

export default function SongList({ isAdmin, token, onSelect }: Props) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeSinger, setActiveSinger] = useState<string | null>(null);

  useEffect(() => {
    getSongs().then(setSongs).finally(() => setLoading(false));
  }, []);

  async function handleDelete(e: React.MouseEvent, id: number) {
    e.stopPropagation();
    if (!token) return;
    if (!confirm('Delete this song?')) return;
    await deleteSong(token, id);
    setSongs(prev => prev.filter(s => s.id !== id));
  }

  const singers = Array.from(
    new Set(songs.map(s => s.singer).filter(Boolean) as string[])
  ).sort();

  const filtered = songs.filter(s => {
    const matchesSinger = activeSinger ? s.singer === activeSinger : true;
    const matchesQuery =
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      (s.singer && s.singer.toLowerCase().includes(query.toLowerCase())) ||
      (s.tj_number && s.tj_number.includes(query));
    return matchesSinger && matchesQuery;
  });

  if (loading) return <p className="text-gray-500 text-center py-16">Loading...</p>;

  return (
    <div>
      {/* Singer filter tabs */}
      {singers.length > 0 && (
        <div className="flex gap-1 flex-wrap mb-5 border-b border-gray-800 pb-0">
          <button
            onClick={() => setActiveSinger(null)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeSinger === null
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            All
          </button>
          {singers.map(singer => (
            <button
              key={singer}
              onClick={() => { setActiveSinger(singer); setQuery(''); }}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeSinger === singer
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {singer}
            </button>
          ))}
        </div>
      )}

      <input
        type="text"
        placeholder="Search songs or TJ number..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 mb-4"
      />

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-16">No songs found.</p>
      ) : (
        <ul className="space-y-2">
          {filtered.map(song => (
            <li
              key={song.id}
              onClick={() => onSelect(song.id)}
              className="flex items-center justify-between bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg px-4 py-3 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0">
                  <span className="font-medium truncate block">{song.title}</span>
                  {song.singer && !activeSinger && (
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
                  onClick={e => handleDelete(e, song.id)}
                  className="opacity-0 group-hover:opacity-100 ml-3 text-red-500 hover:text-red-400 text-sm shrink-0 transition-opacity"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
