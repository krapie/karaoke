import { useEffect, useState } from 'react';
import { getSong, deleteSong } from '../api';
import { parseLyrics } from '../parseLyrics';
import type { SongDetail as SongDetailType } from '../types';

interface Props {
  id: number;
  isAdmin: boolean;
  token: string | null;
  onBack: () => void;
  onDeleted: () => void;
}

export default function SongDetail({ id, isAdmin, token, onBack, onDeleted }: Props) {
  const [song, setSong] = useState<SongDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSong(id).then(setSong).finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!token) return;
    if (!confirm('Delete this song?')) return;
    await deleteSong(token, id);
    onDeleted();
  }

  if (loading) return <p className="kp-empty">Loading…</p>;
  if (!song) return <p className="kp-empty">Song not found.</p>;

  const verses = parseLyrics(song.lyrics);

  return (
    <div className="kp-song-detail">
      <button className="back-btn" onClick={onBack}>← back</button>

      <div className="song-header">
        <div>
          <h1>{song.title}</h1>
          {song.singer && <p className="singer-name">{song.singer}</p>}
          {song.tj_number && (
            <span className="kp-tj-badge" style={{ marginTop: '6px', display: 'inline-block' }}>
              TJ {song.tj_number}
            </span>
          )}
        </div>
        {isAdmin && (
          <button className="btn-danger" onClick={handleDelete}>Delete</button>
        )}
      </div>

      <div className="kp-lyrics">
        {verses.map((verse, i) => (
          <div key={i} className="kp-verse">
            <p className="line-jp">{verse.japanese}</p>
            <p className="line-phonetic">{verse.phonetic}</p>
            <p className="line-translation">{verse.translation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
