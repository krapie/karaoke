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

  if (loading) return <p className="kp-empty">Loading…</p>;

  return (
    <div>
      {singers.length > 0 && (
        <div className="kp-tabs">
          <button
            className={'kp-tab' + (activeSinger === null ? ' active' : '')}
            onClick={() => setActiveSinger(null)}
          >
            all
          </button>
          {singers.map(singer => (
            <button
              key={singer}
              className={'kp-tab' + (activeSinger === singer ? ' active' : '')}
              onClick={() => { setActiveSinger(singer); setQuery(''); }}
            >
              {singer}
            </button>
          ))}
        </div>
      )}

      <input
        type="text"
        placeholder="search songs or TJ number…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="kp-input"
      />

      {filtered.length === 0 ? (
        <p className="kp-empty">No songs found.</p>
      ) : (
        <ul className="kp-song-list">
          {filtered.map(song => (
            <li
              key={song.id}
              className="kp-song-item"
              onClick={() => onSelect(song.id)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && onSelect(song.id)}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="kp-song-title">{song.title}</div>
                {song.singer && !activeSinger && (
                  <div className="kp-song-singer">{song.singer}</div>
                )}
              </div>
              {song.tj_number && (
                <span className="kp-tj-badge">TJ {song.tj_number}</span>
              )}
              {isAdmin && (
                <button
                  className="kp-delete-btn"
                  onClick={e => handleDelete(e, song.id)}
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
