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

  if (loading) return <p className="text-gray-500 text-center py-16">Loading...</p>;
  if (!song) return <p className="text-gray-500 text-center py-16">Song not found.</p>;

  const verses = parseLyrics(song.lyrics);

  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-300 mb-2 transition-colors">
            ← Back
          </button>
          <h1 className="text-2xl font-bold">{song.title}</h1>
          {song.singer && (
            <p className="text-sm text-gray-400 mt-1">{song.singer}</p>
          )}
          {song.tj_number && (
            <span className="mt-1 inline-block text-xs bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 px-2 py-0.5 rounded-full">
              TJ {song.tj_number}
            </span>
          )}
        </div>
        {isAdmin && (
          <button
            onClick={handleDelete}
            className="shrink-0 px-3 py-1.5 border border-red-800 text-red-500 hover:bg-red-900/30 rounded-lg text-sm transition-colors"
          >
            Delete
          </button>
        )}
      </div>

      <div className="space-y-5">
        {verses.map((verse, i) => (
          <div key={i} className="border-l-2 border-gray-800 pl-4">
            <p className="text-xs text-gray-500 mb-0.5">{verse.japanese}</p>
            <p className="text-lg font-medium text-white leading-snug">{verse.phonetic}</p>
            <p className="text-sm text-gray-400 mt-0.5">{verse.translation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
